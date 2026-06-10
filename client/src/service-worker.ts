/* Service Worker: precaching + runtime caching for APIs and common assets
	 - Uses Workbox modules (injected by `vite-plugin-pwa` injectManifest)
	 - Precaches build assets via `self.__WB_MANIFEST`
	 - Runtime caches:
		 * NetworkFirst for same-origin `/api/` calls (keeps API data fresh)
		 * StaleWhileRevalidate for images (fast responses, background update)
		 * CacheFirst for Google Fonts with long expiration
*/

import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

// Precache assets injected at build time by the injectManifest step
// @ts-ignore - __WB_MANIFEST is injected by workbox during the build
precacheAndRoute(self.__WB_MANIFEST || []);

// Runtime caching: API requests to same-origin `/api/` - NetworkFirst
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache-v1",
    networkTimeoutSeconds: 10,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 24 * 60 * 60 }),
    ],
  }),
);

// Runtime caching: Images - StaleWhileRevalidate
registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "image-cache-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

// Runtime caching: Google Fonts - CacheFirst with long expiration
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-cache-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  }),
);

// SPA navigation route: serve the precached `index.html` (or `/offline.html` if provided)
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

// Optional: listen for skip-waiting message from the client to immediately activate new SW
self.addEventListener("message", (event: any) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

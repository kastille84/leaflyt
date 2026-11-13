# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs

Before acting on any prompt request, read the `.md` files in the root `/docs` folder (e.g. `docs/PRD.md`) and follow them. If a request conflicts with them, flag it before proceeding.

## Overview

Leaflit (repo `leaflyt`) is a virtual flyer distribution system. It is two separate npm projects in one repo:

- **Root**: Express (CommonJS) API in `server.js` + `server/`, plus thin third-party wrappers at the root (`cloudinary.js`, `mailgun.js`, `moderate.js`, `stripe.js`, `supabase.js`).
- **`client/`**: React 19 + TypeScript + Vite PWA (ESM). Has its own `package.json`, and depends on the root package via `"leaflyt": "file:.."`.

## Commands

Root (backend, port 5000 or `PORT`):
- `npm run dev` — runs server (nodemon) and client concurrently
- `npm run server` / `npm run client` — run each separately
- `npm run start-prod` — builds client, then runs the server (which serves `client/dist`)
- There is no backend test suite (`npm test` is a stub).

Client (run from `client/`):
- `npm run dev` — Vite dev server (HTTPS via basic-ssl, `host: true`)
- `npm run build` — `tsc --noEmitOnError false && vite build`
- `npm run lint` — eslint
- `npm test` — vitest in **watch** mode with coverage; use `npm run coverage` for a single run
- Single test: `npx vitest run tests/features/path/File.test.tsx` (add `-t "name"` to filter by test name)
- `npm run test:e2e` — Playwright (`client/e2e/`)

Vitest is configured with `browser.enabled: true` (Playwright chromium, `headless: false`), so tests open a real browser window. Tests live only in `client/tests/` (mirroring `src/`) and match `tests/**/*.test.{ts,tsx}`. Coverage threshold is 90%, excluding `context/`, `interfaces/`, `constants/`, `styles/` and fixtures.

## Architecture

**Backend** (`server.js`): routes in `server/routes/` → controllers in `server/controllers/` → Supabase/Stripe/Cloudinary/Mailgun/OpenAI. Mounts `/api/{auth,assets,moderate,email,stripe}` and `/webhook`.
- The Stripe webhook is mounted **before** `bodyParser.json()` so it can read the raw body. Keep that order.
- CORS is restricted to `leaflit.us` in production and open otherwise.
- In production the server also serves `client/dist` and falls back to `index.html` for all other GET routes (SPA).
- `node-cron` jobs in `server.js` delete flagged flyers daily at 5am. The unregistered and expired flyer deletions are commented out on purpose (TODOs).
- Error middleware in `server.js` returns `{ error }` with `error.statusCode`. `server/utility/error.js` has the helpers.
- `.env` is loaded by dotenv only when `NODE_ENV !== "production"`.

**Frontend** (`client/src/`):
- `features/` holds domain modules (account, createFlyer, board, map, single_flyer, template, statistics, …). `ui/` has shared components, `pages/` and `partials/` the routing/layout.
- Global state is React Context (`context/`: Global, AssetSelection, FlyerDesigner, Stripe). Do not use Redux or MobX.
- Data fetching: TanStack Query hooks in `hooks/`, calling API wrapper modules in `services/` (`apiFlyers.ts`, `apiUser.ts`, …). Some services talk to Supabase directly from the client (`services/supabase.ts`), and the rest go through the Express `/api` routes.
- Styling is styled-components only. Routing is React Router v7. Forms use react-hook-form.
- PWA: `vite-plugin-pwa` with `injectManifest` and a custom `src/service-worker.ts`.
- Vite maps `VITE_*` env vars to `process.env.VITE_*` (see `vite.config.ts`), so client code reads them via `process.env`.

## Other notes

- `.github/agents/` defines an "Offline Flyer Builder" agent workflow (scrape site → upload media to Cloudinary → build CSV → insert flyers into Supabase). Use it only when asked to build a flyer. See `.github/agents/OfflineFlyerBuilder.Agent.md`.
- `.github/copilot-instructions.md` is partly out of date (e.g. it says `npm run start`, which doesn't exist). Prefer the commands above.
- Branching: feature branches are merged into `develop` via PR, then into `main`.

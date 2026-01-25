import { StrictMode } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { createRoot } from "react-dom/client";
// import { ClerkProvider } from "@clerk/clerk-react";

import "./index.css";
import App from "./App.tsx";
import { keysBasedOnEnv } from "./utils/GeneralUtils.tsx";

// Import your Publishable Key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

const API_KEY = keysBasedOnEnv().google.mapsApiKey;
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <APIProvider apiKey={API_KEY} libraries={["places"]}>
    <App />
  </APIProvider>

  // </StrictMode>,
);

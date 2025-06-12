import { StrictMode } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY!;
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <APIProvider apiKey={API_KEY} libraries={["places"]}>
    <App />
  </APIProvider>
  // </StrictMode>,
);

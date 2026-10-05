import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = document.getElementById("root");

// Dev-only motion lab at /motion (removed from production builds).
if (import.meta.env.DEV && location.pathname === "/motion") {
  import("./dev/MotionLab.jsx").then(({ default: MotionLab }) =>
    createRoot(root).render(
      <StrictMode>
        <MotionLab />
      </StrictMode>,
    ),
  );
} else {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  // Production HTML is pre-rendered (scripts/prerender.js), so hydrate it; dev renders fresh.
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

// Used at build time by scripts/prerender.js to bake the full page into index.html.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

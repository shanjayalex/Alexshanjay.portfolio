import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { findPage } from "./lib/seo.js";
import ServicePage from "./pages/ServicePage.jsx";

const root = document.getElementById("root");
const page = findPage(location.pathname);
const app = <StrictMode>{page ? <ServicePage page={page} /> : <App />}</StrictMode>;

// Production HTML is pre-rendered (scripts/prerender.js), so hydrate it; dev renders fresh.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

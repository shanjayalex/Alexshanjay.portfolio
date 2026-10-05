import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { seoPages } from "./data/content.js";
import { findPage, headTags, pagePath, tagsToHtml } from "./lib/seo.js";
import ServicePage from "./pages/ServicePage.jsx";

// Used at build time by scripts/prerender.js to bake every page into static HTML.
export const routes = ["/", ...seoPages.map((p) => pagePath(p))];

export function render(path = "/") {
  const page = findPage(path);
  return renderToString(<StrictMode>{page ? <ServicePage page={page} /> : <App />}</StrictMode>);
}

export function head(path = "/") {
  return tagsToHtml(headTags(findPage(path)));
}

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { findPage, headTags } from "./src/lib/seo.js";

// Dev: injects the SEO head tags for the requested URL (src/lib/seo.js).
// Build: only adds the font preload — scripts/prerender.js writes each page's
// own head tags when it bakes the HTML for "/" and every landing page.
function siteHead() {
  return {
    name: "site-head",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) {
          const page = findPage(new URL(ctx.originalUrl ?? ctx.path, "http://localhost").pathname);
          return { html, tags: headTags(page).map((t) => ({ ...t, injectTo: "head" })) };
        }
        // Only the script face: it's what the pre-rendered preloader sheet paints first.
        // The rest load while the preloader runs, without competing with the CSS.
        const preload = /mrs-saint-delafield-latin-400-normal.*\.woff2$/;
        const tags = Object.keys(ctx.bundle)
          .filter((f) => preload.test(f))
          .map((file) => ({ tag: "link", attrs: { rel: "preload", href: `/${file}`, as: "font", type: "font/woff2", crossorigin: "" }, injectTo: "head" }));
        return { html, tags };
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteHead()],
  // The pre-render bundle inlines dependencies (gsap ships ESM files Node can't import directly).
  ssr: { noExternal: true },
  build: {
    rolldownOptions: {
      output: {
        // Separate long-lived vendor chunks so content edits don't bust their cache.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "motion", test: /node_modules[\\/](gsap|lenis|framer-motion|motion-dom|motion-utils)[\\/]/ },
          ],
        },
      },
    },
  },
});

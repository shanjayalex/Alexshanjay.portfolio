import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { profile, shorts, site, socials, studio, videos } from "./src/data/content.js";
import { thumb, watchUrl, parseId } from "./src/lib/youtube.js";

const absolute = (path) => (site.url ? new URL(path, site.url).href : path);

function structuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.fullName,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    image: absolute(profile.photo),
    address: { "@type": "PostalAddress", addressLocality: "Jaffna", addressRegion: "Northern Province", addressCountry: "LK" },
    worksFor: { "@type": "Organization", name: studio.name, url: studio.url },
    sameAs: [...socials.map((s) => s.href).filter(Boolean), studio.url],
    ...(site.url && { url: site.url }),
  };
  const videoObjects = [
    ...videos.map((v) => ({ ...v, vertical: false })),
    ...shorts.map((v) => ({ ...v, vertical: true })),
  ].map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: `${v.category} by ${profile.name} — ${profile.title}.`,
    thumbnailUrl: thumb(v.id, v.vertical),
    embedUrl: `https://www.youtube.com/embed/${parseId(v.id)}`,
    url: watchUrl(v.id, v.vertical),
    creator: { "@type": "Person", name: profile.name },
  }));
  return [person, ...videoObjects];
}

// Injects SEO tags from content.js and preloads the two hero fonts.
function siteHead() {
  return {
    name: "site-head",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const meta = (attrs) => ({ tag: "meta", attrs, injectTo: "head" });
        const tags = [
          { tag: "title", children: site.title, injectTo: "head" },
          meta({ name: "description", content: site.description }),
          meta({ name: "author", content: profile.name }),
          meta({ property: "og:type", content: "website" }),
          meta({ property: "og:title", content: site.title }),
          meta({ property: "og:description", content: site.description }),
          meta({ property: "og:image", content: absolute(site.ogImage) }),
          meta({ property: "og:image:width", content: "1200" }),
          meta({ property: "og:image:height", content: "630" }),
          meta({ name: "twitter:card", content: "summary_large_image" }),
          meta({ name: "twitter:title", content: site.title }),
          meta({ name: "twitter:description", content: site.description }),
          meta({ name: "twitter:image", content: absolute(site.ogImage) }),
          { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(structuredData()), injectTo: "head" },
        ];
        // First hero card thumbnail is the LCP element — make it discoverable from the HTML.
        tags.push({
          tag: "link",
          attrs: { rel: "preload", as: "image", href: thumb(videos[0].id)[0], fetchpriority: "high" },
          injectTo: "head",
        });
        if (site.url) {
          tags.push({ tag: "link", attrs: { rel: "canonical", href: site.url }, injectTo: "head" });
          tags.push(meta({ property: "og:url", content: site.url }));
        }
        if (ctx.bundle) {
          const preload = /(archivo-latin-wdth-normal|mrs-saint-delafield-latin-400-normal).*\.woff2$/;
          for (const file of Object.keys(ctx.bundle).filter((f) => preload.test(f))) {
            tags.push({
              tag: "link",
              attrs: { rel: "preload", href: `/${file}`, as: "font", type: "font/woff2", crossorigin: "" },
              injectTo: "head",
            });
          }
        }
        return { html, tags };
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteHead()],
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

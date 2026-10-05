import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { faq, packages, profile, shorts, site, socials, studio, videos } from "./src/data/content.js";
import { thumb, watchUrl, parseId } from "./src/lib/youtube.js";

const absolute = (path) => (site.url ? new URL(path, site.url).href : path);
const id = (hash) => absolute(`/#${hash}`);
const address = { "@type": "PostalAddress", addressLocality: "Jaffna", addressRegion: "Northern Province", addressCountry: "LK" };
const personAddress = { "@type": "PostalAddress", addressLocality: profile.location.split(",")[0], addressCountry: "LK" };

// One connected JSON-LD graph: Person ↔ business ↔ website ↔ FAQ ↔ videos.
function structuredData() {
  const person = {
    "@type": "Person",
    "@id": id("person"),
    name: profile.name,
    alternateName: profile.fullName,
    jobTitle: ["Video Editor", "Graphic Designer"],
    description: site.description,
    url: absolute("/"),
    image: absolute(profile.photo),
    homeLocation: { "@type": "Place", name: profile.locationLong },
    email: `mailto:${profile.email}`,
    telephone: profile.phone.replaceAll(" ", ""),
    address: personAddress,
    worksFor: [{ "@type": "Organization", name: profile.now.org }, { "@id": id("business") }],
    knowsAbout: site.knowsAbout,
    sameAs: socials.map((s) => s.href).filter(Boolean),
  };
  const business = {
    "@type": "ProfessionalService",
    "@id": id("business"),
    name: studio.name,
    alternateName: studio.alternateName,
    description: studio.description,
    url: absolute("/"),
    logo: absolute(studio.logo),
    image: absolute(site.ogImage),
    founder: { "@id": id("person") },
    telephone: profile.phone.replaceAll(" ", ""),
    email: profile.email,
    priceRange: studio.priceRange,
    currenciesAccepted: "LKR",
    address,
    areaServed: [
      { "@type": "Country", name: "Sri Lanka" },
      { "@type": "City", name: "Jaffna" },
    ],
    sameAs: [studio.url, studio.instagram].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${studio.name} content packages`,
      itemListElement: packages.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: String(p.price),
        priceCurrency: "LKR",
        description: p.description,
      })),
    },
  };
  const website = {
    "@type": "WebSite",
    "@id": id("website"),
    url: absolute("/"),
    name: `${profile.name} — ${studio.name}`,
    publisher: { "@id": id("person") },
    inLanguage: "en",
  };
  const faqPage = {
    "@type": "FAQPage",
    "@id": id("faq"),
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const videoObjects = [
    ...videos.map((v) => ({ ...v, vertical: false })),
    ...shorts.map((v) => ({ ...v, vertical: true })),
  ].map((v) => ({
    "@type": "VideoObject",
    name: v.title,
    description: `${v.category} by ${profile.name} — ${profile.title}.`,
    thumbnailUrl: thumb(v.id, v.vertical),
    embedUrl: `https://www.youtube.com/embed/${parseId(v.id)}`,
    url: watchUrl(v.id, v.vertical),
    creator: { "@id": id("person") },
  }));
  return { "@context": "https://schema.org", "@graph": [person, business, website, faqPage, ...videoObjects] };
}

// Injects SEO tags from content.js and preloads the preloader's script font.
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
          meta({ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" }),
          meta({ property: "og:locale", content: site.locale }),
          meta({ name: "geo.region", content: site.geo.region }),
          meta({ name: "geo.placename", content: site.geo.placename }),
          { tag: "link", attrs: { rel: "alternate", type: "text/plain", title: "LLM summary", href: absolute("/llms.txt") }, injectTo: "head" },
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
        if (site.url) {
          tags.push({ tag: "link", attrs: { rel: "canonical", href: site.url }, injectTo: "head" });
          tags.push(meta({ property: "og:url", content: site.url }));
        }
        if (ctx.bundle) {
          // Only the script face: it's what the pre-rendered preloader sheet paints first.
          // The rest load while the preloader runs, without competing with the CSS.
          const preload = /mrs-saint-delafield-latin-400-normal.*\.woff2$/;
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

// Head tags + JSON-LD for every pre-rendered page (home and the SEO landing
// pages). Used by vite.config.js (dev) and scripts/prerender.js (build).
import { faq, packages, profile, seoPages, shorts, showreel, site, socials, studio, videos } from "../data/content.js";
import { parseId, thumb, watchUrl } from "./youtube.js";

const absolute = (path) => new URL(path, site.url).href;
const id = (hash) => absolute(`/#${hash}`);
export const pagePath = (page) => (page ? `/${page.slug}/` : "/");
export const findPage = (pathname) => seoPages.find((p) => pathname.replace(/\/+$/, "") === `/${p.slug}`) ?? null;

const studioAddress = { "@type": "PostalAddress", addressLocality: "Jaffna", addressRegion: "Northern Province", addressCountry: "LK" };
const personAddress = { "@type": "PostalAddress", addressLocality: profile.location.split(",")[0], addressCountry: "LK" };
const areaServed = [
  { "@type": "Country", name: "Sri Lanka" },
  { "@type": "City", name: "Colombo" },
  { "@type": "City", name: "Jaffna" },
  { "@type": "Country", name: "United Kingdom" },
];

const allVideos = [
  { ...showreel, category: "Showreel", vertical: false },
  ...videos.map((v) => ({ ...v, vertical: false })),
  ...shorts.map((v) => ({ ...v, vertical: true })),
];

function videoObject(v) {
  return {
    "@type": "VideoObject",
    name: v.title,
    description: `${v.title} — ${v.category.toLowerCase()} video edited by ${profile.name}, video editor in Sri Lanka.`,
    thumbnailUrl: thumb(v.id, v.vertical),
    ...(v.uploaded && { uploadDate: v.uploaded }),
    ...(v.seconds && { duration: `PT${v.seconds}S` }),
    embedUrl: `https://www.youtube.com/embed/${parseId(v.id)}`,
    url: watchUrl(v.id, v.vertical),
    creator: { "@id": id("person") },
  };
}

function faqPage(items, url) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

// One connected graph per page: Person ↔ business ↔ website ↔ page ↔ FAQ ↔ videos.
export function structuredData(page) {
  const url = absolute(pagePath(page));
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
    address: studioAddress,
    areaServed,
    sameAs: [studio.url, studio.instagram].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${studio.name} services`,
      itemListElement: [
        ...seoPages.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: p.nav, url: absolute(pagePath(p)) } })),
        ...packages.map((p) => ({ "@type": "Offer", name: p.name, price: String(p.price), priceCurrency: "LKR", description: p.description })),
      ],
    },
  };
  const website = { "@type": "WebSite", "@id": id("website"), url: absolute("/"), name: `${profile.name} — ${studio.name}`, publisher: { "@id": id("person") }, inLanguage: "en" };
  const webPage = {
    "@type": page ? "WebPage" : "ProfilePage",
    "@id": `${url}#webpage`,
    url,
    name: page ? page.title : site.title,
    description: page ? page.description : site.description,
    isPartOf: { "@id": id("website") },
    about: { "@id": id("person") },
    ...(!page && { mainEntity: { "@id": id("person") } }),
    inLanguage: "en",
    dateModified: site.lastmod,
    ...(page && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
  };

  if (!page) {
    return { "@context": "https://schema.org", "@graph": [person, business, website, webPage, faqPage(faq, absolute("/")), ...allVideos.map(videoObject)] };
  }

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: page.nav, item: url },
    ],
  };
  const service = {
    "@type": "Service",
    "@id": `${url}#service`,
    name: page.nav,
    serviceType: page.serviceType,
    description: page.description,
    url,
    provider: [{ "@id": id("person") }, { "@id": id("business") }],
    areaServed,
    ...(page.pricing && {
      offers: page.pricing.map((p) => ({ "@type": "Offer", name: p.name, description: p.price, priceCurrency: "LKR" })),
    }),
  };
  const work = page.work.map((vid) => allVideos.find((v) => v.id === vid)).filter(Boolean);
  return { "@context": "https://schema.org", "@graph": [person, business, website, webPage, breadcrumb, service, faqPage(page.faq, url), ...work.map(videoObject)] };
}

// Tags in Vite's HtmlTagDescriptor shape ({ tag, attrs, children }).
export function headTags(page) {
  const title = page ? page.title : site.title;
  const description = page ? page.description : site.description;
  const url = absolute(pagePath(page));
  const meta = (attrs) => ({ tag: "meta", attrs });
  return [
    { tag: "title", children: title },
    meta({ name: "description", content: description }),
    meta({ name: "author", content: profile.name }),
    meta({ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }),
    { tag: "link", attrs: { rel: "canonical", href: url } },
    meta({ property: "og:locale", content: site.locale }),
    meta({ property: "og:site_name", content: `${profile.name} — ${studio.name}` }),
    meta({ property: "og:type", content: page ? "website" : "profile" }),
    meta({ property: "og:url", content: url }),
    meta({ property: "og:title", content: title }),
    meta({ property: "og:description", content: description }),
    meta({ property: "og:image", content: absolute(site.ogImage) }),
    meta({ property: "og:image:width", content: "1200" }),
    meta({ property: "og:image:height", content: "630" }),
    meta({ property: "og:image:alt", content: `${profile.name} — video editor in Sri Lanka` }),
    meta({ name: "twitter:card", content: "summary_large_image" }),
    meta({ name: "twitter:title", content: title }),
    meta({ name: "twitter:description", content: description }),
    meta({ name: "twitter:image", content: absolute(site.ogImage) }),
    meta({ name: "geo.region", content: site.geo.region }),
    meta({ name: "geo.placename", content: site.geo.placename }),
    { tag: "link", attrs: { rel: "alternate", type: "text/plain", title: "LLM summary", href: absolute("/llms.txt") } },
    { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(structuredData(page)).replaceAll("<", "\\u003c") },
  ];
}

const escapeAttr = (v) => String(v).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const escapeText = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;");

export function tagsToHtml(tags) {
  return tags
    .map(({ tag, attrs = {}, children }) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => (v === "" ? ` ${k}` : ` ${k}="${escapeAttr(v)}"`))
        .join("");
      if (tag === "meta" || tag === "link") return `<${tag}${a}>`;
      const body = tag === "script" ? children : escapeText(children ?? "");
      return `<${tag}${a}>${body}</${tag}>`;
    })
    .join("\n    ");
}

# Alex Shanjay × AX.Visuals — Portfolio

Personal portfolio of **Alex Shanjay**, video editor & graphic designer from Jaffna, Sri Lanka, and founder of [AX.Visuals](https://axvisuals-five.vercel.app/).

The site uses an editorial "Refine Portfolio" look: paper texture, torn-paper edges, stencil display type, an orange script accent, and work cards sitting in grey trays.

**Stack:** React 19 · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger + SplitText) · Lenis · Framer Motion. Fonts are self-hosted via Fontsource (Archivo, Mrs Saint Delafield, Instrument Serif, Manrope, JetBrains Mono).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint      # oxlint
npm run build     # production build → dist/ (pre-rendered, see below)
npm run preview   # serve the build locally
```

## Editing content

All text, links and video IDs live in **`src/data/content.js`**. Components don't hard-code content.

### Add a new video

1. Copy the YouTube link, e.g. `https://youtu.be/oLNeoaWaiGk?si=abc123`.
2. Add an entry to the top of `videos` (long-form, 16:9) or `shorts` (vertical):

   ```js
   { id: "oLNeoaWaiGk", title: "Cinematic Reel", category: "Cinematic", year: 2026 },
   ```

   `id` accepts the bare 11-character ID or the full link; `?si=` tracking params are stripped automatically.
3. Optional: add `featured: true` to the first long-form video to show it full width.

Thumbnails come from YouTube automatically (`maxresdefault`, falling back to `sd`/`hq`; Shorts use the vertical `oardefault`). Players only load when someone clicks.

Move older videos into `archive`. They appear behind the **View older work** button.

### Add design work

Export 1080×1080 WebP files into `public/design/` and set `image` on the matching entry in `designs`. See [`public/design/README.md`](public/design/README.md).

### Other content

| What | Where in `content.js` |
|---|---|
| Name, bio, phone, email, WhatsApp | `profile` |
| Social links (`href: null` hides one) | `socials` |
| Section words (script / ghost / display) | `sections` |
| AX.Visuals card | `studio` |
| Skills, tools marquee | `skills`, `tools` |
| Experience & education | `journey` |
| Services, rates, packages | `services`, `rates`, `packages` |
| FAQ (page + FAQPage schema) | `faq` |
| Site URL, SEO title/description, OG image, AI summary | `site` |

## SEO & AI search

- **Pre-rendered HTML.** `npm run build` renders the whole app to static HTML (`src/entry-server.jsx` → `scripts/prerender.js`), then the browser hydrates it. Search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot), which don't run JavaScript, see every section as plain text. Check with **View Page Source** on the live site.
- **Head tags + JSON-LD** are generated from `content.js` by the `siteHead` plugin in `vite.config.js`: title, description, canonical, Open Graph, robots, geo, and one connected `@graph` with `Person`, `ProfessionalService` (AX.Visuals, with offers), `WebSite`, `FAQPage` and a `VideoObject` per video. The FAQ schema uses the same `faq` array as the visible FAQ, so they always match.
- **Root files** in `public/`: `robots.txt` (allows AI crawlers, links the sitemap), `sitemap.xml`, `llms.txt` (plain-text summary for AI tools). These are hand-written. Update `llms.txt` if prices or services change, and bump `<lastmod>` in `sitemap.xml` (and `site.lastmod`) after content updates.
- **Pre-render rule of thumb:** components must render the same thing on the server and on first load in the browser. Read `window`, `document`, `sessionStorage` or the current time inside `useEffect`/`useLayoutEffect`, not during render.

After deploying, submit `https://www.alexshanjay.live/sitemap.xml` in Google Search Console and Bing Webmaster Tools, and validate the schema at https://validator.schema.org.

## Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo. It detects Vite automatically (build `npm run build`, output `dist`).
3. Point the domain (`www.alexshanjay.live`) at the project. `site.url` in `content.js` must match it, since canonical, `og:image` and schema URLs are built from it.

## Project structure

```
scripts/prerender.js       bakes the rendered app into dist/index.html
src/
  entry-server.jsx         server render entry used by the pre-render step
  data/content.js          all content
  components/sections/     Nav, Preloader, Hero, Showreel, Videos, Shorts, Design,
                           Studio, Services, About, Journey, Faq, Contact, Footer
  components/ui/           Tray, StencilTitle, ScriptWord, SectionHeader, MetaRow,
                           VideoCard, ShortCard, DesignCard, PosterPlaceholder,
                           Lightbox, TornEdge, Thumb, YouTubeFacade, Marquee,
                           MagneticButton, CustomCursor, WhatsAppFab
  hooks/                   useLenis, useGsap, useStaggerIn, useTilt
  lib/                     gsap setup, youtube helpers, scroll lock, type fitting
public/
  design/                  design exports (see README inside)
  images/photo.png         portrait
  brand/                   AX.Visuals logo files (SVG + PNG)
  og.jpg                   1200×630 share image
  llms.txt, robots.txt, sitemap.xml
```

## Accessibility & motion

- `prefers-reduced-motion` turns off Lenis, pinning, parallax and the preloader. Content shows statically.
- The lightbox traps focus. Esc closes it and ←/→ step through items.
- The custom cursor only appears on fine pointers (hidden on touch).
- The preloader plays once per browser session. Later visits get a short fade.

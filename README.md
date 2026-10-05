# Alex Shanjay × AX.Visuals — Portfolio

Personal portfolio of **Alex Shanjay**, video editor & graphic designer from Jaffna, Sri Lanka (now based in Colombo), Video Editor at The Coconut Island UK, and founder of [AX.Visuals](https://axvisuals-five.vercel.app/).

The site uses an editorial "Refine Portfolio" look: paper texture, torn-paper edges, stencil display type, an orange script accent, and work cards sitting in grey trays.

**Stack:** React 19 · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger + SplitText) · Lenis · Framer Motion. Fonts are self-hosted via Fontsource (Archivo, Mrs Saint Delafield, Instrument Serif, Manrope, JetBrains Mono).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint      # oxlint
npm run build     # production build → dist/ (pre-rendered, see below)
npm run preview   # serve the build locally
npm run images    # rebuild the portrait WebPs from /assets (see below)
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

### Change the portrait

1. Replace `assets/portrait-2026.png` with the new photo.
2. Replace `assets/portrait-cutout.png` with the same photo, background removed (transparent PNG). Any background remover works (Photoshop, Firefly, remove.bg, or `@imgly/background-removal-node` locally).
3. Run `npm run images`. It writes `portrait-2026.webp` (+ 640w), `portrait-cutout.webp`, `portrait-cutout-mono.webp` (hero "ink" version) and `portrait-avatar.webp` (Contact) into `public/images/`. The avatar crop is fixed in `scripts/images.js`, so check it after swapping photos.

### Other content

| What | Where in `content.js` |
|---|---|
| Name, bio, phone, email, WhatsApp, current job (`now`), photos | `profile` |
| Social links (`href: null` hides one) | `socials` |
| Section words (script / ghost / display) | `sections` |
| AX.Visuals card | `studio` |
| Skills, grouped tools | `skills`, `tools` |
| Credits band (clients) | `clients` |
| Colour-grade slider stills | `grade` |
| Footer end credits, preloader slate | `credits`, `slate` |
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
assets/                    portrait sources (not deployed) — see "Change the portrait"
scripts/prerender.js       bakes the rendered app into dist/index.html
scripts/images.js          builds the portrait WebPs (npm run images)
src/
  entry-server.jsx         server render entry used by the pre-render step
  data/content.js          all content
  components/sections/     Nav, Preloader, Hero, Showreel, Videos, Shorts, Design,
                           Studio, Services, About, Journey, Faq, Contact, Footer
  components/ui/           Tray, StencilTitle, ScriptWord, SectionHeader, MetaRow,
                           VideoCard, ShortCard, DesignCard, PosterPlaceholder,
                           Lightbox, TornEdge, Thumb, YouTubeFacade, Marquee,
                           MagneticButton, WhatsAppFab, DepthPortrait, CreditsBand,
                           EditTimeline, ScrubThumb, GradeSlider, NowChip, EndCredits
  components/fx/           motion components (see "Motion" below)
  dev/MotionLab.jsx        dev-only effect lab at /motion
  hooks/                   useLenis, useGsap, useStaggerIn, useTilt
  lib/                     gsap setup, motion.js (24 fps timing + eases), fx.js
                           (shared effect state, flash frame), youtube helpers,
                           scroll lock, type fitting
public/
  design/                  design exports (see README inside)
  images/                  generated portraits (npm run images)
  brand/                   AX.Visuals logo files (SVG + PNG)
  og.jpg                   1200×630 share image
  llms.txt, robots.txt, sitemap.xml
```

## Accessibility & motion

- `prefers-reduced-motion` turns off Lenis, pinning, parallax, the preloader and every effect in the Motion table below. Content shows statically, and section changes become a 200ms fade.
- The lightbox traps focus. Esc closes it and ←/→ step through items.
- The viewfinder cursor, magnetic buttons, card tilt and J/K/L only run with a fine pointer (mouse/trackpad), never on touch.
- The preloader plays once per browser session. Later visits get a short fade.
- The page timeline and grade slider are keyboard accessible (timeline clips are buttons; the slider handle takes ←/→, Shift for bigger steps, Home/End).

## Motion

The site is meant to feel *edited*. All timing lives in `src/lib/motion.js`: durations are whole frames at 24 fps (`CUT` 0f, `SNAP` 6f, `QUICK` 10f, `BASE` 18f, `SLOW` 30f, `HERO` 48f), and the eases are named after edit language (`cut`, `dissolve`, `whip`, `keyframe`, `bounce-key`). The budget is at the top of that file: at most 2 pinned sections, at most 1 canvas-type loop, no animated blur above 8px, and ambient loops pause off-screen. Run `npm run dev` and open **/motion** to see each effect on its own.

| Effect | Where | Reduced motion |
|---|---|---|
| Velocity FX: titles squeeze, skew and smear; images RGB-split when fast; "Dropped frames" readout | `fx/VelocityFX` + `.squash` CSS | off |
| Live film grain (12 fps jitter, pauses while the reel plays) | `fx/GrainOverlay` | off (static grain stays) |
| Viewfinder cursor: focus brackets snap to cards (REC/PLAY/VIEW), dot on links, playhead on text, hold to rack-focus | `fx/ViewfinderCursor` | off (native cursor) |
| J/K/L shuttle (L forward 1×/2×/4×, J back, K stop, K+L / K+J step a section) | `fx/JKLControls` | off |
| Section edit transitions: letterbox (Showreel), 9:16 swipe (Shorts), halftone dissolve (Design), orange match cut (Studio), rack focus (About), J-cut label (Journey), dip to paper (FAQ), fade to black title card (Contact) | `fx/EditTransition` | 200ms fade |
| Hero render pass: wireframe → render buckets (on twos) → flash frame → LOG→graded wipe; clips snap from a "bin"; 2.5D dolly on scroll; stack leans away from the cursor | `sections/Hero`, `fx/RenderTitle`, `ui/DepthPortrait` | static hero |
| Episode timecodes, rolling episode numbers, hover skim + RGB parade | `ui/VideoCard`, `fx/RollDigits`, `ui/ScrubThumb` | static numbers (skim still works on hover) |
| Showreel cinema mode: pinned 120vh, grows to full bleed, ambilight, magnetic play button with progress ring, page dims while playing | `sections/Showreel`, `ui/YouTubeFacade` | static card |
| Videos: whip-pan rows (alternating), titles typed on with a caret | `sections/Videos` | static |
| Shorts: 3D phone reel with drag/throw/arrow keys and Ken Burns on the centre card (Draggable + Inertia load on demand, desktop only) | `fx/PhoneCarousel` | native scroll strip |
| Design: CMYK halftone press run per card, orange shared filter pill, push-pin on hover | `fx/HalftoneReveal`, `ui/DesignCard` | static |
| Studio: card spins in from edge-on, tilt + glare, flips to a back face | `sections/Studio` | flip is instant, no tilt |
| Services: graph-editor bezier draws with scroll, keyframe diamonds pop, prices roll | `fx/GraphEditor`, `fx/RollDigits` | curve drawn, diamonds shown |
| About: polaroid LOG→graded wipe, VU-meter skills (peak hold, live jitter), tool dock | `fx/VUMeter`, `fx/ToolDock` | static meters at their values |
| Journey: keyframe track with playhead, diamonds fill as it passes, REC badge, whip-in entries | `sections/Journey` | static |
| FAQ: AE-style twirl-down, one open at a time, diamonds on each answer line | `sections/Faq` | plain open/close |
| Contact: WhatsApp row "exports" (render bar) before opening; other rows glitch on hover | `fx/ExportButton` | opens immediately |
| Footer: end credits roll; AX.VISUALS wordmark fills like a progress bar | `ui/EndCredits`, `sections/Footer` | static |

## Changelog

### v3 — October 2026 · "The Edit Bay"

Motion-only pass on top of v2 (no content or layout rebuild). Adds the frame-based motion system (`src/lib/motion.js`), the global layer (velocity FX, live grain, viewfinder cursor, J/K/L) and a per-section edit transition, and gives each section its own editor-language motion (see **Motion** above). Also adds the dev-only `/motion` lab. The viewfinder cursor replaces the old ring cursor, and VelocityFX replaces the v2 squash hook.

### v2 — October 2026

- **New portrait** (navy blazer) everywhere: hero, About polaroid, Contact avatar, OG image and `Person.image` in JSON-LD. Generated by `scripts/images.js` (sharp) from `/assets`.
- **CV sync:** new role (Video Editor at The Coconut Island UK), bio, journey (Coconut Island, AX.Visuals, Chroma Global, Venom X Technology, education), grouped tools, CV "What I deliver" services, `clients`. Location is Colombo; AX.Visuals stays in Jaffna. `llms.txt`, `sitemap.xml` and JSON-LD updated.
- **Hero depth portrait:** the cut-out stands inside the PORTFOLIO stencil word, with a masked front copy over his shoulders. It rises in after the letters, drifts at its own scroll speed, fades from ink to colour, and follows the mouse slightly.
- **Portrait flight:** in About, the photo flies in from the left edge and settles into the polaroid (wide screens only).
- **Edit timeline:** scroll progress drawn as an NLE timeline at the bottom of the screen, with V1 clips per section, an A1 waveform, a playhead and a timecode. Click a clip to jump there. Desktop only.
- **Slate preloader:** a clapperboard with a rolling timecode that snaps shut before the paper tear.
- **Video cards:** hovering with a mouse scrubs through YouTube's auto frames, with a timecode and scrub bar.
- **Credits band** under the hero, with a NOW pill on the current employer.
- **Colour-grade slider** in About (LOG vs graded wipe). It uses a simulated LOG look until real stills are set in `grade`.
- **REC chip** in the nav linking to Journey.
- **Journey as a film strip**, with sprocket holes, frame numbers and a NOW stamp.
- **End-credits roll** in the footer.
- **Micro-motion:** display words squash on fast scroll, section titles get an RGB-split on hover, and the cursor gets a SCRUB label.

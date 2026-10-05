import { useState } from "react";
import { designs, skills } from "../data/content";
import { CustomEase, gsap } from "../lib/gsap";
import { BASE, CUT, EASE, HERO, QUICK, SLOW, SNAP, f, timecode } from "../lib/motion";
import ExportButton from "../components/fx/ExportButton";
import GraphEditor from "../components/fx/GraphEditor";
import HalftoneReveal from "../components/fx/HalftoneReveal";
import RollDigits from "../components/fx/RollDigits";
import VUMeter from "../components/fx/VUMeter";
import PosterPlaceholder from "../components/ui/PosterPlaceholder";

// Dev-only page (npm run dev → /motion). Not built for production, not in the
// sitemap. Each effect in isolation; "Replay" remounts it. To test the
// reduced-motion fallbacks, toggle DevTools → Rendering → "Emulate CSS media
// feature prefers-reduced-motion" and press Replay.
const DURATIONS = { CUT, SNAP, QUICK, BASE, SLOW, HERO };

function EaseCurve({ name }) {
  const ease = name === "cut" ? gsap.parseEase("steps(1)") : CustomEase.get(name) ?? gsap.parseEase(name);
  const pts = Array.from({ length: 61 }, (_, i) => {
    const t = i / 60;
    return `${t * 100},${80 - ease(t) * 70}`;
  }).join(" ");
  return (
    <figure className="rounded-xl border border-ink/15 bg-paper-2 p-3">
      <svg viewBox="-4 -4 108 92" className="h-28 w-full overflow-visible">
        <rect x="0" y="10" width="100" height="70" fill="none" stroke="rgb(0 0 0 / .1)" />
        <polyline points={pts} fill="none" stroke="var(--orange)" strokeWidth="2" />
      </svg>
      <figcaption className="mono-label mt-2">{name}</figcaption>
    </figure>
  );
}

function Block({ title, note, children }) {
  const [key, setKey] = useState(0);
  return (
    <section className="border-t border-ink/20 py-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="card-title text-2xl">{title}</h2>
        <button type="button" className="pill pill-outline pill-sm" onClick={() => setKey((k) => k + 1)}>
          Replay
        </button>
      </div>
      {note && <p className="mb-6 max-w-2xl">{note}</p>}
      <div key={key}>{children}</div>
    </section>
  );
}

export default function MotionLab() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-40 pt-16">
      <p className="mono-label">Dev only · /motion</p>
      <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">Motion lab</h1>
      <p className="mt-6 max-w-2xl">
        Every effect from <code>src/lib/motion.js</code> and <code>src/components/fx/</code> in isolation. For reduced motion, use DevTools → Rendering → emulate{" "}
        <code>prefers-reduced-motion: reduce</code>, then Replay.
      </p>

      <Block title="Timing — the 24 fps grid">
        <ul className="grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-3">
          {Object.entries(DURATIONS).map(([k, v]) => (
            <li key={k} className="rounded-lg bg-paper-2 p-3">
              <b>{k}</b> = {Math.round(v * 24)} frames · {v.toFixed(3)}s · {timecode(Math.round(v * 24))}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Named eases">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Object.values(EASE).map((name) => (
            <EaseCurve key={name} name={name} />
          ))}
        </div>
      </Block>

      <Block title="RollDigits — flip-clock numbers">
        <p className="card-title text-5xl">
          EP <RollDigits value="08" /> · <RollDigits value="Rs. 25,000" />
        </p>
      </Block>

      <Block title="VUMeter — skills as audio meters" note="Bounce with overshoot, peak-hold line, ±2% jitter every 3–4s while visible.">
        <VUMeter items={skills} />
      </Block>

      <Block title="GraphEditor — bezier speed curve + keyframes" note="Scroll this block through the viewport; the curve draws with scroll and the diamonds pop as it reaches them.">
        <div className="tray relative p-6">
          <GraphEditor />
          <ul className="relative grid gap-6 sm:grid-cols-3">
            {["Ease in", "Hold", "Ease out"].map((t) => (
              <li key={t} className="paper-card group relative min-h-[140px] p-6">
                <span data-key className="keyframe" />
                <span className="mono-label pl-6">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Block>

      <Block title="HalftoneReveal — CMYK press run">
        <div className="grid max-w-md grid-cols-2 gap-4">
          {designs.slice(0, 2).map((d, i) => (
            <div key={d.id} className="aspect-square overflow-hidden rounded-xl">
              <HalftoneReveal>
                <PosterPlaceholder item={d} index={i} />
              </HalftoneReveal>
            </div>
          ))}
        </div>
      </Block>

      <Block title="ExportButton — render bar before opening" note="Hover for the export tooltip; click fills the render bar for 600ms, then opens the link.">
        <ExportButton href="https://example.com/" className="relative flex items-center justify-between overflow-hidden rounded-xl border border-ink/20 px-6 py-8">
          <span className="relative card-title text-3xl">Export test</span>
          <span className="relative mono-label">opens example.com</span>
        </ExportButton>
      </Block>

      <p className="mono-label mt-10">Frame helper: f(12) = {f(12)}s</p>
    </main>
  );
}

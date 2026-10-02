import { useMemo, useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";

const W = 1440;
const H = 48;

function random(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function tornPaths(seed) {
  const rand = random(seed);
  const points = [];
  for (let x = 0; x <= W; x += 5 + rand() * 16) {
    const swell = Math.sin(x / 140 + seed) * 6;
    points.push([x, H * 0.42 + swell + (rand() - 0.5) * 18]);
  }
  points.push([W, H * 0.45]);
  const line = (dy) =>
    points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${(y + dy * (0.4 + rand())).toFixed(1)}`).join("");
  return {
    fiber: `${line(-5)}L${W} ${H}L0 ${H}Z`,
    edge: `${line(0)}L${W} ${H}L0 ${H}Z`,
  };
}

// Jagged torn-paper boundary. `side="top"` sits above its parent section,
// `side="bottom"` hangs below it. `color` should match the parent background.
export default function TornEdge({ color = "var(--ink)", fiber = "var(--paper-2)", side = "top", seed = 7, scrub = true }) {
  const ref = useRef(null);
  const paths = useMemo(() => tornPaths(seed), [seed]);

  useGsap(ref, (mm, el) => {
    if (!scrub) return;
    mm.add(MOTION, () => {
      gsap.fromTo(
        el.querySelector("svg"),
        { yPercent: 45 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 55%", scrub: true },
        },
      );
    });
  });

  return (
    <div ref={ref} className={`torn-edge is-${side}`} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path d={paths.fiber} fill={fiber} opacity="0.9" />
        <path d={paths.edge} fill={color} />
      </svg>
    </div>
  );
}

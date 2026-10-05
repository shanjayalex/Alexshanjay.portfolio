import { useRef, useState } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, MOTION } from "../../lib/gsap";
import { EASE, SNAP } from "../../lib/motion";

// After Effects-style graph editor behind a grid of cards. It finds every
// [data-key] diamond inside its parent, runs one orange bezier speed curve
// through them, draws the curve on with scroll, and pops each keyframe
// diamond (bounce-key) as the curve reaches it. Without motion the curve is
// simply drawn and the diamonds are shown.
export default function GraphEditor() {
  const ref = useRef(null);
  const [d, setD] = useState("");

  useGsap(ref, (mm, el) => {
    const host = el.parentElement;

    function measure() {
      // Layout offsets, not client rects: cards may be mid-entrance (transformed).
      const pts = [...host.querySelectorAll("[data-key]")].map((k) => {
        let x = k.offsetWidth / 2;
        let y = k.offsetHeight / 2;
        for (let n = k; n && n !== host; n = n.offsetParent) {
          x += n.offsetLeft;
          y += n.offsetTop;
        }
        return [x, y];
      });
      if (pts.length < 2) return "";
      let path = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const h = Math.max(40, Math.abs(x1 - x0) * 0.45); // AE-style horizontal handles
        path += ` C${x0 + h},${y0} ${x1 - h},${y1} ${x1},${y1}`;
      }
      return path;
    }

    // Re-measure on every ScrollTrigger refresh (layout, fonts, resize); always on.
    mm.add("all", () => {
      const update = () => setD(measure());
      update();
      ScrollTrigger.addEventListener("refresh", update);
      return () => ScrollTrigger.removeEventListener("refresh", update);
    });

    mm.add(MOTION, () => {
      const keys = [...host.querySelectorAll("[data-key]")];
      gsap.set(keys, { scale: 0 });
      const popped = new Set();
      const curve = el.querySelector("[data-curve]");
      gsap.fromTo(
        curve,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: host,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 0.4,
            onUpdate(self) {
              keys.forEach((key, i) => {
                const reached = self.progress >= i / Math.max(1, keys.length - 1) - 0.001;
                if (reached && !popped.has(i)) {
                  popped.add(i);
                  gsap.to(key, { scale: 1, duration: SNAP * 1.5, ease: EASE.bounceKey });
                } else if (!reached && popped.has(i)) {
                  popped.delete(i);
                  gsap.to(key, { scale: 0, duration: SNAP, ease: EASE.keyframe });
                }
              });
            },
          },
        },
      );
    });
  });

  return (
    <svg ref={ref} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <path d={d} fill="none" stroke="rgb(31 31 33 / 0.18)" strokeWidth="1" />
      <path data-curve d={d} fill="none" stroke="var(--orange)" strokeWidth="2.5" pathLength="1" strokeDasharray="1" strokeLinecap="round" />
    </svg>
  );
}

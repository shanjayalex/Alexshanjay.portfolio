import { useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, MOTION } from "../../lib/gsap";

// Endless row of labels between hairlines. Speeds up (and flips direction) with scroll velocity.
export default function Marquee({ items, className = "" }) {
  const ref = useRef(null);
  const row = [...items, ...items];

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      const track = el.querySelector("[data-track]");
      const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      let direction = 1;
      const settle = gsap.quickTo(loop, "timeScale", { duration: 0.8, ease: "power3" });

      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const v = self.getVelocity();
          if (Math.abs(v) > 20) direction = v > 0 ? 1 : -1;
          loop.timeScale(direction * (1 + Math.min(Math.abs(v) / 250, 6)));
          settle(direction);
        },
      });
    });
  });

  return (
    <div ref={ref} className={`overflow-hidden border-y border-ink/20 py-4 md:py-5 ${className}`}>
      <ul data-track className="flex w-max items-center" aria-label="Tools">
        {row.map((item, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length || undefined}
            className="mono-label flex shrink-0 items-center gap-8 px-4 text-[13px] text-ink md:text-[15px]"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          </li>
        ))}
      </ul>
    </div>
  );
}

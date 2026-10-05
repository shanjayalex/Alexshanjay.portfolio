import { useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";
import { EASE, f } from "../../lib/motion";

const PLATES = [
  { ink: "rgb(0 174 239)", x: 2, y: -1 }, // cyan
  { ink: "rgb(236 0 140)", x: -2, y: 1 }, // magenta
  { ink: "rgb(255 221 0)", x: 1, y: 2 }, // yellow
  { ink: "rgb(31 31 33)", x: -1, y: -2 }, // key
];

// "Press run": the artwork prints in four halftone passes (C, M, Y, K),
// slightly out of register, then snaps into register. Once per item.
export default function HalftoneReveal({ children }) {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      const art = el.querySelector("[data-art]");
      const plates = el.querySelectorAll("[data-plate]");
      gsap.set(art, { autoAlpha: 0, x: 2, y: 2 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      plates.forEach((plate, i) => {
        tl.fromTo(plate, { autoAlpha: 0, x: PLATES[i].x, y: PLATES[i].y }, { autoAlpha: 0.9, duration: f(1), ease: EASE.cut }, i * f(3));
      });
      tl.set(art, { autoAlpha: 1 }, f(12))
        .to(art, { x: 0, y: 0, duration: f(3), ease: EASE.cut }, f(14))
        .to(plates, { autoAlpha: 0, duration: f(6), ease: EASE.dissolve, stagger: f(1) }, f(14));
    });
  });

  return (
    <span ref={ref} className="relative block h-full w-full">
      <span data-art className="block h-full w-full">
        {children}
      </span>
      {PLATES.map((p) => (
        <span key={p.ink} data-plate className="halftone-plate" style={{ "--ink": p.ink }} aria-hidden="true" />
      ))}
    </span>
  );
}

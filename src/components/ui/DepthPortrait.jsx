import { useRef } from "react";
import { profile } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, DESKTOP_MOTION, FINE_POINTER, WIDE_MOTION } from "../../lib/gsap";
import StencilTitle from "./StencilTitle";

// Flat "LOG" look for the grade wipe (also used by the polaroid).
export const LOG_FILTER = "saturate(0.3) contrast(0.8) brightness(1.1)";

// "Depth sandwich": the cut-out portrait stands inside the stencil word.
// Back → front: (parent's) ghost script and stencil word → portrait →
// a masked second copy of the word whose lower letters overlap the suit.
// The parent hero timeline runs the intro: it animates [data-portrait], every
// `.char` (the front copy's too) and the LOG → graded wipe ([data-log],
// [data-wipe]). This component owns the portrait's scroll drift and the
// pointer follow.
export default function DepthPortrait({ title }) {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    const section = el.closest("section");
    const portrait = el.querySelector("[data-portrait]");

    mm.add(DESKTOP_MOTION, () => {
      // Depth: the word layer trails the page by 15% (in Hero), the portrait by 10%.
      gsap.to(portrait, {
        y: () => section.offsetHeight * 0.1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
    });

    mm.add(`${WIDE_MOTION} and ${FINE_POINTER}`, () => {
      const inner = el.querySelector("[data-portrait-inner]");
      const toX = gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3" });
      const toY = gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3" });
      const toR = gsap.quickTo(inner, "rotation", { duration: 0.9, ease: "power3" });
      function onMove(e) {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        toX(nx * 12);
        toY(ny * 12);
        toR(nx * 1.2);
      }
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });
  });

  const img = {
    src: profile.photoCutout,
    srcSet: `${profile.photoCutoutSmall} 640w, ${profile.photoCutout} 1100w`,
    sizes: "(min-width: 768px) 32vw, 70vw",
    alt: "",
    width: "1100",
    height: "1041",
    className: "h-full w-full object-contain object-bottom",
  };

  return (
    <span ref={ref} className="contents">
      <span data-portrait className="depth-portrait" aria-hidden="true">
        <span data-portrait-inner className="relative block h-full w-full">
          <img {...img} fetchPriority="high" />
          {/* LOG copy on top; the intro wipes it away left → right. Hidden unless motion is on. */}
          <span data-log className="absolute inset-0 hidden" style={{ filter: LOG_FILTER }}>
            <img {...img} />
          </span>
          <span data-wipe className="absolute inset-y-[4%] left-0 hidden w-0.5 bg-orange shadow-[0_0_12px_rgb(232_137_28/0.8)]" />
        </span>
      </span>
      <span data-front-word className="depth-front" aria-hidden="true">
        <StencilTitle as="span" text={title} ring reveal={false} className="block" />
      </span>
    </span>
  );
}

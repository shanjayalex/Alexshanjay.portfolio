import { useRef } from "react";
import { profile } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, DESKTOP_MOTION, FINE_POINTER, WIDE_MOTION } from "../../lib/gsap";
import StencilTitle from "./StencilTitle";

// "Depth sandwich": the cut-out portrait stands inside the stencil word.
// Back → front: (parent's) ghost script and stencil word → portrait →
// a masked second copy of the word whose lower letters overlap the suit.
// The parent hero timeline runs the intro (it animates [data-portrait] and
// every `.char`, including the front copy's, and moves the word layers on
// scroll); this component owns the portrait's parallax, the mono → colour
// grade and the pointer follow.
export default function DepthPortrait({ title }) {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    const section = el.closest("section");
    const portrait = el.querySelector("[data-portrait]");

    mm.add(DESKTOP_MOTION, () => {
      const span = () => section.offsetHeight;
      const scrub = { trigger: section, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true };
      // Depth: the word trails the page by 12% (in Hero), the portrait by only 5%.
      gsap.to(portrait, { y: () => span() * 0.05, ease: "none", scrollTrigger: scrub });
      // "Colour grade": the ink portrait fades to colour over the first 30% of the scroll.
      gsap.to(el.querySelector("[data-portrait-mono]"), {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: () => `+=${span() * 0.3}`, scrub: true, invalidateOnRefresh: true },
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

  return (
    <span ref={ref} className="contents">
      <span data-portrait className="depth-portrait" aria-hidden="true">
        <span data-portrait-inner className="relative block h-full w-full">
          {/* Colour version for the scroll "grade" — desktop only, so phones never download it. */}
          <img
            src={profile.photoCutout}
            alt=""
            width="1100"
            height="1041"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 hidden h-full w-full object-contain object-bottom md:block"
          />
          <img
            data-portrait-mono
            src={profile.photoCutoutMono}
            srcSet={`${profile.photoCutoutMonoSmall} 640w, ${profile.photoCutoutMono} 1100w`}
            sizes="(min-width: 768px) 32vw, 70vw"
            alt=""
            width="1100"
            height="1041"
            fetchPriority="high"
            className="relative h-full w-full object-contain object-bottom"
          />
        </span>
      </span>
      <span data-front-word className="depth-front" aria-hidden="true">
        <StencilTitle as="span" text={title} ring reveal={false} className="block" />
      </span>
    </span>
  );
}

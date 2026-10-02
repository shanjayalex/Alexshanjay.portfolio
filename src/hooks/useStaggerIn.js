import { gsap, ScrollTrigger, MOTION } from "../lib/gsap";
import { useGsap } from "./useGsap";

// Cards ([data-card]) inside the scope rise in with a slight rotation as they enter.
export function useStaggerIn(scopeRef, deps = []) {
  useGsap(
    scopeRef,
    (mm, el) => {
      mm.add(MOTION, () => {
        const cards = el.querySelectorAll("[data-card]");
        if (!cards.length) return;
        gsap.set(cards, { y: 60, rotate: 2, autoAlpha: 0 });
        ScrollTrigger.batch(cards, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              rotate: 0,
              autoAlpha: 1,
              stagger: 0.08,
              duration: 1.1,
              ease: "expo.out",
              overwrite: true,
              clearProps: "transform,opacity,visibility",
            }),
        });
      });
    },
    deps,
  );
}

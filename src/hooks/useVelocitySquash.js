import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

// Fast scrolling squeezes the stencil display words (wdth 125 → 105), then
// they spring back. Writes a CSS variable on each `.squash` element only.
export function useVelocitySquash() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const words = document.querySelectorAll(".squash");
    const state = { w: 125 };
    let last = 125;
    const apply = () => {
      if (Math.abs(state.w - last) < 0.25) return;
      last = state.w;
      words.forEach((el) => el.style.setProperty("--squash-wdth", state.w.toFixed(1)));
    };
    const to = gsap.quickTo(state, "w", { duration: 0.45, ease: "power3", onUpdate: apply });
    const settle = gsap.delayedCall(0.15, () => to(125)).pause();

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const v = Math.min(Math.abs(self.getVelocity()) / 3500, 1);
        to(125 - 20 * v);
        settle.restart(true);
      },
    });

    return () => {
      trigger.kill();
      settle.kill();
      words.forEach((el) => el.style.removeProperty("--squash-wdth"));
    };
  }, []);
}

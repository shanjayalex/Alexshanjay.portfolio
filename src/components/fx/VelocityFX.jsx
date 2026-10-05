import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { QUICK } from "../../lib/motion";

// Scroll velocity → "dropped frames". One smoothed 0–1 value drives:
// - display titles (.squash): wdth squeeze, skew and a horizontal smear (CSS, via --vel)
// - images: an RGB edge split above 0.6 (html.is-fast)
// - the live grain's opacity
// - a mono "DROPPED FRAMES" readout that ticks while you scroll fast.
// Writes the variable only on the elements that use it, not on <html>.
export default function VelocityFX() {
  const readout = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const root = document.documentElement;
    let targets = [];
    const collect = () => (targets = [...document.querySelectorAll(".squash")]);
    collect();

    const state = { v: 0 };
    const to = gsap.quickTo(state, "v", { duration: QUICK, ease: "power3" });
    let lastInput = 0;
    let settling = true;
    let written = -1;
    let fast = false;
    let dropped = 0;
    let lastDrop = 0;

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        to(Math.min(Math.abs(self.getVelocity()) / 3000, 1));
        lastInput = performance.now();
        settling = false;
      },
    });
    ScrollTrigger.addEventListener("refresh", collect);

    function tick() {
      const now = performance.now();
      if (!settling && now - lastInput > 120) {
        settling = true;
        to(0);
      }
      const v = state.v;
      if (Math.abs(v - written) > 0.004) {
        written = v;
        const vel = v.toFixed(3);
        const wdth = (125 - 20 * v).toFixed(1);
        targets.forEach((el) => {
          el.style.setProperty("--vel", vel);
          el.style.setProperty("--squash-wdth", wdth);
        });
        const grain = document.querySelector("[data-grain-live]");
        if (grain) grain.style.opacity = String(0.04 + v * 0.06);
      }
      if (v > 0.6 !== fast) {
        fast = v > 0.6;
        root.classList.toggle("is-fast", fast);
      }
      // The joke readout: ticks while fast, resets after 1s idle.
      if (readout.current) {
        if (v > 0.45 && now - lastDrop > 83) {
          dropped += 1 + Math.floor(Math.random() * 3);
          lastDrop = now;
          readout.current.textContent = String(dropped);
        } else if (dropped && now - lastInput > 1000) {
          dropped = 0;
          readout.current.textContent = "0";
        }
      }
    }
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      ScrollTrigger.removeEventListener("refresh", collect);
      root.classList.remove("is-fast");
      targets.forEach((el) => {
        el.style.removeProperty("--vel");
        el.style.removeProperty("--squash-wdth");
      });
    };
  }, []);

  return (
    <p className="pointer-events-none fixed bottom-5 left-5 z-[75] hidden font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-2 md:block lg:bottom-[58px] motion-reduce:!hidden" aria-hidden="true">
      Dropped frames: <span ref={readout}>0</span>
    </p>
  );
}

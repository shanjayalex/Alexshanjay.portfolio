import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { scroller, scrollToTarget } from "../lib/scroll";

// Smooth scroll synced to the GSAP ticker, plus smooth anchor links.
export function useLenis() {
  useEffect(() => {
    function onAnchorClick(e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      e.preventDefault();
      scrollToTarget(id);
      history.replaceState(null, "", id);
    }
    document.addEventListener("click", onAnchorClick);

    if (prefersReducedMotion()) {
      return () => document.removeEventListener("click", onAnchorClick);
    }

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    scroller.lenis = lenis;
    if (scroller.locks) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroller.lenis = null;
    };
  }, []);
}

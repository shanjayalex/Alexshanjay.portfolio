import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { scrollState } from "../lib/scrollProgress";

export function useLenis() {
  const reduced = useReducedMotion();

  useEffect(() => {
    function updateProgressFallback() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
    }

    if (reduced) {
      updateProgressFallback();
      window.addEventListener("scroll", updateProgressFallback, { passive: true });
      window.addEventListener("resize", updateProgressFallback);
      return () => {
        window.removeEventListener("scroll", updateProgressFallback);
        window.removeEventListener("resize", updateProgressFallback);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ({ progress }) => {
      scrollState.progress = progress;
    });

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    function onAnchorClick(e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72 });
    }
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduced]);
}

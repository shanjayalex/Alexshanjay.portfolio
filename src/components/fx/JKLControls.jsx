import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { onIntroDone } from "../../lib/intro";
import { scroller, scrollToTarget } from "../../lib/scroll";

const TIP_KEY = "ax-jkl-tip";
const SPEEDS = [1, 2, 4];
const PX_PER_SEC = 160; // 1× shuttle speed

function typing(target) {
  return target.closest?.("input, textarea, select, [contenteditable=''], [contenteditable=true]");
}

// NLE shuttle keys: L plays forward (again = 2×, 4×), J plays backward, K stops.
// Hold K and tap L / J to step one section forward / back.
// Off for reduced motion and while a lightbox or the menu holds the scroll.
export default function JKLControls() {
  const [speed, setSpeed] = useState(0);
  const [tip, setTip] = useState(false);
  const speedRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    let kHeld = false;

    const set = (v) => {
      speedRef.current = v;
      setSpeed(v);
    };

    function stepSection(dir) {
      const y = window.scrollY;
      const tops = [...document.querySelectorAll("main > section[id], footer")].map((s) => ({ el: s, top: s.getBoundingClientRect().top + y }));
      const next = dir > 0 ? tops.find((t) => t.top > y + 10) : [...tops].reverse().find((t) => t.top < y - 10);
      if (next?.el.id) scrollToTarget(`#${next.el.id}`);
      else if (next) scroller.lenis?.scrollTo(next.el, { duration: 1.2, force: true });
    }

    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target) || scroller.locks) return;
      const key = e.key.toLowerCase();
      if (!["j", "k", "l"].includes(key)) return;
      e.preventDefault();
      if (key === "k") {
        kHeld = true;
        set(0);
        return;
      }
      const dir = key === "l" ? 1 : -1;
      if (kHeld) {
        stepSection(dir);
        return;
      }
      if (e.repeat) return;
      const cur = speedRef.current;
      const level = Math.sign(cur) === dir ? Math.min(SPEEDS.indexOf(Math.abs(cur)) + 1, SPEEDS.length - 1) : 0;
      set(dir * SPEEDS[level]);
    }
    function onKeyUp(e) {
      if (e.key.toLowerCase() === "k") kHeld = false;
    }
    // Any manual scroll input takes over from the shuttle.
    const stop = () => speedRef.current && set(0);

    const tick = (_time, deltaTime) => {
      const v = speedRef.current;
      if (!v || scroller.locks) return;
      const delta = (v * PX_PER_SEC * deltaTime) / 1000;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const current = scroller.lenis ? scroller.lenis.scroll : window.scrollY;
      const target = Math.min(max, Math.max(0, current + delta));
      if (target === current) return set(0);
      if (scroller.lenis) scroller.lenis.scrollTo(target, { immediate: true, force: true });
      else window.scrollTo(0, target);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    gsap.ticker.add(tick);

    // First-visit hint.
    let shown = false;
    try {
      shown = localStorage.getItem(TIP_KEY) === "1";
    } catch {
      shown = true;
    }
    let hideTimer;
    let showTimer;
    const offIntro = shown
      ? () => {}
      : onIntroDone(() => {
          showTimer = setTimeout(() => {
            setTip(true);
            try {
              localStorage.setItem(TIP_KEY, "1");
            } catch {
              // storage blocked — the tip may show again next visit
            }
            hideTimer = setTimeout(() => setTip(false), 4500);
          }, 6000);
        });

    return () => {
      offIntro();
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      gsap.ticker.remove(tick);
    };
  }, []);

  const playing = speed !== 0;
  const arrows = playing ? (speed > 0 ? "▶" : "◀").repeat(Math.log2(Math.abs(speed)) + 1) : "";
  const label = `${arrows} ${Math.abs(speed)}×`;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[76] flex justify-center lg:bottom-[64px]" aria-live="polite">
      {playing && (
        <span className="rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-orange shadow-lg">
          {label} · K to stop
        </span>
      )}
      {!playing && tip && (
        <span className="rounded-full border border-ink/15 bg-paper-2 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink shadow-lg">
          Tip: <b className="text-orange-ink">J K L</b> works here
        </span>
      )}
    </div>
  );
}

import { useLayoutEffect, useRef, useState } from "react";
import { profile, sections } from "../../data/content";
import { gsap, prefersReducedMotion, SCRIPT_HIDDEN, SCRIPT_SHOWN } from "../../lib/gsap";
import { finishIntro } from "../../lib/intro";
import { lockScroll, unlockScroll } from "../../lib/scroll";
import TornEdge from "../ui/TornEdge";

const SEEN_KEY = "ax-preloaded";

function seenThisSession() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // storage blocked — the full intro just plays again next time
  }
}

// "Paper drop": a torn sheet slides up, a counter runs 000→100 while the
// script word writes itself on, then the sheet tears away to reveal the hero.
export default function Preloader() {
  const ref = useRef(null);
  const [mode] = useState(() => (prefersReducedMotion() ? "none" : seenThisSession() ? "quick" : "full"));
  const [done, setDone] = useState(mode === "none");

  useLayoutEffect(() => {
    if (mode === "none") {
      finishIntro();
      return undefined;
    }
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lockScroll();

    const el = ref.current;
    let finished = false;
    const finish = () => {
      finished = true;
      markSeen();
      unlockScroll();
      setDone(true);
    };

    const ctx = gsap.context(() => {
      if (mode === "quick") {
        gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.1, ease: "power1.out", onStart: finishIntro, onComplete: finish });
        return;
      }

      const counter = el.querySelector("[data-count]");
      const count = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.fromTo("[data-sheet]", { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" })
        .to(count, {
          v: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(count.v)).padStart(3, "0");
          },
        }, 0.2)
        .set("[data-backdrop]", { autoAlpha: 0 }, 0.85)
        .fromTo("[data-script]", { clipPath: SCRIPT_HIDDEN }, { clipPath: SCRIPT_SHOWN, duration: 1.1, ease: "power2.inOut" }, 0.5)
        .from("[data-meta] > *", { yPercent: 120, autoAlpha: 0, stagger: 0.08, duration: 0.8 }, 0.5)
        .to("[data-sheet]", { yPercent: -112, duration: 1, ease: "expo.inOut" }, "+=0.1")
        .add(finishIntro, "-=0.8");
    }, el);

    return () => {
      ctx.revert();
      if (!finished) unlockScroll();
    };
  }, [mode]);

  if (done) return null;

  return (
    <div ref={ref} className="fixed inset-0 z-[400]" aria-hidden="true">
      {mode === "full" ? (
        <>
          <div data-backdrop className="absolute inset-0 bg-ink" />
          <div data-sheet className="absolute inset-0 bg-paper drop-shadow-[0_18px_30px_rgb(0_0_0/0.35)]">
            <TornEdge color="var(--paper)" fiber="var(--paper-2)" side="top" seed={3} scrub={false} />
            <TornEdge color="var(--paper)" fiber="var(--paper-2)" side="bottom" seed={11} scrub={false} />
            <div className="grain !absolute" />
            <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] py-8 md:py-10">
              <div className="mono-label flex items-center gap-4 overflow-hidden" data-meta>
                <span>
                  <b className="font-bold">{profile.name}</b>
                </span>
                <span className="h-px flex-1 bg-current opacity-35" />
                <span>
                  Portfolio <b className="font-bold">{sections.hero.meta[1].split(" ").pop()}</b>
                </span>
              </div>

              <div className="grid place-items-center">
                <span data-script className="script -rotate-8 px-[0.2em] text-[clamp(6rem,24vw,20rem)]" aria-hidden="true" data-text={sections.hero.script} />
              </div>

              <div className="flex items-end justify-between">
                <span className="mono-label max-w-[14rem]">Video editor &amp; graphic designer — Jaffna, Sri Lanka</span>
                <span data-count className="font-mono text-[clamp(3rem,9vw,7rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                  000
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-paper" />
      )}
    </div>
  );
}

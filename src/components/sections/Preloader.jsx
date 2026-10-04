import { useLayoutEffect, useRef, useState } from "react";
import { profile, sections, slate } from "../../data/content";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { finishIntro } from "../../lib/intro";
import { lockScroll, unlockScroll } from "../../lib/scroll";
import TornEdge from "../ui/TornEdge";

const SEEN_KEY = "ax-preloaded";
const FPS = 24;
const pad = (n) => String(n).padStart(2, "0");
const timecode = (frames) => `00:00:${pad(Math.floor(frames / FPS))}:${pad(frames % FPS)}`;
const STICK_OPEN = -25;

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

// "Slate": the torn sheet with a clapperboard is part of the pre-rendered HTML,
// so it is the first thing painted. Once JS runs, the slate's timecode rolls
// 00:00:00:00 → 00:00:02:00, the clapper snaps shut (with a small shake), then
// the sheet tears away to reveal the hero.
// Repeat visits in a session just fade it; reduced motion skips it (CSS hides it).
export default function Preloader() {
  const ref = useRef(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const mode = prefersReducedMotion() ? "none" : seenThisSession() ? "quick" : "full";
    if (mode === "none") {
      finishIntro();
      setDone(true);
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

      tl.from("[data-slate]", { y: 40, autoAlpha: 0, duration: 0.6, ease: "expo.out" }, 0)
        .to(count, {
          v: 2 * FPS,
          duration: 1.4,
          ease: "power1.inOut",
          onUpdate: () => {
            counter.textContent = timecode(Math.round(count.v));
          },
        }, 0.1)
        // Clap: the stick snaps shut and the card jolts.
        .to("[data-stick]", { rotate: 0, duration: 0.18, ease: "power4.in" })
        .to("[data-slate]", { keyframes: { x: [0, -4, 4, -3, 2, 0], y: [0, 2, -2, 1, 0, 0] }, duration: 0.24, ease: "none" })
        .to("[data-sheet]", { yPercent: -112, duration: 1, ease: "expo.inOut" }, "+=0.15")
        .add(finishIntro, "-=0.8");
    }, el);

    return () => {
      ctx.revert();
      if (!finished) unlockScroll();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={ref} data-preloader className="fixed inset-0 z-[400]" aria-hidden="true">
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
            <div data-slate className="w-[min(560px,100%)]">
              <div
                data-stick
                className="slate-stripes h-12 origin-bottom-left rounded-t-[6px] border-2 border-ink md:h-14"
                style={{ transform: `rotate(${STICK_OPEN}deg)` }}
              />
              <div className="slate-stripes mt-1 h-12 border-2 border-ink md:h-14" />
              <div className="rounded-b-[10px] border-2 border-t-0 border-ink bg-paper-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
                <dl className="grid grid-cols-6 font-mono uppercase text-ink">
                  {slate.map(([k, v], i) => (
                    <div key={k} className={`border-b-2 border-ink px-4 py-3 ${i < 2 ? "col-span-3" : "col-span-2"} ${[0, 2, 3].includes(i) ? "border-r-2" : ""}`}>
                      <dt className="text-[10px] font-semibold tracking-[0.2em] text-ink-2">{k}</dt>
                      <dd className="text-[clamp(1rem,2.6vw,1.5rem)] font-semibold leading-tight">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-end justify-between gap-4 px-4 py-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-2">TC</span>
                  <span data-count className="font-mono text-[clamp(1.6rem,6vw,3rem)] font-medium leading-none tabular-nums tracking-[-0.02em] text-ink">
                    {timecode(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="mono-label max-w-[16rem]">
              {profile.title} — {profile.location}
            </span>
            <span className="script -rotate-8 px-[0.2em] text-[clamp(2.5rem,6vw,4.5rem)]" aria-hidden="true" data-text={sections.hero.script} />
          </div>
        </div>
      </div>
    </div>
  );
}

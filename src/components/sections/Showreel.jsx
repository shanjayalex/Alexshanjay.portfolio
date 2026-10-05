import { useEffect, useRef, useState } from "react";
import { sections, showreel } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, DESKTOP_MOTION, MOBILE_MOTION } from "../../lib/gsap";
import { setPlaying } from "../../lib/fx";
import { EASE } from "../../lib/motion";
import { fitLength } from "../../lib/type";
import { thumb } from "../../lib/youtube";
import EditTransition from "../fx/EditTransition";
import MetaRow from "../ui/MetaRow";
import ScriptWord from "../ui/ScriptWord";
import StencilTitle from "../ui/StencilTitle";
import Thumb from "../ui/Thumb";
import TornEdge from "../ui/TornEdge";
import YouTubeFacade from "../ui/YouTubeFacade";

const copy = sections.reel;

// The one dark "cinema" band. Desktop: letterbox bars slide in, the player
// pins for 120vh and grows from a 16:9 card to full bleed, with an ambilight
// glow spilling onto the page. Playing the reel dims the rest of the page.
export default function Showreel() {
  const ref = useRef(null);
  const [playing, setReelPlaying] = useState(false);

  useGsap(ref, (mm, el) => {
    mm.add(MOBILE_MOTION, () => {
      gsap.fromTo(
        "[data-cinema]",
        { y: 120, scale: 0.92 },
        { y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } },
      );
    });

    mm.add(DESKTOP_MOTION, () => {
      const cinema = el.querySelector("[data-cinema]");
      const frame = el.querySelector("[data-frame]");
      const full = () => (window.innerWidth / frame.offsetWidth) * 1.02;
      gsap
        .timeline({
          scrollTrigger: { trigger: cinema, start: "center center", end: "+=120%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
        })
        .to(frame, { scale: full, borderRadius: 0, padding: 0, ease: EASE.dissolve }, 0)
        .to(frame.querySelector("[data-cursor]"), { borderRadius: 0, ease: EASE.dissolve }, 0)
        .to("[data-ambi]", { autoAlpha: 0.5, scale: 1.15, ease: EASE.dissolve }, 0)
        .to("[data-caption]", { autoAlpha: 0, ease: "none", duration: 0.3 }, 0);
    });
  });

  // Leaving the band ends "cinema mode" (the dimming) even if the reel keeps playing.
  useEffect(() => {
    if (!playing) return undefined;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => setReelPlaying(false),
      onLeaveBack: () => setReelPlaying(false),
    });
    return () => trigger.kill();
  }, [playing]);

  useEffect(() => setPlaying(playing), [playing]);

  return (
    <section ref={ref} id="reel" className={`on-ink relative bg-ink px-[var(--gutter)] pb-24 pt-20 text-paper-2 md:pb-36 md:pt-28 ${playing ? "z-[6]" : ""}`}>
      <TornEdge color="var(--ink)" side="top" seed={5} />
      <TornEdge color="var(--ink)" side="bottom" seed={21} />
      <EditTransition type="letterbox" />

      <div className="mx-auto max-w-[1600px]">
        <MetaRow left="Showreel 2026" right="Press play" />

        <div className="type-stack relative mt-14 text-center md:mt-20" style={{ "--len": fitLength(copy.title) }}>
          <StencilTitle text={copy.title} label={copy.title} className="text-paper-2" />
          <ScriptWord className="absolute right-[4%] top-[-0.42em] z-20 -rotate-8 text-[0.6em]">{copy.script}</ScriptWord>

          <div data-cinema className="relative z-10 mx-auto -mt-[0.32em] max-w-[1180px] text-base">
            {/* Ambilight: a blurred copy of the poster spilling light around the frame. */}
            <div data-ambi className="pointer-events-none absolute inset-[-4%] -z-10 hidden opacity-0 blur-[60px] saturate-[1.4] md:block" aria-hidden="true">
              <Thumb sources={thumb(showreel.id)} alt="" />
            </div>
            <div data-frame className="rounded-[28px] bg-[#2a2a2d] p-2 shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)] md:p-3">
              <YouTubeFacade id={showreel.id} title={showreel.title} className="rounded-[22px]" cinema onPlay={() => setReelPlaying(true)} />
            </div>
            <div data-caption className="mt-5 flex items-center justify-between">
              <span className="mono-label">
                <b className="font-bold text-paper-2">{showreel.title}</b> · Video editing · Motion · Colour
              </span>
              <span className="mono-label hidden sm:inline">16:9 — 4K</span>
            </div>
          </div>
        </div>
      </div>

      {playing && <div className="pointer-events-none fixed inset-0 -z-10 bg-black/70" aria-hidden="true" />}
    </section>
  );
}

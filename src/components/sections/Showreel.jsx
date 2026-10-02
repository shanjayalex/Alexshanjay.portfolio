import { useRef } from "react";
import { sections, showreel } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";
import { fitLength } from "../../lib/type";
import MetaRow from "../ui/MetaRow";
import ScriptWord from "../ui/ScriptWord";
import StencilTitle from "../ui/StencilTitle";
import TornEdge from "../ui/TornEdge";
import YouTubeFacade from "../ui/YouTubeFacade";

const copy = sections.reel;

// The one dark "cinema" band.
export default function Showreel() {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      gsap.fromTo(
        "[data-player]",
        { y: 120, scale: 0.92 },
        { y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } },
      );
    });
  });

  return (
    <section ref={ref} id="reel" className="on-ink relative bg-ink px-[var(--gutter)] pb-24 pt-20 text-paper-2 md:pb-36 md:pt-28">
      <TornEdge color="var(--ink)" side="top" seed={5} />
      <TornEdge color="var(--ink)" side="bottom" seed={21} />

      <div className="mx-auto max-w-[1600px]">
        <MetaRow left="Showreel 2026" right="Press play" />

        <div className="type-stack relative mt-14 text-center md:mt-20" style={{ "--len": fitLength(copy.title) }}>
          <StencilTitle text={copy.title} className="text-paper-2" />
          <ScriptWord className="absolute right-[4%] top-[-0.42em] z-20 -rotate-8 text-[0.6em]">{copy.script}</ScriptWord>

          <div data-player className="relative z-10 mx-auto -mt-[0.32em] max-w-[1180px] text-base">
            <div className="rounded-[28px] bg-[#2a2a2d] p-2 shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)] md:p-3">
              <YouTubeFacade id={showreel.id} title={showreel.title} className="rounded-[22px]" />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="mono-label">
                <b className="font-bold text-paper-2">{showreel.title}</b> · Video editing · Motion · Colour
              </span>
              <span className="mono-label hidden sm:inline">16:9 — 4K</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

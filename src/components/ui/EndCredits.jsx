import { useRef } from "react";
import { credits } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";
import ScriptWord from "./ScriptWord";

// End-credits column that drifts up a little faster than the page, like a roll.
export default function EndCredits() {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      gsap.fromTo(
        el.querySelector("[data-roll]"),
        { yPercent: 18 },
        { yPercent: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 30%", scrub: 0.4 } },
      );
    });
  });

  return (
    <section ref={ref} aria-label="Credits" className="mx-auto max-w-[900px] overflow-hidden py-16 md:py-24">
      <div data-roll>
        <dl className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-x-6 gap-y-4 md:gap-x-10">
          {credits.rows.map((row) => (
            <div key={row.role} className="contents">
              <dt className="mono-label pt-[0.45em] text-right">{row.role}</dt>
              <dd className="serif-italic text-[clamp(1.25rem,2.4vw,1.9rem)] leading-tight text-paper-2">{row.name}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-16 text-center">
          <p className="mono-label !text-paper-2">
            <b className="font-bold">{credits.end}</b>
          </p>
          <ScriptWord className="mt-2 -rotate-6 text-[clamp(3rem,7vw,5.5rem)]">{credits.script}</ScriptWord>
        </div>
      </div>
    </section>
  );
}

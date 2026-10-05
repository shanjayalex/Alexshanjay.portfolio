import { useRef } from "react";
import { journey, sections } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, DESKTOP_MOTION, MOTION } from "../../lib/gsap";
import { BASE, EASE } from "../../lib/motion";
import { fitLength } from "../../lib/type";
import EditTransition from "../fx/EditTransition";
import SectionHeader from "../ui/SectionHeader";

// The playhead sits on this line of the viewport; everything keys off it.
const LINE = "60%";

// A film strip on a keyframe track. A playhead travels down the track with
// scroll; each entry's keyframe diamond fills orange as the playhead passes,
// and its outlined year fills with ink at the same moment.
export default function Journey() {
  const ref = useRef(null);
  const span = sections.journey.tag;

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      const strip = el.querySelector("[data-strip]");
      gsap.fromTo(
        "[data-playhead]",
        { top: "0%" },
        { top: "100%", ease: "none", scrollTrigger: { trigger: strip, start: `top ${LINE}`, end: `bottom ${LINE}`, scrub: true } },
      );

      el.querySelectorAll("[data-entry]").forEach((entry) => {
        const key = entry.querySelector("[data-kf]");
        ScrollTrigger.create({ trigger: entry, start: `center ${LINE}`, onToggle: (self) => key.toggleAttribute("data-passed", self.isActive), end: "max" });
        gsap.fromTo(
          entry.querySelector("[data-fill]"),
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", ease: "none", scrollTrigger: { trigger: entry, start: "top 80%", end: `center ${LINE}`, scrub: true } },
        );
      });
    });

    // Entries whip in from alternating sides.
    mm.add(DESKTOP_MOTION, () => {
      el.querySelectorAll("[data-body]").forEach((body, i) => {
        gsap.from(body, {
          x: i % 2 ? -140 : 140,
          skewX: i % 2 ? 8 : -8,
          autoAlpha: 0,
          duration: BASE,
          ease: EASE.whip,
          scrollTrigger: { trigger: body, start: "top 82%", once: true },
        });
      });
    });
  });

  return (
    <section ref={ref} id="journey" className="relative px-[var(--gutter)] py-24 md:py-32">
      <EditTransition type="jcut" label={`Journey · ${span}`} />
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader {...sections.journey} />

        <div data-strip className="relative mt-14 pl-8 md:mt-20 md:pl-14">
          {/* Keyframe track + playhead */}
          <div className="absolute bottom-0 left-2.5 top-0 w-px bg-ink/25 md:left-5" aria-hidden="true">
            <span data-playhead className="absolute left-1/2 top-0 block -translate-x-1/2">
              <span className="block h-0 w-0 -translate-y-full border-x-[7px] border-t-[10px] border-x-transparent border-t-orange-deep" />
              <span className="absolute left-1/2 top-0 block h-px w-6 -translate-x-1/2 bg-orange-deep" />
            </span>
          </div>

          <ol className="bg-ink py-1.5">
            {journey.map((item, i) => (
              <li
                key={`${item.org}-${item.role}`}
                data-entry
                className="film-frame grid gap-4 border-y-[6px] border-ink bg-paper py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-10 md:py-10"
              >
                <span data-kf className="journey-kf" aria-hidden="true" />
                <div className="relative @container" style={{ "--len": fitLength(item.year) }}>
                  <span className="journey-year display outline-text block whitespace-nowrap" aria-hidden="true">
                    {item.year}
                  </span>
                  <span data-fill className="journey-year display absolute inset-0 block whitespace-nowrap">
                    {item.year}
                  </span>
                </div>

                <div data-body className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`chip ${item.kind === "Education" ? "" : "is-orange"}`}>{item.kind}</span>
                    <span className="mono-label">FR {String(i + 1).padStart(3, "0")}</span>
                    {item.current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-paper-2">
                        <span className="rec-dot !h-1.5 !w-1.5" aria-hidden="true" /> Rec · Now
                      </span>
                    )}
                  </div>
                  <h3 className="card-title text-[clamp(1.5rem,2.6vw,2.4rem)]">{item.role}</h3>
                  <p className="serif-italic text-2xl text-ink-2">{item.org}</p>
                  {item.text && <p className="max-w-lg">{item.text}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { journey, sections } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";
import { fitLength } from "../../lib/type";
import SectionHeader from "../ui/SectionHeader";

// A film strip: each entry is a frame with sprocket holes. Outlined year
// numbers fill with ink as each frame scrolls through; the current role
// gets a NOW stamp.
export default function Journey() {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      el.querySelectorAll("[data-entry]").forEach((entry) => {
        gsap.fromTo(
          entry.querySelector("[data-fill]"),
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", ease: "none", scrollTrigger: { trigger: entry, start: "top 85%", end: "top 45%", scrub: true } },
        );
        gsap.from(entry.querySelector("[data-body]"), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: entry, start: "top 80%", once: true },
        });
        const stamp = entry.querySelector("[data-stamp]");
        if (stamp) {
          gsap.from(stamp, {
            scale: 1.6,
            autoAlpha: 0,
            duration: 0.3,
            ease: "back.out(2)",
            scrollTrigger: { trigger: entry, start: "top 70%", once: true },
          });
        }
      });
    });
  });

  return (
    <section ref={ref} id="journey" className="relative px-[var(--gutter)] py-24 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader {...sections.journey} />

        <ol className="mt-14 bg-ink py-1.5 md:mt-20">
          {journey.map((item, i) => (
            <li
              key={`${item.org}-${item.role}`}
              data-entry
              className="film-frame grid gap-4 border-y-[6px] border-ink bg-paper py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-10 md:py-10"
            >
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
                    <span data-stamp className="now-stamp text-lg">
                      Now
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
    </section>
  );
}

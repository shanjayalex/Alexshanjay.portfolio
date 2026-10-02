import { useRef } from "react";
import { profile, sections, site, skills, tools } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION, SplitText } from "../../lib/gsap";
import Marquee from "../ui/Marquee";
import SectionHeader from "../ui/SectionHeader";

function Polaroid() {
  return (
    <figure data-polaroid className="relative mx-auto w-full max-w-[420px] -rotate-3 bg-white p-3 pb-14 shadow-[0_40px_70px_-30px_rgb(0_0_0/0.55),0_6px_14px_-6px_rgb(0_0_0/0.2)] md:p-4 md:pb-16">
      <span className="tape -left-8 top-5 -rotate-[38deg]" aria-hidden="true" />
      <span className="tape -right-8 bottom-24 -rotate-[38deg]" aria-hidden="true" />
      <div className="aspect-[4/5] overflow-hidden bg-paper">
        <img src={profile.photo} alt={`Portrait of ${profile.name}`} width="840" height="1050" loading="lazy" className="h-full w-full object-cover grayscale-[15%]" />
      </div>
      <figcaption className="serif-italic absolute inset-x-0 bottom-3 text-center text-2xl text-ink md:bottom-4">
        {profile.name.split(" ")[0]}, {profile.location.split(",")[0]} — 2026
      </figcaption>
    </figure>
  );
}

export default function About() {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      SplitText.create(el.querySelector("[data-bio]"), {
        type: "lines",
        mask: "lines",
        aria: "none",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            stagger: 0.08,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: self.elements[0], start: "top 85%", once: true },
          }),
      });

      el.querySelectorAll("[data-skill]").forEach((row) => {
        gsap.fromTo(
          row.querySelector("[data-bar]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 90%", once: true } },
        );
      });

      gsap.fromTo(
        "[data-polaroid]",
        { y: 80, rotate: 4 },
        { y: -20, rotate: -3, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true } },
      );
    });
  });

  return (
    <section ref={ref} id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-[var(--gutter)]">
        <SectionHeader {...sections.about} />

        <div className="mt-14 grid gap-16 md:mt-20 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <Polaroid />

          <div>
            <p data-bio className="text-[clamp(1.35rem,2.3vw,2rem)] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
              {profile.bio}
            </p>

            <p className="mt-8 max-w-2xl border-l-2 border-orange pl-5 text-[17px] md:text-lg">
              <strong className="font-bold text-ink">{site.summary}</strong> {site.summaryMore}
            </p>

            <ul className="mt-12 space-y-6" aria-label="Skills">
              {skills.map((skill) => (
                <li key={skill.label} data-skill>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="card-title text-[clamp(1.25rem,2vw,1.75rem)]">{skill.label}</span>
                    <span className="mono-label text-ink">{skill.value}%</span>
                  </div>
                  <div className="relative mt-2 h-px bg-ink/15" role="meter" aria-valuenow={skill.value} aria-valuemin={0} aria-valuemax={100} aria-label={skill.label}>
                    <span
                      data-bar
                      className="absolute left-0 top-[-1px] h-[3px] origin-left rounded-full bg-orange"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-28">
        <p className="mono-label mb-3 px-[var(--gutter)]">
          <b className="font-bold">Toolkit</b> · scroll faster, it speeds up
        </p>
        <Marquee items={tools} />
      </div>
    </section>
  );
}

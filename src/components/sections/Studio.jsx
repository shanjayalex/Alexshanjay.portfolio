import { useRef } from "react";
import { FiArrowUpRight, FiInstagram } from "react-icons/fi";
import { profile, studio } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";
import MagneticButton from "../ui/MagneticButton";
import MetaRow from "../ui/MetaRow";
import ScriptWord from "../ui/ScriptWord";

function Stamp() {
  const text = `${studio.name} · Book now · ${studio.name} · Book now · `;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <defs>
        <path id="stamp-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1 -92 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--orange)" />
      <text className="font-mono" fontSize="9.4" fontWeight="700" letterSpacing="2.2" fill="var(--ink)">
        <textPath href="#stamp-circle">{text.toUpperCase()}</textPath>
      </text>
      <text x="60" y="68" textAnchor="middle" className="display" fontSize="26" fill="var(--ink)">
        AX
      </text>
    </svg>
  );
}

// AX.Visuals as a printed business card / letterhead lying on the page.
export default function Studio() {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      gsap.fromTo(
        "[data-letterhead]",
        { y: 100, rotate: 2 },
        { y: 0, rotate: -1.5, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true } },
      );
      gsap.to("[data-stamp]", { rotate: 200, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  return (
    <section ref={ref} id="studio" className="relative px-[var(--gutter)] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <MetaRow left="The Studio" right={`Est. ${studio.founded}`} />

        <article
          data-letterhead
          className="relative mt-14 -rotate-[1.5deg] rounded-[6px] bg-paper-2 p-6 shadow-[0_2px_0_rgb(255_255_255/0.9)_inset,0_50px_90px_-40px_rgb(0_0_0/0.55),0_10px_20px_-10px_rgb(0_0_0/0.25)] sm:p-10 md:mt-20 md:p-16"
        >
          <a
            data-stamp
            href={studio.url}
            target="_blank"
            rel="noreferrer"
            className="absolute -top-14 right-3 h-20 w-20 drop-shadow-[0_10px_16px_rgb(0_0_0/0.25)] md:-right-8 md:-top-14 md:h-36 md:w-36"
            aria-label={`Book ${studio.name}`}
          >
            <Stamp />
          </a>

          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-ink/15 pb-6">
            <div className="relative">
              <ScriptWord className="absolute -top-[0.7em] left-[-0.2em] -rotate-8 text-[clamp(2.6rem,6vw,5rem)]">{studio.script}</ScriptWord>
              <p className="display stencil text-[clamp(2rem,8.4vw,7.5rem)]">{studio.name}</p>
            </div>
            <div className="mono-label space-y-1 text-right">
              <p>
                <b className="font-bold">Card No.</b> 001
              </p>
              <p>{profile.location}</p>
              <p>Founded by {profile.name}</p>
            </div>
          </header>

          <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
            <div>
              <h2 className="text-[clamp(1.9rem,4.2vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink">
                {studio.name} <span className="serif-italic font-normal text-ink-2">— {studio.headline}</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg">{studio.subline}</p>
            </div>

            <div className="flex flex-col justify-between gap-8">
              <ul className="flex flex-wrap gap-2">
                {studio.services.map((service) => (
                  <li key={service} className="rounded-full border border-ink/20 bg-paper px-4 py-2 text-sm font-semibold text-ink">
                    {service}
                  </li>
                ))}
              </ul>
              <p className="mono-label border-y border-dashed border-ink/25 py-3">
                <b className="font-bold">{studio.pricing}</b> · full rates on the studio site
              </p>
              <div className="flex flex-wrap gap-3">
                <MagneticButton href={studio.url} target="_blank" rel="noreferrer" className="pill pill-orange">
                  Book {studio.name} <FiArrowUpRight />
                </MagneticButton>
                {studio.instagram && (
                  <MagneticButton href={studio.instagram} target="_blank" rel="noreferrer" className="pill pill-outline">
                    <FiInstagram /> Follow on Instagram <FiArrowUpRight />
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

import { useRef, useState } from "react";
import { FiArrowUpRight, FiInstagram, FiRotateCw } from "react-icons/fi";
import { profile, studio } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, FINE_POINTER, MOTION, prefersReducedMotion, WIDE_MOTION } from "../../lib/gsap";
import { BASE, EASE } from "../../lib/motion";
import EditTransition from "../fx/EditTransition";
import Logo, { LOGO_MARK } from "../ui/Logo";
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
      <svg x="41" y="40" width="38" height="40" viewBox="31 0 661 691">
        <path d={LOGO_MARK} fill="var(--ink)" />
      </svg>
    </svg>
  );
}

// AX.Visuals as a real business card: it spins in from edge-on, tilts with a
// glare under the mouse, and flips over (button or a click on the card) to
// show the back — contact and services. An orange disc match-cuts onto the stamp.
export default function Studio() {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      gsap.fromTo(
        "[data-letterhead]",
        { y: 100, rotate: 2, rotationY: 80, transformPerspective: 1600 },
        { y: 0, rotate: -1.5, rotationY: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true } },
      );
      gsap.to("[data-stamp]", { rotate: 200, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    mm.add(`${WIDE_MOTION} and ${FINE_POINTER}`, () => {
      const card = el.querySelector("[data-tilt]");
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
      gsap.set(card, { transformPerspective: 1600 });
      function onMove(e) {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        rx((0.5 - ny) * 10);
        ry((nx - 0.5) * 10);
        card.style.setProperty("--gx", `${nx * 100}%`);
        card.style.setProperty("--gy", `${ny * 100}%`);
        card.style.setProperty("--glare", "1");
      }
      function onLeave() {
        rx(0);
        ry(0);
        card.style.setProperty("--glare", "0");
      }
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });
  });

  function flip(next = !flipped) {
    setFlipped(next);
    gsap.to(ref.current.querySelector("[data-flip]"), {
      rotationY: next ? 180 : 0,
      duration: prefersReducedMotion() ? 0 : BASE,
      ease: EASE.keyframe,
    });
  }

  // A click on the card itself (not a link or button) flips it.
  function onCardClick(e) {
    if (e.target.closest("a, button")) return;
    flip();
  }

  return (
    <section ref={ref} id="studio" className="relative overflow-clip px-[var(--gutter)] py-24 md:py-32">
      <EditTransition type="matchcut" />
      <div className="mx-auto max-w-[1400px]">
        <MetaRow left="The Studio" right={`Est. ${studio.founded}`} />

        <div data-letterhead className="relative mt-14 -rotate-[1.5deg] md:mt-20">
        <div data-tilt className="relative" onClick={onCardClick}>
        <div data-flip className="card-flip relative">
        <article className="card-face relative rounded-[6px] bg-paper-2 p-6 shadow-[0_2px_0_rgb(255_255_255/0.9)_inset,0_50px_90px_-40px_rgb(0_0_0/0.55),0_10px_20px_-10px_rgb(0_0_0/0.25)] sm:p-10 md:p-16" aria-hidden={flipped || undefined} inert={flipped || undefined}>
          <a
            data-stamp
            data-match
            href={studio.url}
            target="_blank"
            rel="noreferrer"
            className="absolute -top-14 right-3 h-20 w-20 drop-shadow-[0_10px_16px_rgb(0_0_0/0.25)] md:-right-8 md:-top-14 md:h-36 md:w-36"
            aria-label={`Book ${studio.name}`}
          >
            <Stamp />
          </a>

          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-ink/15 pb-6">
            <div className="flex items-end gap-4 md:gap-8">
              <Logo className="h-[clamp(4.5rem,11vw,9.5rem)] w-auto shrink-0 text-ink" />
              <div className="relative pb-[0.06em]">
                <ScriptWord className="absolute -top-[0.7em] left-[-0.2em] -rotate-8 text-[clamp(2rem,5vw,4.5rem)]">{studio.script}</ScriptWord>
                <p className="display stencil text-[clamp(1.6rem,6.2vw,5.6rem)]" aria-hidden="true">
                  {studio.name}
                </p>
              </div>
            </div>
            <div className="mono-label space-y-1 text-right md:mr-24 lg:mr-28">
              <p>
                <b className="font-bold">Card No.</b> 001
              </p>
              <p>{studio.location}</p>
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
                <button type="button" onClick={() => flip(true)} className="pill pill-outline">
                  <FiRotateCw /> Flip card
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Back of the card */}
        <article
          className="card-face card-back absolute inset-0 flex flex-col justify-between gap-8 overflow-hidden rounded-[6px] bg-ink p-6 text-paper-2 shadow-[0_50px_90px_-40px_rgb(0_0_0/0.55)] sm:p-10 md:p-16"
          aria-hidden={!flipped || undefined}
          inert={!flipped || undefined}
        >
          <div className="flex items-start justify-between gap-6">
            <Logo className="h-16 w-auto text-paper-2 md:h-24" />
            <p className="mono-label text-right !text-paper-2/70">
              <b className="font-bold !text-paper-2">Card No.</b> 001 · Back
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <ul className="space-y-2">
              {studio.services.map((service) => (
                <li key={service} className="card-title text-[clamp(1.4rem,2.6vw,2.4rem)] !text-paper-2">
                  {service}
                </li>
              ))}
            </ul>
            <div className="space-y-3 md:text-right">
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="block font-mono text-lg text-orange hover:underline">
                WhatsApp {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`} className="block font-mono text-lg hover:underline">
                {profile.email}
              </a>
              <p className="mono-label !text-paper-2/70">
                {studio.location} · {studio.pricing}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={studio.url} target="_blank" rel="noreferrer" className="pill pill-orange">
              Book {studio.name} <FiArrowUpRight />
            </a>
            <button type="button" onClick={() => flip(false)} className="pill pill-outline">
              <FiRotateCw /> Flip back
            </button>
          </div>
        </article>
        </div>
        <span className="card-glare" aria-hidden="true" />
        </div>
        </div>
      </div>
    </section>
  );
}

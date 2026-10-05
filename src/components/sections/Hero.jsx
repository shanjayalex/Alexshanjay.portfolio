import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { designs, profile, sections, studio, videos } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, DESKTOP_MOTION, MOTION, SCRIPT_HIDDEN, SCRIPT_SHOWN } from "../../lib/gsap";
import { onIntroDone } from "../../lib/intro";
import { useLightbox } from "../../lib/lightbox";
import { fitLength } from "../../lib/type";
import DepthPortrait from "../ui/DepthPortrait";
import DesignCard from "../ui/DesignCard";
import MagneticButton from "../ui/MagneticButton";
import MetaRow from "../ui/MetaRow";
import StencilTitle from "../ui/StencilTitle";
import Tray from "../ui/Tray";
import VideoCard from "../ui/VideoCard";

const copy = sections.hero;

export default function Hero() {
  const ref = useRef(null);
  const { open } = useLightbox();
  const heroVideos = videos.slice(0, 3);
  const heroDesigns = designs.slice(0, 3);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      const chars = el.querySelectorAll("[data-title] .char");
      const cards = el.querySelectorAll("[data-card]");
      gsap.set(chars, { yPercent: 110 });
      gsap.set("[data-portrait]", { yPercent: 40, clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set("[data-script]", { clipPath: SCRIPT_HIDDEN });
      gsap.set(cards, { y: 90, rotate: (i) => (i % 2 ? 4 : -4), autoAlpha: 0 });
      gsap.set("[data-fade]", { autoAlpha: 0, y: 20 });

      const intro = gsap
        .timeline({ paused: true })
        .to(chars, { yPercent: 0, stagger: 0.04, duration: 1.2, ease: "expo.out" })
        // The portrait rises from behind the baseline, then "refine" writes on over his shoulder.
        .to("[data-portrait]", { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" }, 0.45)
        .to("[data-script]", { clipPath: SCRIPT_SHOWN, duration: 1.3, ease: "power2.inOut" }, 1.05)
        .to(cards, { y: 0, rotate: 0, autoAlpha: 1, stagger: 0.07, duration: 1.2, ease: "expo.out" }, 0.15)
        .to("[data-fade]", { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" }, 0.6);

      return onIntroDone(() => intro.play());
    });

    mm.add(DESKTOP_MOTION, () => {
      const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-tray-top]", { yPercent: -18, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-tray-bottom]", { yPercent: 10, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-title]", { scale: 0.92, ease: "none", scrollTrigger: scrub });
      // The word (and its masked front copy, which must stay in register) trails the page;
      // the portrait in DepthPortrait trails less, so he drifts forward out of the type.
      gsap.to(["[data-back-word]", "[data-front-word]"], { y: () => el.offsetHeight * 0.12, ease: "none", scrollTrigger: { ...scrub, invalidateOnRefresh: true } });
      gsap.to("[data-script-wrap]", { x: 40, y: -30, rotate: -3, ease: "none", scrollTrigger: scrub });
    });
  });

  return (
    <section ref={ref} id="top" className="relative overflow-x-clip px-[var(--gutter)] pb-20 pt-[calc(var(--nav-h)+36px)] md:pb-28 md:pt-[calc(var(--nav-h)+52px)]">
      <MetaRow left={copy.meta[0]} right={copy.meta[1]} className="mx-auto max-w-[1600px]" />

      <div data-tray-top className="relative mx-auto mt-8 max-w-[1180px] md:mt-12">
        <Tray className="swipe-row lg:grid lg:grid-cols-3 lg:gap-5">
          {heroVideos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              number={i + 1}
              variant="compact"
              onOpen={() => open({ kind: "video", items: videos, index: i })}
            />
          ))}
        </Tray>
      </div>

      {/* Centre type stack — ghost script, stencil PORTFOLIO, portrait, masked front copy, orange script, small tag */}
      <div
        className="type-stack pointer-events-none relative z-10 mx-auto -mb-[0.1em] mt-[calc(66vw+2.5rem)] max-w-[1600px] text-center md:mt-[max(0.9em,3.5rem)]"
        style={{ "--len": fitLength(copy.title) }}
      >
        <div data-title className="relative origin-center">
          <span className="ghost-script absolute bottom-[78%] left-1/2 -translate-x-1/2 text-[0.42em]" aria-hidden="true" data-text={copy.ghost} />
          <div data-back-word className="relative">
            <StencilTitle as="h1" text={copy.title} ring reveal={false} label={`${profile.name} — Video & Design Portfolio`} />
          </div>
          <DepthPortrait title={copy.title} />
          <span data-script-wrap className="absolute bottom-[34%] left-[1%] z-20 inline-block md:bottom-[26%] md:left-[calc(50%+0.48em)]">
            <span data-script className="script inline-block -rotate-8 px-[0.1em] text-[0.6em]" aria-hidden="true" data-text={copy.script} />
          </span>
          <span data-fade className="mono-label absolute bottom-[calc(100%+0.9rem)] right-[2%] hidden text-ink md:inline">
            <b className="font-bold">{copy.tag}</b>
          </span>
        </div>
      </div>

      <div data-tray-bottom className="relative mx-auto max-w-[1180px]">
        <Tray className="swipe-row lg:grid lg:grid-cols-3 lg:gap-5">
          {heroDesigns.map((design, i) => (
            <DesignCard
              key={design.id}
              design={design}
              index={i}
              tilt={false}
              onOpen={() => open({ kind: "image", items: designs, index: i })}
            />
          ))}
        </Tray>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1180px] flex-col items-start justify-between gap-8 md:mt-16 md:flex-row md:items-end">
        <p data-fade className="max-w-xl text-[17px] leading-relaxed md:text-lg">
          <b className="font-extrabold text-ink">{profile.name}</b> · {profile.title} · {profile.role} ·{" "}
          {profile.location} <span aria-label="Sri Lanka flag">🇱🇰</span>
        </p>
        <div data-fade className="flex flex-wrap gap-3">
          <MagneticButton href="#contact" className="pill pill-orange">
            Hire me
          </MagneticButton>
          <MagneticButton href={studio.url} target="_blank" rel="noreferrer" className="pill pill-outline">
            Visit AX.Visuals <FiArrowUpRight />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

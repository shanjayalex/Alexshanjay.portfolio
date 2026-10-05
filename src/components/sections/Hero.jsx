import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { designs, profile, sections, studio, videos } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, DESKTOP_MOTION, FINE_POINTER, MOTION, SCRIPT_HIDDEN, SCRIPT_SHOWN, WIDE_MOTION } from "../../lib/gsap";
import { flashFrame } from "../../lib/fx";
import { onIntroDone } from "../../lib/intro";
import { BASE, EASE, f, FPS, frames, HERO, SLOW, timecode } from "../../lib/motion";
import { makeBuckets } from "../fx/buckets";
import RenderTitle from "../fx/RenderTitle";
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
      const q = (sel) => el.querySelector(sel);
      const chars = el.querySelectorAll("[data-title] .char");
      const bins = el.querySelectorAll("[data-tray-top] [data-card]");
      const prints = el.querySelectorAll("[data-tray-bottom] [data-card]");
      const status = q("[data-render-status]");
      const render = { p: 0 };
      const buckets = makeBuckets(q("[data-buckets]"));

      // Render pass layers are display:none in the HTML; switch them on.
      gsap.set(["[data-buckets]"], { display: "grid" });
      gsap.set(["[data-outline]", "[data-log]", "[data-wipe]"], { display: "block" });
      gsap.set("[data-wipe]", { autoAlpha: 0 });
      gsap.set("[data-front-word]", { autoAlpha: 0 });
      gsap.set(chars, { yPercent: 110 });
      gsap.set("[data-portrait]", { yPercent: 40, clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set("[data-script]", { clipPath: SCRIPT_HIDDEN });
      // "Bin": clips thrown in loosely, waiting to be cut into the timeline.
      gsap.set(bins, {
        x: () => gsap.utils.random(-120, 120),
        y: () => gsap.utils.random(-60, 120),
        rotation: () => gsap.utils.random(-8, 8),
        scale: 0.9,
        autoAlpha: 0,
      });
      gsap.set(prints, { y: 90, rotate: (i) => (i % 2 ? 4 : -4), autoAlpha: 0 });
      gsap.set("[data-fade]", { autoAlpha: 0, y: 20 });

      const intro = gsap
        .timeline({ paused: true })
        // 1 · Wireframe: outlines rise in.
        .to(chars, { yPercent: 0, stagger: frames(1), duration: f(28), ease: EASE.keyframe })
        .to(bins, { autoAlpha: 1, duration: f(6), ease: EASE.dissolve, stagger: frames(2) }, f(2))
        // 2 · Render buckets flip from the centre out, on twos.
        .to(render, {
          p: 100,
          duration: HERO * 0.6,
          ease: "none",
          onUpdate: () => status && (status.textContent = `Rendering… ${Math.round(render.p)}%`),
        }, f(16))
        .to(buckets, {
          autoAlpha: 0,
          duration: 0.001,
          stagger: { amount: HERO * 0.55, grid: [8, 24], from: "center", ease: "steps(15)" },
        }, f(18))
        .add(() => {
          if (status) status.textContent = `Render complete ${timecode(2 * FPS)}`;
          flashFrame(2);
        })
        // Hard cut: wireframe off, the front copy is "there".
        .set("[data-outline]", { autoAlpha: 0 })
        .set("[data-front-word]", { autoAlpha: 1 })
        // 3 · Bin → timeline: each clip snaps into its slot with a 2px landing shake.
        .to(bins, { x: 0, y: 0, rotation: 0, scale: 1, duration: BASE, ease: EASE.whip, stagger: frames(4) }, "<")
        .to(bins, { keyframes: { x: [0, -2, 2, 0] }, duration: f(3), ease: "none", stagger: frames(4) }, `<${BASE}`)
        // The portrait rises from behind the baseline…
        .to("[data-portrait]", { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: f(34), ease: "expo.out" }, f(10))
        // …then grades: LOG → colour with a wipe line.
        .set("[data-wipe]", { autoAlpha: 1, left: "0%" }, f(40))
        .fromTo("[data-log]", { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 100%)", duration: SLOW, ease: EASE.dissolve }, f(40))
        .to("[data-wipe]", { left: "100%", duration: SLOW, ease: EASE.dissolve }, f(40))
        .to("[data-wipe]", { autoAlpha: 0, duration: f(4) })
        .to("[data-script]", { clipPath: SCRIPT_SHOWN, duration: SLOW, ease: "power2.inOut" }, f(56))
        .to(prints, { y: 0, rotate: 0, autoAlpha: 1, stagger: frames(2), duration: f(28), ease: EASE.keyframe }, f(48))
        .to("[data-fade]", { autoAlpha: 1, y: 0, stagger: frames(2), duration: f(20), ease: "power3.out" }, f(56));

      // Running timecodes on the episode cards, only while the tray is on screen.
      const strips = [...el.querySelectorAll("[data-tc]")];
      const start = strips.map((_, i) => (i + 1) * 337);
      let t0 = 0;
      let last = 0;
      const tick = (time) => {
        if (time - last < 1 / 12) return;
        last = time;
        const fr = Math.round((time - t0) * FPS);
        strips.forEach((node, i) => (node.textContent = timecode(start[i] + fr)));
      };
      const tcTrigger = ScrollTrigger.create({
        trigger: q("[data-tray-top]"),
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        onEnter: () => !t0 && (t0 = gsap.ticker.time),
      });

      const off = onIntroDone(() => intro.play());
      return () => {
        off();
        gsap.ticker.remove(tick);
        tcTrigger.kill();
      };
    });

    mm.add(DESKTOP_MOTION, () => {
      // 2.5D dolly back: three layers at different speeds (page = 1×), letters drift apart in Z.
      const span = () => el.offsetHeight;
      const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true };
      gsap.to("[data-tray-top]", { y: () => span() * -0.15, ease: "none", scrollTrigger: scrub }); // 1.15×
      gsap.to(["[data-back-word]", "[data-front-word]"], { y: () => span() * 0.15, ease: "none", scrollTrigger: scrub }); // 0.85×
      gsap.to("[data-ghost]", { y: () => span() * 0.4, ease: "none", scrollTrigger: scrub }); // 0.6×
      gsap.to("[data-tray-bottom]", { yPercent: 10, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-title]", { scale: 0.94, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-script-wrap]", { x: 40, y: -30, rotate: -3, ease: "none", scrollTrigger: scrub });
      // The same drift on both copies keeps the front letters in register.
      ["[data-back-word]", "[data-front-word]"].forEach((sel) => {
        const letters = el.querySelectorAll(`${sel} .char`);
        const mid = (letters.length - 1) / 2;
        gsap.to(letters, {
          x: (i) => (i - mid) * 7,
          z: (i) => (i % 2 ? 60 : -40),
          transformPerspective: 1200,
          ease: "none",
          scrollTrigger: scrub,
        });
      });
    });

    // Whole type stack leans away from the cursor (±10px) — the portrait follows it, so they separate.
    mm.add(`${WIDE_MOTION} and ${FINE_POINTER}`, () => {
      const stack = el.querySelector("[data-stack]");
      const toX = gsap.quickTo(stack, "x", { duration: 1, ease: "power3" });
      const toY = gsap.quickTo(stack, "y", { duration: 1, ease: "power3" });
      const onMove = (e) => {
        toX((0.5 - e.clientX / window.innerWidth) * 20);
        toY((0.5 - e.clientY / window.innerHeight) * 20);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
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
              timecode
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
        <div data-stack>
        <div data-title className="relative origin-center">
          <span data-ghost className="ghost-script absolute bottom-[78%] left-1/2 -translate-x-1/2 text-[0.42em]" aria-hidden="true" data-text={copy.ghost} />
          <div data-back-word className="relative">
            <StencilTitle as="h1" text={copy.title} ring reveal={false} label={`${profile.name} — Video & Design Portfolio`} />
            <RenderTitle title={copy.title} />
          </div>
          <DepthPortrait title={copy.title} />
          <span data-script-wrap className="absolute bottom-[34%] left-[1%] z-20 inline-block md:bottom-[26%] md:left-[calc(50%+0.48em)]">
            <span data-script className="script inline-block -rotate-8 px-[0.1em] text-[0.6em]" aria-hidden="true" data-text={copy.script} />
          </span>
          <span data-fade className="mono-label absolute bottom-[calc(100%+0.9rem)] right-[2%] hidden text-ink md:inline">
            <b className="font-bold">{copy.tag}</b>
          </span>
          <span data-render-status className="mono-label absolute bottom-[calc(100%+0.9rem)] left-[2%] hidden text-ink md:inline" aria-hidden="true">
            {copy.meta[1]}
          </span>
        </div>
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

import { useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, DESKTOP_MOTION, MOTION } from "../../lib/gsap";
import { BASE, EASE, f, QUICK, SLOW, SNAP } from "../../lib/motion";

const REDUCED = "(prefers-reduced-motion: reduce)";

// Cuts between sections, each one an edit an editor would recognise.
// Drop <EditTransition type="…" /> anywhere inside a section; it acts on that
// section. Every type collapses to a 200ms fade under reduced motion.
//
//   letterbox  2.39:1 bars slide in while the section fills the screen (Showreel)
//   swipe      9:16 phone-shaped mask grows to full width (Shorts)
//   halftone   revealed through growing halftone dots, from the centre out (Design)
//   matchcut   an orange disc irises down onto the section's [data-match] target (Studio)
//   rackfocus  the section pulls focus from blur(8px); [data-sharp] stays crisp (About)
//   jcut       a lower-third label arrives before the picture (Journey)
//   dip        dip to paper (FAQ)
//   fadeblack  fade to black, title card, paper fades back under it (Contact)
export default function EditTransition({ type, label }) {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    const section = el.closest("section");
    const content = section.querySelector("[data-cut]") ?? section;

    mm.add(REDUCED, () => {
      gsap.from(content, { autoAlpha: 0, duration: 0.2, ease: "none", scrollTrigger: { trigger: section, start: "top 85%", once: true } });
    });

    mm.add(MOTION, () => {
      const play = (tl, start = "top 70%") => ScrollTrigger.create({ trigger: section, start, once: true, onEnter: () => tl.play() });

      switch (type) {
        case "swipe": {
          const tl = gsap.timeline({ paused: true }).fromTo(
            content,
            { clipPath: "inset(18% 41% 18% 41% round 28px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: BASE, ease: EASE.whip, clearProps: "clipPath" },
          );
          gsap.set(content, { clipPath: "inset(18% 41% 18% 41% round 28px)" });
          return void play(tl);
        }
        case "halftone": {
          gsap.set(content, { "--dot": "0px", "--hole": "0%" });
          content.classList.add("halftone-mask");
          const tl = gsap
            .timeline({ paused: true, onComplete: () => content.classList.remove("halftone-mask") })
            .to(content, { "--hole": "75%", duration: SLOW, ease: EASE.dissolve }, 0)
            .to(content, { "--dot": "16px", duration: SLOW, ease: EASE.dissolve }, f(4));
          return void play(tl);
        }
        case "matchcut": {
          const disc = el.querySelector("[data-disc]");
          const target = section.querySelector("[data-match]");
          const tl = gsap.timeline({ paused: true });
          tl.set(disc, { autoAlpha: 1 })
            .fromTo(
              disc,
              { scale: 1, x: 0, y: 0 },
              {
                scale: () => (target ? target.offsetWidth / disc.offsetWidth : 0.05),
                x: () => (target ? center(target).x - center(disc).x : 0),
                y: () => (target ? center(target).y - center(disc).y : 0),
                duration: BASE,
                ease: EASE.whip,
              },
            )
            .to(disc, { autoAlpha: 0, duration: SNAP, ease: EASE.dissolve });
          return void play(tl, "top 60%");
        }
        case "jcut": {
          const chip = el.querySelector("[data-jcut]");
          gsap.set(chip, { autoAlpha: 0, y: 20 });
          gsap
            .timeline({ scrollTrigger: { trigger: section, start: "top bottom+=20%", end: "top 45%", toggleActions: "play reverse play reverse" } })
            .to(chip, { autoAlpha: 1, y: 0, duration: QUICK, ease: EASE.keyframe });
          return undefined;
        }
        case "dip": {
          const veil = el.querySelector("[data-veil]");
          const dip = () => gsap.timeline().to(veil, { autoAlpha: 1, duration: f(12), ease: EASE.dissolve }).to(veil, { autoAlpha: 0, duration: f(12), ease: EASE.dissolve });
          return void ScrollTrigger.create({ trigger: section, start: "top 65%", onEnter: dip });
        }
        case "fadeblack": {
          const title = section.querySelector("[data-title-card] .display") ?? section.querySelector("[data-title-card]");
          const tl = gsap
            .timeline({ paused: true })
            .to(section, { backgroundColor: "#1f1f21", duration: f(12), ease: EASE.dissolve })
            .to(title, { color: "#f5f4f1", duration: f(8), ease: EASE.dissolve }, "<")
            .to(section, { backgroundColor: "rgba(31,31,33,0)", duration: SLOW, ease: EASE.dissolve }, `+=${f(30)}`)
            .to(title, { color: "#1f1f21", duration: SLOW, ease: EASE.dissolve, clearProps: "color" }, "<")
            .set(section, { clearProps: "backgroundColor" });
          return void play(tl, "top 55%");
        }
        default:
          return undefined;
      }
    });

    mm.add(DESKTOP_MOTION, () => {
      if (type === "letterbox") {
        const bars = el.querySelectorAll("[data-bar]");
        const h = () => Math.max(0, (window.innerHeight - window.innerWidth / 2.39) / 2);
        gsap.set(bars, { height: h, yPercent: (i) => (i ? 100 : -100) });
        gsap
          .timeline({ scrollTrigger: { trigger: section, start: "top 25%", end: "bottom 75%", toggleActions: "play reverse play reverse", invalidateOnRefresh: true } })
          .to(bars, { yPercent: 0, duration: QUICK, ease: EASE.whip });
      }
      if (type === "rackfocus") {
        const soft = section.querySelectorAll("[data-soft]");
        gsap.fromTo(
          soft,
          { filter: "blur(8px)" },
          { filter: "blur(0px)", duration: SLOW, ease: EASE.dissolve, clearProps: "filter", scrollTrigger: { trigger: section, start: "top 65%", once: true } },
        );
      }
    });
  });

  return (
    <div ref={ref} className="contents">
      {type === "letterbox" && (
        <div className="pointer-events-none fixed inset-0 z-[60] hidden md:block" aria-hidden="true">
          <span data-bar className="absolute inset-x-0 top-0 block h-0 bg-black" style={{ transform: "translateY(-100%)" }} />
          <span data-bar className="absolute inset-x-0 bottom-0 block h-0 bg-black" style={{ transform: "translateY(100%)" }} />
        </div>
      )}
      {type === "matchcut" && (
        <span
          data-disc
          className="pointer-events-none absolute left-1/2 top-[30vh] z-30 block h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange opacity-0 motion-reduce:hidden"
          aria-hidden="true"
        />
      )}
      {type === "jcut" && (
        <p
          data-jcut
          className="pointer-events-none fixed bottom-6 left-1/2 z-[74] -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-paper-2 opacity-0 lg:bottom-[64px]"
          aria-hidden="true"
        >
          <span className="text-orange">A1 ▸</span> {label}
        </p>
      )}
      {type === "dip" && <span data-veil className="pointer-events-none fixed inset-0 z-[65] block bg-paper opacity-0" aria-hidden="true" />}
    </div>
  );
}

function center(node) {
  const r = node.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

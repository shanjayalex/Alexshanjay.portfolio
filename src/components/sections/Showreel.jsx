import { useRef } from "react";
import { FiArrowUpRight, FiPlay } from "react-icons/fi";
import { sections, showreel } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, DESKTOP_MOTION, MOTION } from "../../lib/gsap";
import { scrollToTarget } from "../../lib/scroll";
import { fitLength } from "../../lib/type";
import { parseId, watchUrl } from "../../lib/youtube";
import MagneticButton from "../ui/MagneticButton";
import MetaRow from "../ui/MetaRow";
import ScriptWord from "../ui/ScriptWord";
import StencilTitle from "../ui/StencilTitle";
import TornEdge from "../ui/TornEdge";
import YouTubeFacade from "../ui/YouTubeFacade";

const copy = sections.reel;
const FPS = 24;
const pad = (n) => String(n).padStart(2, "0");
const runtime = `${Math.floor(showreel.seconds / 60)}:${pad(showreel.seconds % 60)}`;

// YouTube's auto-frames sit at about ¼, ½ and ¾ of the clip.
function frameTimecode(n) {
  const frames = Math.round((n / 4) * showreel.seconds * FPS);
  const s = Math.floor(frames / FPS);
  return `00:00:${pad(s)}:${pad(frames % FPS)}`;
}

// The one dark "cinema" band: the reel, a "glimpse" film strip of frames
// from it (click one to play), and the reel's own closing line as a CTA.
export default function Showreel() {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      gsap.fromTo(
        "[data-player]",
        { y: 120, scale: 0.92 },
        { y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } },
      );
      gsap.from("[data-frame]", {
        y: 50,
        rotate: (i) => (i - 1) * 3,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-strip]", start: "top 85%", once: true },
      });
      gsap.from("[data-outro] > *", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-outro]", start: "top 88%", once: true },
      });
    });

    // The strip runs past like film through a gate.
    mm.add(DESKTOP_MOTION, () => {
      gsap.fromTo("[data-strip-track]", { xPercent: 4 }, { xPercent: -4, ease: "none", scrollTrigger: { trigger: "[data-strip]", start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  // A glimpse frame starts the reel: scroll to the player and press play.
  function playReel() {
    scrollToTarget("#reel-player");
    ref.current.querySelector("#reel-player button")?.click();
  }

  return (
    <section ref={ref} id="reel" className="on-ink relative bg-ink px-[var(--gutter)] pb-24 pt-20 text-paper-2 md:pb-36 md:pt-28">
      <TornEdge color="var(--ink)" side="top" seed={5} />
      <TornEdge color="var(--ink)" side="bottom" seed={21} />

      <div className="mx-auto max-w-[1600px]">
        <MetaRow left="Showreel 2026" right={`${runtime} · Press play`} />

        <div className="type-stack relative mt-14 text-center md:mt-20" style={{ "--len": fitLength(copy.title) }}>
          <StencilTitle text={copy.title} label={copy.title} className="text-paper-2" />
          <ScriptWord className="absolute right-[4%] top-[-0.42em] z-20 -rotate-8 text-[0.6em]">{copy.script}</ScriptWord>

          <div data-player id="reel-player" className="relative z-10 mx-auto -mt-[0.32em] max-w-[1180px] text-base">
            <div className="rounded-[28px] bg-[#2a2a2d] p-2 shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)] md:p-3">
              <YouTubeFacade id={showreel.id} title={showreel.title} poster={showreel.poster} className="rounded-[22px]" />
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="mono-label text-left">
                <b className="font-bold text-paper-2">{showreel.title}</b> · Video editing · Motion · Colour
              </span>
              <span className="mono-label hidden shrink-0 sm:inline">16:9 · {runtime}</span>
            </div>
          </div>
        </div>

        <p className="serif-italic mx-auto mt-14 max-w-3xl text-center text-[clamp(1.6rem,3.4vw,2.8rem)] leading-tight text-paper-2 md:mt-20">“{showreel.intro}”</p>

        {/* Glimpse strip — real frames from the reel on a sprocketed film strip */}
        <div data-strip className="glimpse-strip mx-auto mt-10 max-w-[1180px] overflow-hidden md:mt-14">
          <ol data-strip-track className="grid grid-cols-3 gap-2 px-3 py-7 sm:gap-3 md:gap-4 md:px-5 md:py-9">
            {showreel.frames.map((n, i) => (
              <li key={n} data-frame>
                <button
                  type="button"
                  onClick={playReel}
                  data-cursor="play"
                  className="thumb-zoom group relative block aspect-video w-full overflow-hidden rounded-[6px] bg-black text-left"
                  aria-label={`Play the showreel — glimpse ${i + 1}`}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${parseId(showreel.id)}/hq${n}.jpg`}
                    alt=""
                    width="480"
                    height="360"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 hidden font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-paper-2/80 md:block">
                    Glimpse {pad(i + 1)}
                  </span>
                  <span className="absolute bottom-2 left-2 font-mono text-[9px] tabular-nums text-paper-2 md:bottom-3 md:left-3 md:text-[11px]">{frameTimecode(n)}</span>
                  <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-orange text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:bottom-3 md:right-3 md:h-9 md:w-9">
                    <FiPlay className="ml-0.5 h-3.5 w-3.5 fill-current md:h-4 md:w-4" />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div data-outro className="mt-14 flex flex-col items-center gap-6 text-center md:mt-20">
          <p className="display text-[clamp(1.8rem,5.2vw,4.6rem)] text-paper-2 [font-variation-settings:'wdth'_110,'wght'_900]">{showreel.outro}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <MagneticButton href="#contact" className="pill pill-orange">
              Start a project
            </MagneticButton>
            <MagneticButton href={watchUrl(showreel.id)} target="_blank" rel="noreferrer" className="pill pill-outline">
              Watch on YouTube <FiArrowUpRight />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

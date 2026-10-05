import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { sections, shorts, socials } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, DESKTOP_MOTION } from "../../lib/gsap";
import { useLightbox } from "../../lib/lightbox";
import EditTransition from "../fx/EditTransition";
import SectionHeader from "../ui/SectionHeader";
import ShortCard from "../ui/ShortCard";
import Tray from "../ui/Tray";

const channel = socials.find((s) => s.label === "YouTube")?.href;

// Desktop + motion: a 3D "phone reel" carousel (drag / throw / arrow buttons).
// Phones and reduced motion: native horizontal scroll-snap (mouse can drag it).
export default function Shorts() {
  const ref = useRef(null);
  const drag = useRef({ active: false, moved: false, x: 0 });
  const { open } = useLightbox();

  useGsap(ref, (mm, el) => {
    mm.add(DESKTOP_MOTION, () => {
      let cleanup = () => {};
      let dead = false;
      Promise.all([import("gsap/Draggable"), import("gsap/InertiaPlugin"), import("../fx/PhoneCarousel")]).then(
        ([{ Draggable }, { InertiaPlugin }, { setupPhoneCarousel }]) => {
          if (dead) return;
          gsap.registerPlugin(Draggable, InertiaPlugin);
          cleanup = setupPhoneCarousel({
            viewport: el.querySelector("[data-scroller]"),
            track: el.querySelector("[data-track]"),
            prev: el.querySelector("[data-prev]"),
            next: el.querySelector("[data-next]"),
            Draggable,
            InertiaPlugin,
            onDragStart: () => (drag.current.moved = true),
          });
        },
      );
      return () => {
        dead = true;
        cleanup();
      };
    });
  });

  // Mouse-drag for the plain strip (the carousel handles its own dragging).
  function onPointerDown(e) {
    if (e.pointerType !== "mouse" || e.button !== 0 || e.currentTarget.classList.contains("is-carousel")) return;
    drag.current = { active: true, moved: false, x: e.clientX };
  }
  function onPointerMove(e) {
    const state = drag.current;
    if (!state.active) return;
    const dx = e.clientX - state.x;
    if (Math.abs(dx) < 3) return;
    state.moved = true;
    state.x = e.clientX;
    e.currentTarget.scrollLeft -= dx;
  }
  function endDrag() {
    drag.current.active = false;
  }
  // Swallow the click that ends a drag so it doesn't open a card.
  function onClickCapture(e) {
    if (drag.current.moved) {
      e.stopPropagation();
      e.preventDefault();
      drag.current.moved = false;
    }
  }

  return (
    <section ref={ref} id="shorts" className="relative py-24 md:py-32">
      <EditTransition type="swipe" />
      <div className="mx-auto max-w-[1600px] px-[var(--gutter)]">
        <SectionHeader {...sections.shorts} />
      </div>

      <div data-cut className="mx-auto mt-10 max-w-[1600px] px-[var(--gutter)] md:mt-14">
        <Tray className="overflow-hidden !p-0">
          <div
            data-scroller
            data-cursor="drag"
            className="shorts-scroller select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={onClickCapture}
            onDragStart={(e) => e.preventDefault()}
          >
            <div data-track className="flex w-max gap-3 p-3 sm:gap-4 sm:p-4 md:gap-6 md:p-6">
              {shorts.map((short, i) => (
                <ShortCard key={short.id} short={short} number={i + 1} onOpen={() => open({ kind: "short", items: shorts, index: i })} />
              ))}
              <a
                href={`${channel}/shorts`}
                target="_blank"
                rel="noreferrer"
                data-card
                className="paper-card is-interactive flex w-[60vw] shrink-0 flex-col justify-between p-6 sm:w-[36vw] md:aspect-[9/17] md:w-[clamp(220px,20vw,300px)]"
              >
                <span className="mono-label">More on YouTube</span>
                <span className="display text-[2.4rem] leading-[0.9]">All<br />Shorts<br />↗</span>
              </a>
            </div>
          </div>
        </Tray>
        <div hidden className="mt-5 flex items-center justify-center gap-3">
          <button type="button" data-prev className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-paper-2 disabled:opacity-30" aria-label="Previous short">
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <span className="mono-label">Drag · throw · or use the arrows</span>
          <button type="button" data-next className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-paper-2 disabled:opacity-30" aria-label="Next short">
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
        <p className="mono-label mt-4 text-center md:hidden">Swipe →</p>
      </div>
    </section>
  );
}

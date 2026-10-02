import { useRef } from "react";
import { sections, shorts, socials } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { useStaggerIn } from "../../hooks/useStaggerIn";
import { gsap, DESKTOP_MOTION } from "../../lib/gsap";
import { useLightbox } from "../../lib/lightbox";
import { scroller } from "../../lib/scroll";
import SectionHeader from "../ui/SectionHeader";
import ShortCard from "../ui/ShortCard";
import Tray from "../ui/Tray";

const channel = socials.find((s) => s.label === "YouTube")?.href;

// Desktop: the strip pins and scrolls sideways (and can be dragged).
// Mobile / reduced motion: native horizontal scroll-snap.
export default function Shorts() {
  const ref = useRef(null);
  const drag = useRef({ active: false, moved: false, x: 0 });
  const { open } = useLightbox();
  useStaggerIn(ref);

  useGsap(ref, (mm, el) => {
    mm.add(DESKTOP_MOTION, () => {
      const viewport = el.querySelector("[data-scroller]");
      const track = el.querySelector("[data-track]");
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      viewport.classList.add("is-pinned");

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el.querySelector("[data-pin]"),
          start: "center center",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      return () => viewport.classList.remove("is-pinned");
    });
  });

  // Dragging the pinned strip scrubs the page scroll (1px drag = 1px scroll).
  function onPointerDown(e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { active: true, moved: false, x: e.clientX };
  }
  function onPointerMove(e) {
    const state = drag.current;
    if (!state.active) return;
    const dx = e.clientX - state.x;
    if (Math.abs(dx) < 3) return;
    state.moved = true;
    state.x = e.clientX;
    const viewport = e.currentTarget;
    if (viewport.classList.contains("is-pinned") && scroller.lenis) {
      scroller.lenis.scrollTo(scroller.lenis.scroll - dx, { immediate: true });
    } else {
      viewport.scrollLeft -= dx;
    }
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
      <div className="mx-auto max-w-[1600px] px-[var(--gutter)]">
        <SectionHeader {...sections.shorts} />
      </div>

      <div data-pin className="mx-auto mt-10 max-w-[1600px] px-[var(--gutter)] md:mt-14">
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
                className="paper-card is-interactive flex w-[60vw] shrink-0 flex-col justify-between p-6 sm:w-[36vw] md:w-[clamp(200px,16vw,240px)]"
              >
                <span className="mono-label">More on YouTube</span>
                <span className="display text-[2.4rem] leading-[0.9]">All<br />Shorts<br />↗</span>
              </a>
            </div>
          </div>
        </Tray>
        <p className="mono-label mt-4 text-center md:hidden">Swipe →</p>
      </div>
    </section>
  );
}

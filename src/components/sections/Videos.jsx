import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { archive, sections, videos } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, SplitText, MOTION } from "../../lib/gsap";
import { BASE, EASE, f } from "../../lib/motion";
import { useLightbox } from "../../lib/lightbox";
import SectionHeader from "../ui/SectionHeader";
import Tray from "../ui/Tray";
import VideoCard from "../ui/VideoCard";

const MAX_TYPED = 30;

// Whip-pan rows: each row of cards whips in, alternating from the right and
// the left, with a skew + smear that settles. Titles then type on like a
// title tool, with a blinking caret.
export default function Videos() {
  const ref = useRef(null);
  const [showArchive, setShowArchive] = useState(false);
  const { open } = useLightbox();

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      const cells = [...el.querySelectorAll("[data-row-cell]")];
      // Group cells into visual rows by their top edge.
      const rows = [];
      cells.forEach((cell) => {
        const top = Math.round(cell.offsetTop);
        const row = rows.find((r) => Math.abs(r.top - top) < 8);
        if (row) row.cells.push(cell);
        else rows.push({ top, cells: [cell] });
      });

      rows.forEach((row, i) => {
        const dir = i % 2 ? -1 : 1;
        gsap.set(row.cells, { x: () => dir * window.innerWidth * 0.3, skewX: -12 * dir, autoAlpha: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: row.cells[0], start: "top 88%", once: true } })
          .to(row.cells, { x: 0, skewX: 0, autoAlpha: 1, duration: BASE, ease: EASE.whip, stagger: f(3), clearProps: "transform" })
          .add(() => row.cells.forEach(typeOn), f(8));
      });

      function typeOn(cell) {
        const title = cell.querySelector(".card-title");
        if (!title || title.dataset.typed) return;
        title.dataset.typed = "1";
        const split = SplitText.create(title, { type: "chars", aria: "none" });
        const typed = split.chars.slice(0, MAX_TYPED);
        const rest = split.chars.slice(MAX_TYPED);
        const caret = document.createElement("span");
        caret.className = "type-caret";
        caret.setAttribute("aria-hidden", "true");
        title.appendChild(caret);
        gsap
          .timeline({ onComplete: () => gsap.delayedCall(f(18), () => (caret.remove(), split.revert())) })
          .from(typed, { autoAlpha: 0, duration: 0.001, stagger: f(1) })
          .from(rest, { autoAlpha: 0, duration: f(8) });
      }
    });
  });

  return (
    <section ref={ref} id="videos" className="relative px-[var(--gutter)] py-24 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader {...sections.videos} />

        <Tray className="mt-10 grid gap-3 sm:gap-4 md:mt-14 md:grid-cols-2 md:gap-6">
          {videos.map((video, i) => (
            <div key={video.id} data-row-cell className={i === 0 || (i === videos.length - 1 && videos.length % 2 === 0) ? "md:col-span-2" : ""}>
              <VideoCard
                video={video}
                number={i + 1}
                variant={i === 0 ? "featured" : "default"}
                onOpen={() => open({ kind: "video", items: videos, index: i })}
              />
            </div>
          ))}
        </Tray>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShowArchive((v) => !v)}
            className="pill pill-outline"
            aria-expanded={showArchive}
            aria-controls="archive"
          >
            {showArchive ? "Hide older work" : "View older work"}
            <span className="mono-label text-current">({archive.length})</span>
            {showArchive ? <FiArrowUp /> : <FiArrowDown />}
          </button>
        </div>

        <AnimatePresence initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
          {showArchive && (
            <motion.div
              id="archive"
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => ScrollTrigger.refresh()}
            >
              <div className="pb-6 pt-10">
                <p className="mono-label mb-4">
                  <b className="font-bold">Archive</b> · 2023 — 2025
                </p>
                <Tray className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                  {archive.map((video, i) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      number={videos.length + i + 1}
                      onOpen={() => open({ kind: "video", items: archive, index: i })}
                    />
                  ))}
                </Tray>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

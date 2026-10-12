import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useTilt } from "../../hooks/useTilt";
import PosterPlaceholder from "./PosterPlaceholder";

// Poster card with a gentle tilt. Real designs sit in a 4:5 frame (tall
// posters are cropped around `focus`; the lightbox shows them whole);
// placeholders stay square. The whole card opens the lightbox; the
// Instagram link sits above the stretched button.
export default function DesignCard({ design, index, onOpen, tilt = true }) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(6);

  return (
    <motion.div
      ref={ref}
      data-card
      onMouseMove={tilt ? onMouseMove : undefined}
      onMouseLeave={tilt ? onMouseLeave : undefined}
      style={tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className="paper-card is-interactive no-lift group p-2.5 md:p-3"
    >
      <span className={`thumb-zoom relative block overflow-hidden rounded-[14px] bg-paper ${design.image ? "aspect-[4/5]" : "aspect-square"}`}>
        {design.image ? (
          <img
            src={design.thumb ?? design.image}
            alt={design.title}
            width={design.width ?? 1080}
            height={design.height ?? 1350}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: design.focus ?? "50% 50%" }}
          />
        ) : (
          <PosterPlaceholder item={design} index={index} />
        )}
      </span>
      <span className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1 px-1 pb-0.5 pt-3">
        <span className="min-w-0">
          <span className="card-title line-clamp-2 block text-[15px] md:text-base">{design.title}</span>
          <span className="mono-label mt-0.5 flex items-center gap-2">
            {design.category}
            {design.concept && <span className="rounded-full border border-ink/25 px-1.5 py-px text-[9px] tracking-[0.14em]">Concept</span>}
          </span>
        </span>
        {design.href && (
          <a
            href={design.href}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-flex min-h-6 shrink-0 items-center gap-1 py-1 text-[13px] font-semibold text-ink underline decoration-blue decoration-2 underline-offset-4"
          >
            Instagram <FiArrowUpRight />
          </a>
        )}
      </span>
      <button type="button" onClick={onOpen} data-cursor="view" className="absolute inset-0 rounded-[20px]" aria-label={`View ${design.title}`} />
    </motion.div>
  );
}

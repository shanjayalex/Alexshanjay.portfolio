import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useTilt } from "../../hooks/useTilt";
import PosterPlaceholder from "./PosterPlaceholder";

// Square poster card with a gentle tilt. The whole card opens the lightbox;
// the Instagram link sits above the stretched button.
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
      <span className="thumb-zoom relative block aspect-square overflow-hidden rounded-[14px] bg-paper">
        {design.image ? (
          <img src={design.image} alt={design.title} width="1080" height="1080" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <PosterPlaceholder item={design} index={index} />
        )}
      </span>
      <span className="flex items-center justify-between gap-2 px-1 pb-0.5 pt-3">
        <span className="min-w-0">
          <span className="card-title block truncate text-[15px] md:text-base">{design.title}</span>
          <span className="mono-label mt-0.5 block">{design.category}</span>
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

import { FiPlay } from "react-icons/fi";
import RollDigits from "../fx/RollDigits";
import ScrubThumb from "./ScrubThumb";

const pad = (n) => String(n).padStart(2, "0");

// 16:9 episode card. `variant`: "default" | "featured" | "compact" (hero tray, with Watch pill).
// `timecode`: show a running timecode strip (the parent drives [data-tc]).
export default function VideoCard({ video, number, onOpen, variant = "default", eager = false, timecode = false }) {
  const featured = variant === "featured";
  const compact = variant === "compact";

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="play"
      data-card
      className={`paper-card is-interactive group w-full text-left ${compact ? "p-2.5 md:p-3" : "p-3 md:p-4"}`}
      aria-label={`Play ${video.title}`}
    >
      <span className={`thumb-zoom relative block aspect-video overflow-hidden bg-tray ${compact ? "rounded-[12px]" : "rounded-[14px]"}`}>
        <ScrubThumb id={video.id} eager={eager} />
        {timecode && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/60 to-transparent px-2.5 pb-1.5 pt-4 font-mono text-[10px] font-medium tabular-nums tracking-[0.08em] text-paper-2" aria-hidden="true">
            <span>
              <span className="rec-dot mr-1.5 inline-block !h-1.5 !w-1.5 align-middle" />
              <span data-tc>00:00:00:00</span>
            </span>
            <span>V{number}</span>
          </span>
        )}
        <span className="play-badge">
          <span>
            <FiPlay className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </span>
      </span>

      <span className={`flex items-center justify-between gap-3 ${compact ? "mt-2.5" : "mt-4"}`}>
        <span className="mono-label">
          Episode # <RollDigits value={pad(number)} className="font-bold text-ink" />
        </span>
        {compact ? (
          <span className="pill pill-orange pill-sm min-h-[26px] text-[11px]">
            <FiPlay className="h-3 w-3 fill-current" /> Watch
          </span>
        ) : (
          <span className="mono-label">{video.year ?? "Archive"}</span>
        )}
      </span>

      <span
        className={`card-title block ${
          featured ? "mt-2 text-2xl md:text-4xl" : compact ? "mt-1.5 truncate text-[15px] md:text-base" : "mt-2 text-xl md:text-2xl"
        }`}
      >
        {video.title}
      </span>

      {!compact && (
        <span className="mt-3 flex items-center gap-2">
          <span className={`chip ${number % 2 ? "" : "is-orange"}`}>{video.category}</span>
        </span>
      )}
    </button>
  );
}

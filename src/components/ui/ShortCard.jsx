import { FiPlay } from "react-icons/fi";
import { thumb } from "../../lib/youtube";
import Thumb from "./Thumb";

function StatusBar() {
  return (
    <span className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/55 to-transparent px-4 pb-6 pt-3 font-mono text-[11px] font-bold text-white">
      <span>9:41</span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
          <rect x="0" y="7" width="3" height="3" rx="0.6" />
          <rect x="4.3" y="5" width="3" height="5" rx="0.6" />
          <rect x="8.6" y="2.5" width="3" height="7.5" rx="0.6" />
          <rect x="12.9" y="0" width="3" height="10" rx="0.6" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="currentColor" opacity="0.6" />
          <rect x="2" y="2" width="14" height="7" rx="1.6" fill="currentColor" />
          <rect x="21.6" y="3.6" width="1.6" height="3.8" rx="0.8" fill="currentColor" opacity="0.6" />
        </svg>
      </span>
    </span>
  );
}

// 9:16 Reel-style card with a phone status bar.
export default function ShortCard({ short, number, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="play"
      data-card
      className="paper-card is-interactive group w-[68vw] shrink-0 p-2.5 text-left sm:w-[44vw] md:w-[clamp(220px,20vw,300px)]"
      aria-label={`Play ${short.title}`}
    >
      <span className="thumb-zoom relative block aspect-[9/16] overflow-hidden rounded-[14px] bg-ink">
        <StatusBar />
        <Thumb sources={thumb(short.id, true)} alt="" width={720} height={1280} />
        <span className="play-badge">
          <span>
            <FiPlay className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/80">
            Short # {String(number).padStart(2, "0")}
          </span>
        </span>
      </span>
      <span className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
        <span className="card-title truncate text-base">{short.title}</span>
        <span className="chip is-orange">{short.category}</span>
      </span>
    </button>
  );
}

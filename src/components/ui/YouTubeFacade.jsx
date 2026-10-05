import { useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";
import { embed, thumb } from "../../lib/youtube";
import Thumb from "./Thumb";

const PULL = 80; // px around the button where it starts to lean toward the pointer

// Thumbnail first; the iframe only loads after a click.
// `cinema`: magnetic play button with a progress ring on hover (Showreel).
export default function YouTubeFacade({ id, title, className = "", cinema = false, onPlay }) {
  const [playing, setPlaying] = useState(false);
  const knob = useRef(null);

  if (playing) {
    return (
      <div className={`relative aspect-video overflow-hidden bg-black ${className}`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embed(id)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  function onMouseMove(e) {
    if (!cinema || !knob.current || e.pointerType === "touch") return;
    const r = knob.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const near = Math.hypot(dx, dy) < r.width / 2 + PULL;
    knob.current.style.translate = near ? `${dx * 0.35}px ${dy * 0.35}px` : "0 0";
  }

  return (
    <button
      type="button"
      onClick={() => {
        setPlaying(true);
        onPlay?.();
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => knob.current && (knob.current.style.translate = "0 0")}
      data-cursor="play"
      className={`thumb-zoom group relative block aspect-video w-full overflow-hidden bg-black text-left ${className}`}
      aria-label={`Play ${title}`}
    >
      <Thumb sources={thumb(id)} alt="" />
      <span className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/5" />
      <span className="absolute inset-0 grid place-items-center">
        <span ref={knob} className="relative grid h-20 w-20 place-items-center transition-[translate] duration-300 ease-[cubic-bezier(.16,1,.3,1)] md:h-28 md:w-28">
          <span className="absolute inset-0 rounded-full bg-orange text-ink shadow-xl transition-transform duration-500 group-hover:scale-110" />
          {cinema && (
            <svg viewBox="0 0 100 100" className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="47" fill="none" stroke="rgb(245 244 241 / 0.25)" strokeWidth="1.5" />
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="var(--orange)"
                strokeWidth="2.5"
                pathLength="100"
                strokeDasharray="100"
                className="[stroke-dashoffset:100] transition-[stroke-dashoffset] duration-[1.6s] ease-linear group-hover:[stroke-dashoffset:0]"
              />
            </svg>
          )}
          <FiPlay className="relative ml-1 h-8 w-8 fill-current text-ink md:h-10 md:w-10" />
        </span>
      </span>
    </button>
  );
}

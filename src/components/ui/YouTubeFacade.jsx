import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import { embed, thumb } from "../../lib/youtube";
import Thumb from "./Thumb";

// Thumbnail first; the iframe only loads after a click.
export default function YouTubeFacade({ id, title, className = "" }) {
  const [playing, setPlaying] = useState(false);

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

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      data-cursor="play"
      className={`thumb-zoom group relative block aspect-video w-full overflow-hidden bg-black text-left ${className}`}
      aria-label={`Play ${title}`}
    >
      <Thumb sources={thumb(id)} alt="" />
      <span className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/5" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-orange text-ink shadow-xl transition-transform duration-500 group-hover:scale-110 md:h-28 md:w-28">
          <FiPlay className="ml-1 h-8 w-8 fill-current md:h-10 md:w-10" />
        </span>
      </span>
    </button>
  );
}

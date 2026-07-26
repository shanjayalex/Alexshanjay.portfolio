import { useState } from "react";
import { FiPlay } from "react-icons/fi";

export default function YouTubeFacade({ id, title, className = "", big = false }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className={`relative aspect-video overflow-hidden ${className}`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`group relative aspect-video w-full overflow-hidden text-left cursor-pointer ${className}`}
      aria-label={`Play ${title}`}
    >
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-ink/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`flex items-center justify-center rounded-full bg-yellow text-ink shadow-lg transition-transform duration-300 group-hover:scale-110 ${
            big ? "h-20 w-20" : "h-14 w-14"
          }`}
        >
          <FiPlay className={big ? "h-8 w-8 ml-1" : "h-5 w-5 ml-0.5"} />
        </span>
      </div>
    </button>
  );
}

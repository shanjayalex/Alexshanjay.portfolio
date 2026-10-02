// Typographic stand-in poster shown until a real design export is added
// (set `image` on the design in content.js). Sized with container units.
import { fitLength } from "../../lib/type";

const VARIANTS = [
  { bg: "var(--ink)", fg: "var(--paper-2)", accent: "var(--orange)", grid: "rgb(255 255 255 / .06)" },
  { bg: "var(--orange)", fg: "var(--ink)", accent: "var(--paper-2)", grid: "rgb(0 0 0 / .07)" },
  { bg: "var(--paper-2)", fg: "var(--ink)", accent: "var(--orange)", grid: "rgb(0 0 0 / .06)" },
];
const SCRIPTS = ["fresh", "bold", "taste", "crafted", "launch", "story"];

export default function PosterPlaceholder({ item, index = 0, large = false }) {
  const v = VARIANTS[index % VARIANTS.length];
  const word = item.category.split(" ")[0];

  return (
    <div className="h-full w-full" style={{ containerType: "inline-size" }}>
      <div
        className="relative flex aspect-square w-full flex-col justify-between overflow-hidden p-[7cqw]"
        style={{
          background: v.bg,
          color: v.fg,
          backgroundImage: `linear-gradient(${v.grid} 1px, transparent 1px), linear-gradient(90deg, ${v.grid} 1px, transparent 1px)`,
          backgroundSize: "8cqw 8cqw",
        }}
        role="img"
        aria-label={`${item.title} — poster`}
      >
        <div className="flex justify-between font-mono text-[3.2cqw] uppercase tracking-[0.18em] opacity-80">
          <span>AX.Visuals</span>
          <span>No. {String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="relative">
          <span className="script absolute -top-[13cqw] left-0 -rotate-8 text-[17cqw]" style={{ color: v.accent }} aria-hidden="true" data-text={SCRIPTS[index % SCRIPTS.length]} />
          <p className="display stencil" style={{ color: v.fg, fontSize: `min(15cqw, ${(84 / fitLength(word)).toFixed(2)}cqw)` }}>
            {word}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <span className="serif-italic text-[5.5cqw] leading-tight">{item.title}</span>
          {large && <span className="shrink-0 font-mono text-[2.6cqw] uppercase tracking-[0.18em] opacity-70">1080 × 1080</span>}
        </div>
      </div>
    </div>
  );
}

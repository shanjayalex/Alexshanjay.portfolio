import { useRef, useState } from "react";
import { parseId, thumb } from "../../lib/youtube";
import Thumb from "./Thumb";

// Nominal clip length for the decorative timecode (the real duration isn't known client-side).
const PREVIEW_SECONDS = 60;
const FPS = 24;
const pad = (n) => String(n).padStart(2, "0");

const COLS = 8;

// RGB parade values (0–1, per channel × COLS columns) sampled once from the
// thumbnail. Falls back to stable pseudo-values if the image can't be read
// (no CORS headers → tainted canvas).
const paradeCache = new Map();
function sampleParade(id, done) {
  if (paradeCache.has(id)) return done(paradeCache.get(id));
  const fallback = () => {
    let seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return [0, 1, 2].map(() => Array.from({ length: COLS }, () => 0.25 + rand() * 0.65));
  };
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    let values;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = COLS;
      canvas.height = 6;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, COLS, 6);
      const data = ctx.getImageData(0, 0, COLS, 6).data;
      values = [0, 1, 2].map((ch) =>
        Array.from({ length: COLS }, (_, x) => {
          let sum = 0;
          for (let y = 0; y < 6; y++) sum += data[(y * COLS + x) * 4 + ch];
          return sum / 6 / 255;
        }),
      );
    } catch {
      values = fallback();
    }
    paradeCache.set(id, values);
    done(values);
  };
  img.onerror = () => {
    const values = fallback();
    paradeCache.set(id, values);
    done(values);
  };
  img.src = `https://i.ytimg.com/vi/${parseId(id)}/mqdefault.jpg`;
}

const PARADE_COLORS = ["#ff4d5e", "#43d17a", "#4aa3ff"];

function Parade({ values }) {
  return (
    <svg viewBox={`0 0 ${COLS * 3 + 4} 12`} className="absolute right-2 top-2 h-7 w-16 rounded-[3px] bg-ink/80 p-1" aria-hidden="true">
      {values.map((channel, c) =>
        channel.map((v, i) => <rect key={`${c}-${i}`} x={c * (COLS + 2) + i} y={12 - v * 12} width="0.7" height={v * 12} fill={PARADE_COLORS[c]} />),
      )}
    </svg>
  );
}

function timecode(progress) {
  const frames = Math.round(progress * PREVIEW_SECONDS * FPS);
  const s = Math.floor(frames / FPS);
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(frames % FPS)}`;
}

// Thumbnail that skims through the video like an editor scrubbing a clip:
// mouse X picks one of YouTube's auto frames (start / middle / end). Mouse only —
// touch keeps the static thumbnail. Frames load on the first hover.
export default function ScrubThumb({ id, eager = false }) {
  const [frames, setFrames] = useState(null);
  const [progress, setProgress] = useState(null);
  const [parade, setParade] = useState(null);
  const ref = useRef(null);

  function onPointerEnter(e) {
    if (e.pointerType !== "mouse") return;
    if (!frames) {
      const base = `https://i.ytimg.com/vi/${parseId(id)}`;
      const list = [1, 2, 3].map((n) => `${base}/hq${n}.jpg`);
      list.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
      setFrames(list);
      sampleParade(id, setParade);
    }
    onPointerMove(e);
  }

  function onPointerMove(e) {
    if (e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    setProgress(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  }

  // Quarter 1 shows the main thumbnail, then the three auto frames.
  const active = progress === null ? null : Math.min(3, Math.floor(progress * 4));
  const frame = frames && active > 0 ? frames[active - 1] : null;

  return (
    <span
      ref={ref}
      data-cursor="scrub"
      className="absolute inset-0 block"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setProgress(null)}
    >
      <Thumb sources={thumb(id)} alt="" eager={eager} />
      {frame && <img src={frame} alt="" width="480" height="360" className="absolute inset-0 h-full w-full object-cover" />}
      {progress !== null && parade && <Parade values={parade} />}
      {progress !== null && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-ink/70 to-transparent px-3 pb-2 pt-6" aria-hidden="true">
          <span className="block font-mono text-[11px] font-medium tabular-nums tracking-[0.08em] text-paper-2">{timecode(progress)}</span>
          <span className="mt-1.5 block h-[3px] rounded-full bg-paper-2/25">
            <span className="block h-full rounded-full bg-orange" style={{ width: `${progress * 100}%` }} />
          </span>
        </span>
      )}
    </span>
  );
}

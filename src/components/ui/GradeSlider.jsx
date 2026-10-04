import { useRef, useState } from "react";
import { grade } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";
import { thumb } from "../../lib/youtube";
import Thumb from "./Thumb";

const clamp = (v) => Math.min(100, Math.max(0, v));
// Stand-in "LOG" look while real stills aren't exported yet: flat, milky, desaturated.
const LOG_FILTER = "saturate(0.32) contrast(0.6) brightness(1.16)";

// Before/after wipe: LOG on the left of the handle, graded on the right.
// Drag anywhere, or focus the handle and use ←/→ (Shift for bigger steps).
export default function GradeSlider() {
  const ref = useRef(null);
  const touched = useRef(false);
  const [pos, setPos] = useState(50);
  const simulated = !grade.log || !grade.final;
  const sources = simulated ? thumb(grade.fallbackId) : null;

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      // One-time hint sweep 20 → 80 → 50 when it first scrolls into view.
      const state = { v: 50 };
      const update = () => !touched.current && setPos(state.v);
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } })
        .set(state, { v: 20, onComplete: update })
        .to(state, { v: 80, duration: 0.8, ease: "power2.inOut", onUpdate: update })
        .to(state, { v: 50, duration: 0.8, ease: "power2.inOut", onUpdate: update });
    });
  });

  function fromPointer(e) {
    const r = ref.current.getBoundingClientRect();
    setPos(clamp(((e.clientX - r.left) / r.width) * 100));
  }

  function onPointerDown(e) {
    touched.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e);
  }

  function onKeyDown(e) {
    const step = e.shiftKey ? 10 : 2;
    const next = { ArrowLeft: pos - step, ArrowRight: pos + step, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    touched.current = true;
    setPos(clamp(next));
  }

  const value = Math.round(pos);

  return (
    <figure className="mt-12">
      <div
        ref={ref}
        data-cursor="drag"
        className="relative aspect-video touch-pan-y select-none overflow-hidden rounded-[14px] bg-tray"
        onPointerDown={onPointerDown}
        onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
      >
        {simulated ? <Thumb sources={sources} alt="" /> : <img src={grade.final} alt="" width="1280" height="720" loading="lazy" className="h-full w-full object-cover" />}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, filter: simulated ? LOG_FILTER : undefined }} aria-hidden="true">
          {simulated ? (
            <Thumb sources={sources} alt="" />
          ) : (
            <img src={grade.log} alt="" width="1280" height="720" loading="lazy" className="h-full w-full object-cover" />
          )}
        </div>

        <span className="mono-label pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 !text-paper-2">Log</span>
        <span className="mono-label pointer-events-none absolute right-3 top-3 rounded-full bg-orange px-2.5 py-1 !text-ink">Graded</span>

        <div className="pointer-events-none absolute inset-y-0 w-0" style={{ left: `${pos}%` }}>
          <span className="absolute inset-y-0 -left-px w-0.5 bg-paper-2 shadow-[0_0_10px_rgb(0_0_0/0.4)]" />
          <span
            role="slider"
            tabIndex={0}
            aria-label="Colour grade comparison — LOG to graded"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-valuetext={`${value}% LOG, ${100 - value}% graded`}
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute left-0 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper-2 font-mono text-[13px] font-bold text-ink shadow-[0_6px_18px_-6px_rgb(0_0_0/0.5)]"
          >
            ‹›
          </span>
        </div>
      </div>
      <figcaption className="mono-label mt-3 flex justify-between gap-4">
        <span>
          <b className="font-bold">Colour</b> · drag to compare
        </span>
        <span>{grade.caption}</span>
      </figcaption>
    </figure>
  );
}

import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";

const LABELS = { play: "Play", view: "View", drag: "← Drag →" };
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

// Ink dot + lagging ring. Elements opt into labels with data-cursor="play|view|drag".
export default function CustomCursor() {
  const enabled = useFinePointer();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [mode, setMode] = useState(null);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add("has-cursor");

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3" });

    function onMove(e) {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      setVisible(true);
    }
    function onOver(e) {
      const target = e.target.closest?.("[data-cursor]");
      setMode(target?.dataset.cursor ?? null);
      setHover(Boolean(e.target.closest?.("a, button, [data-magnetic]")));
    }
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = mode && LABELS[mode];
  const size = label ? (mode === "drag" ? 104 : 84) : hover ? 54 : 34;
  const ringStyle = label
    ? {
        play: "bg-orange text-ink border-orange",
        view: "bg-ink text-paper-2 border-ink",
        drag: "bg-paper-2 text-ink border-ink",
      }[mode]
    : hover
      ? "border-orange bg-orange/10"
      : "border-ink/50 mix-blend-difference";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300]" style={{ opacity: visible ? 1 : 0 }}>
      <div ref={ringRef} className="fixed left-0 top-0">
        <div
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-[width,height,background-color,border-color] duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${ringStyle}`}
          style={{ width: size, height: size }}
        >
          {label}
        </div>
      </div>
      <div ref={dotRef} className="fixed left-0 top-0">
        <div
          className={`h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-opacity ${label ? "opacity-0" : ""}`}
        />
      </div>
    </div>
  );
}

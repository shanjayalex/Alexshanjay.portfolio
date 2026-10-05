import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { SNAP } from "../../lib/motion";

const LABELS = { play: "Play ▶", view: "View", drag: "← Drag →", scrub: "Rec ●" };
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const TEXT = "p, h1, h2, h3, h4, dd, dt, blockquote, figcaption";
const BOX = 34;

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

// Camera viewfinder cursor (desktop, fine pointer only).
// - default: crosshair + four focus brackets that lag behind the pointer
// - over a card ([data-cursor]): brackets snap to the card's edges with a REC/PLAY/VIEW label
// - over links: brackets collapse to a dot
// - over text: an orange playhead line (I-beam)
// - mouse held down: brackets tighten and the hovered card is rack-focused
//   (the rest of its section blurs 3px)
// Runs on the shared GSAP ticker.
export default function ViewfinderCursor() {
  const enabled = useFinePointer();
  const crossRef = useRef(null);
  const frameRef = useRef(null);
  const [mode, setMode] = useState("default"); // default | card | link | text
  const [label, setLabel] = useState(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const frame = frameRef.current;
    const q = (prop, d) => gsap.quickTo(frame, prop, { duration: d, ease: "power3" });
    const fx = q("x", 0.15);
    const fy = q("y", 0.15);
    const fw = q("width", SNAP);
    const fh = q("height", SNAP);
    const cx = gsap.quickTo(crossRef.current, "x", { duration: 0.05, ease: "power3" });
    const cy = gsap.quickTo(crossRef.current, "y", { duration: 0.05, ease: "power3" });

    const pointer = { x: -100, y: -100 };
    let target = null; // snapped card element
    let state = "default";
    let focused = null;

    function place() {
      if (target && document.contains(target)) {
        const r = target.getBoundingClientRect();
        fx(r.left);
        fy(r.top);
        fw(r.width);
        fh(r.height);
      } else {
        const size = state === "link" ? 8 : BOX;
        fx(pointer.x - size / 2);
        fy(pointer.y - size / 2);
        fw(size);
        fh(size);
      }
    }
    gsap.ticker.add(place);

    function onMove(e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      cx(e.clientX);
      cy(e.clientY);
      setVisible(true);
    }

    function onOver(e) {
      const el = e.target;
      setDark(Boolean(el.closest?.(".on-ink")));
      const card = el.closest?.("[data-cursor]");
      const link = el.closest?.("a, button, [data-magnetic], summary, [role=slider]");
      if (card) {
        state = "card";
        target = card.closest("[data-card]") ?? card;
        setLabel(LABELS[card.dataset.cursor] ?? null);
      } else {
        target = null;
        setLabel(null);
        state = link ? "link" : el.closest?.(TEXT) ? "text" : "default";
      }
      setMode(state);
    }

    function onDown(e) {
      if (e.button !== 0) return;
      setPressed(true);
      if (state === "card" && target) {
        const section = target.closest("section");
        if (section) {
          focused = { section, target };
          section.classList.add("rack-focus");
          target.classList.add("rack-target");
        }
      }
    }
    function onUp() {
      setPressed(false);
      if (focused) {
        focused.section.classList.remove("rack-focus");
        focused.target.classList.remove("rack-target");
        focused = null;
      }
    }
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      gsap.ticker.remove(place);
      onUp();
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const tight = pressed ? "scale-[0.92]" : "";
  const bracket = `absolute h-3 w-3 transition-[border-color] duration-200 ${dark ? "border-paper-2" : "border-ink"}`;
  const isCard = mode === "card";
  const isLink = mode === "link";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300] mix-blend-normal" style={{ opacity: visible ? 1 : 0 }}>
      {/* Focus brackets */}
      <div ref={frameRef} className="fixed left-0 top-0" style={{ width: BOX, height: BOX }}>
        <div className={`absolute inset-0 transition-[transform,opacity] duration-200 ${tight} ${isLink ? "opacity-0" : ""} ${isCard ? "[&>span]:border-orange" : ""}`}>
          <span className={`${bracket} left-0 top-0 border-l-2 border-t-2`} />
          <span className={`${bracket} right-0 top-0 border-r-2 border-t-2`} />
          <span className={`${bracket} bottom-0 left-0 border-b-2 border-l-2`} />
          <span className={`${bracket} bottom-0 right-0 border-b-2 border-r-2`} />
          {isCard && label && (
            <span className="absolute left-3 top-3 rounded-sm bg-ink px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-orange">{label}</span>
          )}
        </div>
        <span className={`absolute inset-0 m-auto h-2 w-2 rounded-full bg-orange transition-opacity duration-200 ${isLink ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* Crosshair / playhead at the exact pointer */}
      <div ref={crossRef} className="fixed left-0 top-0">
        {mode === "text" ? (
          <span className="absolute -left-px -top-3 h-6 w-0.5 bg-orange" />
        ) : (
          <span className={`absolute -left-[5px] -top-[5px] h-[10px] w-[10px] transition-opacity ${isLink || isCard ? "opacity-0" : ""}`}>
            <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 ${dark ? "bg-paper-2" : "bg-ink"}`} />
            <span className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 ${dark ? "bg-paper-2" : "bg-ink"}`} />
          </span>
        )}
      </div>
    </div>
  );
}

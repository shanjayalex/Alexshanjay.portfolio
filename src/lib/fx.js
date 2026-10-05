import { gsap } from "./gsap";
import { f } from "./motion";

// Shared state for page-wide effects (grain, dimming) — e.g. the showreel
// sets `playing` so ambient loops pause while the reel runs.
export const fx = { playing: false };
const listeners = new Set();

export function setPlaying(value) {
  fx.playing = value;
  document.documentElement.classList.toggle("is-playing", value);
  listeners.forEach((fn) => fn(fx));
}

export function onFx(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Hard cut with a flash frame: a near-white frame held for `frames`, then gone.
let flashEl = null;
export function flashFrame(frames = 2) {
  if (typeof document === "undefined") return;
  if (!flashEl) {
    flashEl = document.createElement("div");
    flashEl.setAttribute("aria-hidden", "true");
    Object.assign(flashEl.style, { position: "fixed", inset: "0", zIndex: "350", pointerEvents: "none", background: "#fbfaf7", opacity: "0" });
    document.body.appendChild(flashEl);
  }
  gsap.timeline().set(flashEl, { opacity: 0.85 }).set(flashEl, { opacity: 0 }, f(frames));
}

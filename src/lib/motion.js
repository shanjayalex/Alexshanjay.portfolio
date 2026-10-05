/*
 * The 24 fps grid — every duration on the site is a whole number of frames,
 * every ease is named after edit language.
 *
 * MOTION_BUDGET
 * - Max 2 pinned sections per page (Showreel cinema mode, Shorts carousel on
 *   desktop is NOT pinned — so: Showreel only, plus one spare).
 * - Max 1 canvas animation running at a time (the film grain).
 * - No animated filter: blur() above 8px, and no animated blur on phones.
 * - Ambient loops (grain, timecodes, VU jitter) pause off-screen and when the
 *   tab is hidden. Reduced motion turns every one of them off.
 */
import { gsap, CustomEase } from "./gsap";

export const FPS = 24;
export const f = (frames) => frames / FPS;

export const CUT = f(0);
export const SNAP = f(6);
export const QUICK = f(10);
export const BASE = f(18);
export const SLOW = f(30);
export const HERO = f(48);

// Named eases. `cut` is a hard cut; the rest are CustomEase curves.
CustomEase.create("dissolve", "0.45, 0, 0.55, 1");
CustomEase.create("whip", "0.7, 0, 0.1, 1");
CustomEase.create("keyframe", "0.16, 1, 0.3, 1");
CustomEase.create("bounce-key", "M0,0 C0.2,0 0.3,1.28 0.6,1.08 0.78,0.97 0.86,1 1,1");
export const EASE = { cut: "steps(1)", dissolve: "dissolve", whip: "whip", keyframe: "keyframe", bounceKey: "bounce-key" };

// Stagger that advances in whole frames.
export const frames = (n = 2, extra = {}) => ({ each: f(n), ...extra });

// "On twos": quantise a tween to `fps` steps per second for a hand-animated look.
export function stepped(vars, fps = 12) {
  const duration = vars.duration ?? BASE;
  return { ...vars, ease: `steps(${Math.max(1, Math.round(duration * fps))})` };
}

// HH:MM:SS:FF for a frame count.
const pad = (n) => String(n).padStart(2, "0");
export function timecode(totalFrames) {
  const fr = Math.max(0, Math.round(totalFrames));
  const s = Math.floor(fr / FPS);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(fr % FPS)}`;
}

export { gsap };

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "expo.out", duration: 1.1 });

// gsap.matchMedia conditions shared by every section.
export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const MOBILE_MOTION = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText };

// Clip-path states for the script "ink writing on" wipe (negative insets keep swashes visible).
export const SCRIPT_HIDDEN = "inset(-40% 105% -40% -10%)";
export const SCRIPT_SHOWN = "inset(-40% -10% -40% -10%)";

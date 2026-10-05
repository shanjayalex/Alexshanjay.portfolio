import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

// Draggable + InertiaPlugin are heavier and only used by the Shorts carousel,
// which imports them on demand (see PhoneCarousel and vite.config.js).
// Layout transitions (Design filters) use Framer Motion's shared layout, so
// GSAP Flip isn't needed.
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
gsap.defaults({ ease: "expo.out", duration: 1.1 });

// gsap.matchMedia conditions shared by every section.
export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const MOBILE_MOTION = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";
// Wide screens with a mouse — pointer-follow effects and the portrait flight.
export const WIDE_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText, CustomEase };

// Clip-path states for the script "ink writing on" wipe (negative insets keep swashes visible).
export const SCRIPT_HIDDEN = "inset(-40% 105% -40% -10%)";
export const SCRIPT_SHOWN = "inset(-40% -10% -40% -10%)";

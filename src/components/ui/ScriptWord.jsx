import { useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION, SCRIPT_HIDDEN, SCRIPT_SHOWN } from "../../lib/gsap";

// Orange handwritten accent that "writes on" left→right like ink.
// Pass `reveal={false}` when a parent timeline animates `[data-script]`.
export default function ScriptWord({ children, className = "", style, reveal = true }) {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    if (!reveal) return;
    mm.add(MOTION, () => {
      gsap.fromTo(
        el,
        { clipPath: SCRIPT_HIDDEN },
        {
          clipPath: SCRIPT_SHOWN,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });
  });

  return (
    <span ref={ref} data-script className={`script inline-block px-[0.1em] ${className}`} style={style} aria-hidden="true" data-text={children} />
  );
}

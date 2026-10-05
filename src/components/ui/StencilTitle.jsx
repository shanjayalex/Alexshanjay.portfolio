import { useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";

// `outline`: wireframe version (a 1.5px ring outline instead of the solid ring).
function Ring({ outline }) {
  return (
    <span className="char char-ring">
      <svg viewBox="0 0 100 86" aria-hidden="true">
        <ellipse cx="50" cy="43" rx="38" ry="31.5" fill="none" stroke={outline ? "var(--ink)" : "currentColor"} strokeWidth="23" />
        {outline && <ellipse cx="50" cy="43" rx="38" ry="31.5" fill="none" stroke="var(--paper)" strokeWidth="20" />}
      </svg>
    </span>
  );
}

// Giant uppercase display word with stencil cuts. Chars rise from a mask on
// scroll; pass `reveal={false}` when a parent timeline animates `.char`.
export default function StencilTitle({ text, as: Tag = "h2", ring = false, outline = false, reveal = true, className = "", style, id, label }) {
  const ref = useRef(null);
  const lines = text.toUpperCase().split("\n");
  // The ring replaces the last "O" (echoes the "lO" in the reference poster).
  const ringLine = ring ? lines.findLastIndex((line) => line.includes("O")) : -1;
  const ringChar = ringLine >= 0 ? lines[ringLine].lastIndexOf("O") : -1;

  useGsap(ref, (mm, el) => {
    if (!reveal) return;
    mm.add(MOTION, () => {
      gsap.from(el.querySelectorAll(".char"), {
        yPercent: 110,
        stagger: 0.035,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
  });

  return (
    <Tag ref={ref} id={id} className={`display squash ${className}`} style={style} aria-label={label ?? lines.join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="stencil block whitespace-nowrap" aria-hidden="true">
          {[...line].map((ch, ci) => {
            if (ch === " ") return <span key={ci} className="inline-block w-[0.28em]" />;
            const useRing = li === ringLine && ci === ringChar;
            return (
              <span key={ci} className="char-mask">
                {useRing ? <Ring outline={outline} /> : <span className="char">{ch}</span>}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

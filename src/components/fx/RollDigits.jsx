import { useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, MOTION } from "../../lib/gsap";
import { EASE, f } from "../../lib/motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Flip-clock number: each digit is a 0–9 column that rolls to its value when
// it scrolls into view (digits land one frame apart, right to left like an
// odometer). Non-digits ("Rs.", ",") stay put. The final value is in the HTML,
// so no-JS and reduced motion just show it.
export default function RollDigits({ value, className = "" }) {
  const ref = useRef(null);
  const chars = [...String(value)];

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      const cols = [...el.querySelectorAll("[data-col]")];
      gsap.set(cols, { y: 0, yPercent: 0 });
      gsap.to(cols, {
        yPercent: (i, col) => -Number(col.dataset.col) * 10,
        duration: (i) => f(14 + (cols.length - i) * 3),
        ease: EASE.keyframe,
        stagger: { each: f(1), from: "end" },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });
  });

  return (
    <span ref={ref} className={`roll ${className}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="roll">
        {chars.map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="roll-digit">
              <span data-col={ch} className="roll-col" style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className="roll-digit">
              {ch === " " ? "\u00a0" : ch}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

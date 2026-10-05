import { useRef } from "react";
import { useGsap } from "../../hooks/useGsap";
import { gsap, ScrollTrigger, MOTION } from "../../lib/gsap";
import { f } from "../../lib/motion";

const SEGMENTS = 20;

// Peak line position inside the meter's 4px padding; the bounce overshoots, so clamp.
// Light whole segments only, from the bottom.
const litClip = (v) => `inset(${100 - (Math.round((Math.min(100, Math.max(0, v)) / 100) * SEGMENTS) * 100) / SEGMENTS}% 0 0 0)`;
const peakAt = (v) => `calc(4px + (100% - 10px) * ${Math.min(100, Math.max(0, v)) / 100})`;


// Skill levels as audio VU meters. On enter each meter bounces up to its value
// with an overshoot, a peak-hold line marks the max and slowly falls back, and
// while on screen the levels jitter ±2% every few seconds like live audio.
// The HTML already shows the final values (no-JS / reduced motion).
export default function VUMeter({ items }) {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(MOTION, () => {
      const meters = [...el.querySelectorAll("[data-meter]")].map((node, i) => ({
        node,
        lit: node.querySelector("[data-lit]"),
        peakLine: node.querySelector("[data-peak]"),
        value: items[i].value,
        state: { v: 0, peak: 0 },
      }));

      const render = (m) => {
        m.lit.style.clipPath = litClip(m.state.v);
        m.state.peak = Math.max(m.state.peak, m.state.v);
        m.peakLine.style.bottom = peakAt(m.state.peak);
      };
      meters.forEach(render);

      const bounce = () =>
        meters.forEach((m, i) => {
          gsap
            .timeline({ delay: i * f(2) })
            .to(m.state, { v: m.value, duration: f(22), ease: "back.out(2.6)", onUpdate: () => render(m) })
            .to(m.state, { peak: m.value, duration: 1.6, ease: "power1.in", onUpdate: () => (m.peakLine.style.bottom = peakAt(m.state.peak)) }, `+=${f(12)}`);
        });

      // Live jitter while visible; paused off-screen.
      let jitter = null;
      const wobble = () => {
        meters.forEach((m) => {
          const target = gsap.utils.clamp(0, 100, m.value + gsap.utils.random(-2, 2));
          gsap.timeline().to(m.state, { v: target, duration: f(4), ease: "power2.out", onUpdate: () => render(m) }).to(m.state, { v: m.value, duration: f(10), ease: "power2.inOut", onUpdate: () => render(m) });
        });
        jitter = gsap.delayedCall(gsap.utils.random(3, 4), wobble);
      };

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "bottom top",
        once: false,
        onEnter: (self) => {
          if (!self.bounced) {
            self.bounced = true;
            bounce();
          }
          jitter ??= gsap.delayedCall(3, wobble);
        },
        onEnterBack: () => (jitter ??= gsap.delayedCall(3, wobble)),
        onLeave: () => (jitter?.kill(), (jitter = null)),
        onLeaveBack: () => (jitter?.kill(), (jitter = null)),
      });

      return () => jitter?.kill();
    });
  });

  return (
    <ul ref={ref} className="mt-12 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-6" aria-label="Skills">
      {items.map((item) => {
        return (
          <li key={item.label} className="flex flex-col items-center gap-2 text-center">
            <span className="mono-label !text-ink">{item.value}%</span>
            <div
              data-meter
              role="meter"
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={item.label}
              className="relative h-40 w-8 rounded-[4px] bg-ink shadow-[inset_0_2px_6px_rgb(0_0_0/0.6)] md:h-48"
            >
              <span className="vu-track" />
              <span data-lit className="vu-lit" style={{ clipPath: litClip(item.value) }} />
              <span data-peak className="pointer-events-none absolute inset-x-[3px] h-[2px] bg-paper-2" style={{ bottom: peakAt(item.value) }} />
            </div>
            <span className="text-[13px] font-semibold leading-tight text-ink">{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

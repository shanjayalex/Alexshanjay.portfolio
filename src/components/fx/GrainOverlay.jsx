import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { fx } from "../../lib/fx";

const TILE = 180;

// Live film grain: one noise tile drawn once, then jittered at 12 fps on the
// shared GSAP ticker (no extra rAF loop). Opacity is driven by VelocityFX.
// Pauses while the showreel plays; the ticker itself sleeps in hidden tabs.
export default function GrainOverlay() {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = TILE;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(TILE, TILE);
    for (let i = 0; i < img.data.length; i += 4) {
      const g = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = g;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    el.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
    el.hidden = false;

    let last = 0;
    const tick = (time) => {
      if (fx.playing || time - last < 1 / 12) return;
      last = time;
      el.style.transform = `translate3d(${Math.round(Math.random() * TILE)}px, ${Math.round(Math.random() * TILE)}px, 0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div
      ref={ref}
      data-grain-live
      hidden
      aria-hidden="true"
      className="pointer-events-none fixed -inset-[180px] z-[91] opacity-[0.04] mix-blend-multiply [html.is-playing_&]:hidden"
    />
  );
}

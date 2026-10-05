import { useRef } from "react";
import { toolAbbr } from "../../data/content";
import { useGsap } from "../../hooks/useGsap";
import { gsap, FINE_POINTER, MOTION } from "../../lib/gsap";
import Marquee from "../ui/Marquee";

// Effects panel: tool tiles on the velocity marquee. With a mouse, hovering
// the row pauses it and the tiles near the pointer swell and lean toward it
// (dock magnification); the hovered tool's name types out in mono.
export default function ToolDock({ tools }) {
  const ref = useRef(null);

  useGsap(ref, (mm, el) => {
    mm.add(`${MOTION} and ${FINE_POINTER}`, () => {
      const tiles = () => el.querySelectorAll("[data-tile]");
      function onMove(e) {
        tiles().forEach((tile) => {
          const r = tile.getBoundingClientRect();
          const d = e.clientX - (r.left + r.width / 2);
          const near = Math.max(0, 1 - Math.abs(d) / 140);
          gsap.to(tile, { scale: 1 + near * 0.45, x: Math.sign(d) * near * 8, y: -near * 10, duration: 0.25, ease: "power3", overwrite: true });
        });
      }
      function onLeave() {
        gsap.to(tiles(), { scale: 1, x: 0, y: 0, duration: 0.4, ease: "power3", overwrite: true });
      }
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });
  });

  return (
    <div ref={ref}>
      <Marquee
        items={tools}
        repeat={2}
        pauseOnHover
        className="py-6 md:py-9"
        itemClassName="py-2"
        separator={null}
        renderItem={(name) => (
          <span data-tile className="tool-tile">
            <span aria-hidden="true" className="tool-abbr">{toolAbbr[name] ?? name.slice(0, 2)}</span>
            <span className="tool-name" style={{ "--n": name.length }}>
              {name}
            </span>
          </span>
        )}
      />
    </div>
  );
}

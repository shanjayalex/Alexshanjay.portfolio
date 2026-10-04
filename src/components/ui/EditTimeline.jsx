import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "../../lib/gsap";
import { useLightbox } from "../../lib/lightbox";
import { scrollToTarget } from "../../lib/scroll";

// V1 clips, in page order. Each clip runs until the next one starts, so
// sections in between (Services, FAQ) belong to the clip before them.
const CLIPS = [
  { id: "reel", label: "Showreel" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "design", label: "Design" },
  { id: "studio", label: "Studio" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];
const FPS = 24;
const TOTAL_FRAMES = 2 * 60 * FPS; // the whole page plays as a 00:02:00:00 edit
const BARS = 140;
const pad = (n) => String(n).padStart(2, "0");

function timecode(progress) {
  const f = Math.round(progress * TOTAL_FRAMES);
  const s = Math.floor(f / FPS);
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(f % FPS)}`;
}

// Fake audio waveform (one path of bars) from a seeded random so SSR and client agree.
const WAVE = (() => {
  let seed = 26;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: BARS }, (_, i) => {
    const h = (0.2 + 0.8 * Math.abs(Math.sin(i * 0.37)) * (0.45 + 0.55 * rand())) * 18;
    return `M${i + 0.2} ${(10 - h / 2).toFixed(1)}h.6v${h.toFixed(1)}h-.6z`;
  }).join("");
})();

function Wave({ className }) {
  return (
    <svg viewBox={`0 0 ${BARS} 20`} preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <path d={WAVE} />
    </svg>
  );
}

// Scroll progress as an NLE timeline, fixed to the bottom (desktop only).
// Playhead, timecode and waveform fill are written straight to the DOM on
// scroll; React only re-renders when the active clip or layout changes.
export default function EditTimeline() {
  const { isOpen } = useLightbox();
  const ref = useRef(null);
  const [layout, setLayout] = useState({ lead: 6, widths: CLIPS.map(() => 94 / CLIPS.length) });
  const [active, setActive] = useState(-1);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const playhead = el.querySelector("[data-playhead]");
    const tc = el.querySelector("[data-tc]");
    const fill = el.querySelector("[data-wave-fill]");
    let starts = [];

    function measure() {
      const max = ScrollTrigger.maxScroll(window) || 1;
      const top = (id) => document.getElementById(id)?.getBoundingClientRect().top + window.scrollY;
      starts = CLIPS.map((c) => Math.min(top(c.id) ?? 0, max));
      const edges = [...starts, max].map((y) => (y / max) * 100);
      setLayout({ lead: edges[0], widths: CLIPS.map((_, i) => Math.max(0, edges[i + 1] - edges[i])) });
    }

    function update(scrollY) {
      const max = ScrollTrigger.maxScroll(window) || 1;
      const p = Math.min(1, Math.max(0, scrollY / max));
      playhead.style.left = `${p * 100}%`;
      fill.style.clipPath = `inset(0 ${100 - p * 100}% 0 0)`;
      tc.textContent = timecode(p);
      tc.style.transform = `translateX(${-p * 100}%)`; // label stays on screen at both ends
      const probe = scrollY + window.innerHeight * 0.4;
      let idx = -1;
      starts.forEach((y, i) => {
        if (probe >= y) idx = i;
      });
      setActive(idx);
    }

    measure();
    update(window.scrollY);
    const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => update(self.scroll()) });
    const onRefresh = () => {
      measure();
      update(window.scrollY);
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    if (footer) observer.observe(footer);

    return () => {
      trigger.kill();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      observer.disconnect();
    };
  }, []);

  const hidden = isOpen || footerVisible;

  return (
    <nav
      ref={ref}
      aria-label="Page timeline"
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
      className={`fixed inset-x-0 bottom-0 z-[70] hidden h-11 border-t border-ink/15 bg-paper-2/95 backdrop-blur-sm transition-[transform,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] lg:flex ${
        hidden ? "translate-y-full opacity-0" : ""
      }`}
    >
      <div className="flex w-10 shrink-0 flex-col border-r border-ink/15 font-mono text-[9px] font-bold tracking-[0.12em] text-ink-2" aria-hidden="true">
        <span className="grid flex-1 place-items-center border-b border-ink/10">V1</span>
        <span className="grid flex-1 place-items-center">A1</span>
      </div>

      <div className="relative flex-1">
        {/* V1 — one clip per section */}
        <ol className="absolute inset-x-0 top-0 flex h-1/2 py-[3px]" style={{ paddingLeft: `${layout.lead}%` }}>
          {CLIPS.map((clip, i) => (
            <li key={clip.id} className="min-w-0 px-px" style={{ width: `${layout.widths[i]}%` }}>
              <button
                type="button"
                onClick={() => scrollToTarget(`#${clip.id}`)}
                title={clip.label}
                aria-label={`Jump to ${clip.label}`}
                aria-current={i === active ? "location" : undefined}
                className={`group flex h-full w-full items-center overflow-hidden rounded-[3px] px-1.5 text-left font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  i === active ? "bg-orange text-ink" : "bg-tray/45 text-ink-2 hover:bg-tray/70 hover:text-ink"
                }`}
              >
                <span className="truncate">{clip.label}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* A1 — waveform, brighter behind the playhead */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 py-[3px]" aria-hidden="true">
          <div className="relative h-full">
            <Wave className="fill-ink/20" />
            <div data-wave-fill className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
              <Wave className="fill-orange-deep" />
            </div>
          </div>
        </div>

        <div data-playhead className="pointer-events-none absolute inset-y-0 left-0 w-px bg-orange-deep" aria-hidden="true">
          <span className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-orange-deep" />
          <span data-tc className="absolute bottom-[calc(100%+8px)] left-0 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-paper-2">
            {timecode(0)}
          </span>
        </div>
      </div>
    </nav>
  );
}

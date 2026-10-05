import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

const RENDER_MS = 600;

// A link that "exports" before it goes: hover shows `EXPORT ▶ H.264 · 1080p`,
// a click fills a render bar (RENDERING… → EXPORTED ✓) for 600ms, then opens
// the link. New-tab links open a blank tab synchronously (keeping the click's
// user activation so pop-up blockers allow it) and point it at the URL after
// the render. Reduced motion skips the delay.
export default function ExportButton({ href, className = "", children, ...props }) {
  const bar = useRef(null);
  const [status, setStatus] = useState(null);
  const external = href.startsWith("http");

  function onClick(e) {
    if (prefersReducedMotion() || e.metaKey || e.ctrlKey || e.shiftKey || status) return;
    e.preventDefault();
    const win = external ? window.open("", "_blank") : null;
    if (win) win.opener = null;
    setStatus("rendering");
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: RENDER_MS / 1000,
        ease: "steps(12)",
        onComplete: () => {
          setStatus("done");
          setTimeout(() => {
            if (win) win.location.href = href;
            else if (external) window.open(href, "_blank", "noopener");
            else window.location.href = href;
            setStatus(null);
            gsap.set(bar.current, { scaleX: 0 });
          }, 180);
        },
      },
    );
  }

  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} onClick={onClick} className={`group/export ${className}`} {...props}>
      <span ref={bar} className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ink/85" aria-hidden="true" />
      {children}
      <span
        className="pointer-events-none absolute right-24 top-3 rounded-sm bg-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-orange opacity-0 transition-opacity duration-200 group-hover/export:opacity-100 md:right-28"
        aria-hidden="true"
      >
        {status === "rendering" ? "Rendering…" : status === "done" ? "Exported ✓" : "Export ▶ H.264 · 1080p"}
      </span>
    </a>
  );
}

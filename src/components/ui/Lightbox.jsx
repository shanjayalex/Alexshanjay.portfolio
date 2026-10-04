import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiX } from "react-icons/fi";
import { LightboxContext } from "../../lib/lightbox";
import { lockScroll, unlockScroll } from "../../lib/scroll";
import { embed, watchUrl } from "../../lib/youtube";
import PosterPlaceholder from "./PosterPlaceholder";

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

function Media({ item, kind, index }) {
  if (kind === "image") {
    return (
      <div className="aspect-square w-[min(86vw,72vh)] overflow-hidden rounded-[20px] bg-paper-2">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <PosterPlaceholder item={item} index={index} large />
        )}
      </div>
    );
  }
  const vertical = kind === "short";
  return (
    <div
      className={`overflow-hidden rounded-[20px] bg-black shadow-2xl ${
        vertical ? "aspect-[9/16] h-[min(76vh,calc(86vw*16/9))]" : "aspect-video w-[min(90vw,calc(70vh*16/9))]"
      }`}
    >
      <iframe
        key={item.id}
        className="h-full w-full"
        src={embed(item.id)}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export default function LightboxProvider({ children }) {
  const [state, setState] = useState(null);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);
  const returnFocus = useRef(null);

  const open = useCallback(({ kind, items, index = 0 }) => {
    returnFocus.current = document.activeElement;
    setState({ kind, items, index });
  }, []);

  const close = useCallback(() => setState(null), []);

  const step = useCallback((dir) => {
    setState((s) => s && { ...s, index: (s.index + dir + s.items.length) % s.items.length });
  }, []);

  const isOpen = Boolean(state);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return undefined;
    lockScroll();
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector("[data-close]")?.focus());

    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, close, step]);

  const value = useMemo(() => ({ open, isOpen }), [open, isOpen]);
  const item = state?.items[state.index];
  const multiple = (state?.items.length ?? 0) > 1;

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
        <AnimatePresence>
          {state && (
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={item.title}
              className="on-ink fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-ink/95 px-4 py-6 text-paper-2 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.target === e.currentTarget && close()}
            >
              <button
                type="button"
                data-close
                onClick={close}
                className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-paper-2/30 transition-colors hover:bg-paper-2 hover:text-ink md:right-8 md:top-8"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>

              <motion.div
                key={`${state.kind}-${state.index}`}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Media item={item} kind={state.kind} index={state.index} />
              </motion.div>

              <div className="flex w-full max-w-4xl flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="mono-label">
                    {state.kind === "image" ? "Design" : state.kind === "short" ? "Short" : "Episode"} #{" "}
                    {String(state.index + 1).padStart(2, "0")} · {item.category}
                    {item.year ? ` · ${item.year}` : ""}
                  </p>
                  <p className="card-title mt-1 truncate text-xl text-paper-2 md:text-2xl">{item.title}</p>
                  {item.caption && <p className="serif-italic mt-1 text-lg text-paper-2/70">{item.caption}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {state.kind !== "image" && (
                    <a className="pill pill-outline pill-sm" href={watchUrl(item.id, state.kind === "short")} target="_blank" rel="noreferrer">
                      YouTube <FiArrowUpRight />
                    </a>
                  )}
                  {item.href && (
                    <a className="pill pill-outline pill-sm" href={item.href} target="_blank" rel="noreferrer">
                      View on Instagram <FiArrowUpRight />
                    </a>
                  )}
                  {multiple && (
                    <>
                      <button type="button" onClick={() => step(-1)} className="pill pill-outline pill-sm" aria-label="Previous">
                        <FiArrowLeft /> Prev
                      </button>
                      <button type="button" onClick={() => step(1)} className="pill pill-orange pill-sm" aria-label="Next">
                        Next <FiArrowRight />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </LightboxContext.Provider>
  );
}

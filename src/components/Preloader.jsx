import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/content";
import { PRELOAD_SECONDS } from "../lib/timing";

export default function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const timer = setTimeout(() => setDone(true), PRELOAD_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[998] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="font-display block text-4xl tracking-tight text-cream md:text-6xl"
            >
              {profile.name.toUpperCase()}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

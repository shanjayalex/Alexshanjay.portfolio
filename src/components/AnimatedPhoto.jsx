import { useState } from "react";
import { motion } from "framer-motion";
import { useTilt } from "../hooks/useTilt";
import { profile } from "../data/content";

export default function AnimatedPhoto() {
  const [errored, setErrored] = useState(false);
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(16);

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="relative mx-auto w-64 sm:w-72 md:w-80" style={{ perspective: 1200 }}>
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: 24, y: 24 }}
        animate={{ opacity: 1, x: 18, y: 18 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="absolute inset-0 rounded-[2rem] bg-yellow"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: -18, y: -18 }}
        animate={{ opacity: 1, x: -10, y: -10 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
        className="absolute inset-0 rounded-[2rem] border-4 border-lime"
      />

      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-[405/757] w-full overflow-hidden rounded-[2rem] bg-navy-light shadow-2xl ring-4 ring-ink/40"
      >
        {!errored ? (
          <img
            src="/images/photo.png"
            alt={profile.name}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cobalt via-navy-light to-navy">
            <span className="font-display text-6xl text-cream/40">{initials}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
        className="animate-twinkle absolute -right-4 -top-4 text-4xl text-yellow"
      >
        ✦
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.75, duration: 0.5, type: "spring" }}
        className="animate-float-slower absolute -bottom-6 -left-6 h-10 w-10 rounded-lg bg-cyan"
      />
    </div>
  );
}

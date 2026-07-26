import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import SelectionFrame from "./SelectionFrame";
import Marquee from "./Marquee";
import MagneticButton from "./MagneticButton";
import { profile, software } from "../data/content";
import { PRELOAD_SECONDS } from "../lib/timing";

const d = (n) => PRELOAD_SECONDS + n;

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="noise relative overflow-hidden bg-transparent pb-0 pt-32 text-center text-cream md:pt-40"
    >
      {/* atmospheric glow */}
      <div className="pointer-events-none absolute left-1/2 top-[36%] -z-0 h-[60vw] w-[60vw] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt/25 blur-[120px]" />

      {/* decorative geometric confetti — two parallax layers */}
      <motion.div style={{ y: yFast }} className="pointer-events-none absolute inset-0 -z-0">
        <span className="animate-float-slow absolute left-[6%] top-[30%] h-8 w-8 rotate-12 bg-lime sm:top-[22%]" />
        <span className="animate-float-slower absolute right-[8%] top-[18%] h-10 w-10 rounded-lg bg-navy-light" />
        <span className="animate-twinkle absolute right-[22%] top-[10%] text-3xl text-yellow">
          ✦
        </span>
      </motion.div>
      <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0 -z-0">
        <span className="animate-float-slower absolute left-[10%] top-[68%] hidden h-6 w-6 rounded-full bg-yellow sm:block" />
        <span className="animate-float-slower absolute right-[14%] top-[62%] hidden h-7 w-7 rotate-45 bg-cyan/80 sm:block" />
        <span className="animate-twinkle absolute left-[42%] top-[6%] text-2xl text-lime">
          ✦
        </span>
        <span className="animate-twinkle absolute left-[18%] top-[42%] hidden text-2xl text-cream/50 sm:block">
          ✦
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: PRELOAD_SECONDS }}
          className="mx-auto mb-8 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-cream/15 bg-cream/5 px-5 py-2 font-mono text-xs uppercase tracking-widest backdrop-blur-sm md:text-sm"
        >
          {profile.roles.map((role, i) => (
            <span key={role} className="flex items-center gap-2">
              {i > 0 && <span className="text-cyan">•</span>}
              {role}
            </span>
          ))}
        </motion.div>

        <div className="relative mx-auto max-w-4xl px-4 pb-6 pt-2 sm:px-10">
          <SelectionFrame label="HERO.WORDMARK" className="inset-0" />

          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: PRELOAD_SECONDS }}
              className="font-display relative leading-[0.82] text-[19vw] sm:text-[15vw] md:text-[9vw]"
            >
              <span className="block">PORT</span>
              <span className="text-stroke -mt-2 block font-serif text-[19vw] font-normal italic normal-case tracking-normal sm:text-[15vw] md:text-[9vw]">
                folio
              </span>
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: d(0.3) }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-sm text-cream/80"
        >
          <span className="text-base font-bold tracking-wide text-cream">
            {profile.name.toUpperCase()}
          </span>
          <span className="text-cyan">/</span>
          <span className="rounded-full border border-cream/25 px-3 py-1">
            {profile.years}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: d(0.4) }}
          className="mx-auto mt-6 max-w-xl font-sans text-base text-cream/80 md:text-lg"
        >
          {profile.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: d(0.5) }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-yellow px-6 py-3 font-grotesk font-semibold text-ink"
          >
            View my work
            <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-6 py-3 font-grotesk font-semibold text-cream transition-colors hover:border-cream"
          >
            Let's talk
          </MagneticButton>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d(0.7) }}
        className="relative z-10 mx-auto mt-16 flex w-fit flex-col items-center gap-2 pb-8 font-mono text-xs uppercase tracking-widest text-cream/60"
      >
        Scroll
        <FiArrowDown className="animate-float-slow" />
      </motion.a>

      <div className="relative z-10 flex bg-navy py-4 text-cream">
        <Marquee items={software} />
      </div>
    </section>
  );
}

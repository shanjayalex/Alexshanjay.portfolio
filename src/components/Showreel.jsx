import { motion } from "framer-motion";
import { showreel } from "../data/content";
import YouTubeFacade from "./YouTubeFacade";
import SectionTag from "./SectionTag";

export default function Showreel() {
  return (
    <section id="showreel" className="relative overflow-hidden bg-cobalt/85 py-24 text-cream backdrop-blur-xl md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <span className="animate-float-slow absolute left-[8%] top-[10%] h-10 w-10 rotate-12 rounded-lg bg-yellow/80" />
        <span className="animate-twinkle absolute right-[10%] top-[20%] text-3xl text-lime">
          ✦
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <SectionTag index="03" label="Showreel" />

        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl leading-[0.9] md:text-6xl">
            Watch the <span className="text-stroke">showreel</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-cream/70">
            A quick cut of edits, motion graphics, and grades from the last
            year of work.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border-4 border-navy shadow-2xl"
        >
          <YouTubeFacade id={showreel.youtubeId} title={showreel.title} big />
        </motion.div>
      </div>
    </section>
  );
}

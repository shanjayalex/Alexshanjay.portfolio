import { motion } from "framer-motion";
import { experience } from "../data/content";
import SectionTag from "./SectionTag";

export default function Experience() {
  return (
    <section id="experience" className="relative bg-cream/95 py-24 text-ink backdrop-blur-2xl md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionTag index="05" label="Experience" dark />

        <h2 className="mb-14 font-display text-4xl leading-[0.95] md:text-6xl">
          Where I've been <span className="text-cobalt">creating</span>.
        </h2>

        <div className="space-y-6">
          {experience.map((job, i) => (
            <motion.div
              key={job.org}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid grid-cols-1 gap-6 rounded-3xl bg-ink p-8 text-cream md:grid-cols-[1fr_2fr] md:p-10"
            >
              <div>
                <div className="font-grotesk text-sm font-semibold uppercase tracking-wide text-yellow">
                  {job.year}
                </div>
                <h3 className="mt-2 font-display text-2xl normal-case tracking-normal">
                  {job.role}
                </h3>
                <p className="mt-1 font-sans text-sm text-cream/60">{job.org}</p>
              </div>
              <ul className="space-y-3 border-t border-cream/10 pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-3 font-sans text-sm leading-relaxed text-cream/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

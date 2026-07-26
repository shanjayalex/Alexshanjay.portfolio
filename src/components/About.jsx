import { motion } from "framer-motion";
import { profile, education, skills } from "../data/content";
import SectionTag from "./SectionTag";
import AnimatedPhoto from "./AnimatedPhoto";
import Counter from "./Counter";

const stats = [
  { value: 3, suffix: "+", label: "Years experience" },
  { value: 20, suffix: "+", label: "Projects delivered" },
  { value: 8, suffix: "+", label: "Happy clients" },
];

export default function About() {
  return (
    <section id="about" className="relative bg-cream/95 py-24 text-ink backdrop-blur-2xl md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionTag index="01" label="About" dark />

        <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <AnimatedPhoto />
            <div className="mx-auto mt-6 flex w-64 items-center justify-between font-mono text-xs uppercase tracking-widest text-ink/50 sm:w-72 md:w-80">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime" />
                Available for work
              </span>
              <span>{profile.location.split(",")[0]}</span>
            </div>
          </div>

          <div>
            <h2 className="font-display text-4xl leading-[0.95] md:text-6xl">
              Software-engineer
              <br />
              brain. <span className="font-serif italic normal-case tracking-normal text-cobalt">
                Editor's eye.
              </span>
            </h2>
            <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-ink/70 md:text-lg">
              {profile.bio}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="font-display text-3xl text-cobalt md:text-4xl"
                  />
                  <div className="font-mono text-[11px] uppercase tracking-wide text-ink/60">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-2">
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink/50">
              // Skills
            </h3>
            <div className="mt-6 space-y-5">
              {skills.map((skill, i) => (
                <div key={skill.label}>
                  <div className="mb-1.5 flex justify-between font-grotesk text-sm font-semibold">
                    <span>{skill.label}</span>
                    <span className="font-mono text-cobalt">{skill.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-cobalt to-cyan"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink/50">
              // Education
            </h3>
            <div className="mt-6 space-y-6 border-l-2 border-ink/10 pl-6">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.program}
                  initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full bg-cobalt ring-4 ring-cream" />
                  <div className="font-mono text-xs font-semibold uppercase tracking-wide text-cobalt">
                    {edu.year}
                  </div>
                  <div className="mt-1 font-display text-lg normal-case tracking-normal">
                    {edu.program}
                  </div>
                  <div className="font-sans text-sm text-ink/60">{edu.school}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl bg-ink p-8 text-cream">
              <p className="font-serif text-2xl italic leading-snug tracking-normal md:text-3xl">
                "Raw ideas into polished, story-driven visuals that captivate
                audiences and elevate brands."
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-wide text-cream/60">
                — {profile.name}, {profile.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { FiVideo, FiPenTool, FiBox, FiCheck } from "react-icons/fi";
import { services } from "../data/content";
import { colorMap } from "../data/theme";
import SectionTag from "./SectionTag";

const iconMap = {
  video: FiVideo,
  design: FiPenTool,
  cube: FiBox,
};

export default function Services() {
  return (
    <section id="services" className="relative bg-navy/95 py-24 text-cream backdrop-blur-2xl md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionTag index="02" label="Services" />

        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl leading-[0.95] md:text-6xl">
            What I <span className="font-serif italic normal-case tracking-normal text-yellow">bring</span>
            <br />
            to the edit.
          </h2>
          <p className="max-w-sm font-sans text-cream/60">
            From first cut to final render — end-to-end video, design, and 3D
            work for brands, creators, and campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {services.map((service, i) => {
            const c = colorMap[service.color];
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-navy-light p-8 transition-transform hover:-translate-y-1"
              >
                <span className={`absolute left-0 top-0 h-1.5 w-full ${c.bg}`} />

                <span
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink ${c.text}`}
                >
                  <Icon size={22} />
                </span>

                <h3 className="font-display text-xl normal-case tracking-normal">
                  {service.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-cream/60">
                  {service.desc}
                </p>

                <ul className="mt-6 space-y-2 border-t border-cream/10 pt-6">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 font-mono text-xs text-cream/70"
                    >
                      <FiCheck className={`mt-0.5 shrink-0 ${c.text}`} size={14} />
                      {item}
                    </li>
                  ))}
                </ul>

                <span
                  className={`pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 ${c.bg}`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

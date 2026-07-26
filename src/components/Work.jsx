import { motion } from "framer-motion";
import { work } from "../data/content";
import YouTubeFacade from "./YouTubeFacade";
import SectionTag from "./SectionTag";

export default function Work() {
  const featured = work.find((w) => w.featured);
  const withoutFeatured = work.filter((w) => !w.featured);
  const second = withoutFeatured[0];
  const rest = withoutFeatured.slice(1);
  const featureBlocks = [featured, second].filter(Boolean);

  return (
    <section id="work" className="relative bg-ink/95 py-24 text-cream backdrop-blur-2xl md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionTag index="04" label="Selected work" />

        <h2 className="mb-14 font-display text-4xl leading-[0.95] md:text-6xl">
          Recent <span className="text-lime">projects</span>
          <br />& social reels.
        </h2>
      </div>

      {/* alternating full-bleed feature blocks */}
      <div className="space-y-3">
        {featureBlocks.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="group relative w-full overflow-hidden"
          >
            <YouTubeFacade id={item.id} title={item.title} big />
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-6 md:p-10 ${
                idx % 2 === 1 ? "flex-row-reverse text-right" : ""
              }`}
            >
              <h3 className="font-display text-2xl normal-case leading-tight tracking-normal md:text-4xl">
                {item.title}
              </h3>
              <span className="pointer-events-auto shrink-0 rounded-full bg-yellow px-4 py-1.5 font-mono text-xs font-semibold text-ink">
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group overflow-hidden rounded-2xl bg-navy-light transition-transform duration-300 hover:-translate-y-1 hover:rotate-1"
            >
              <YouTubeFacade id={item.id} title={item.title} />
              <div className="flex items-center justify-between gap-3 p-5">
                <h3 className="font-grotesk text-sm font-semibold">
                  {item.title}
                </h3>
                <span className="shrink-0 rounded-full bg-cream/10 px-3 py-1 font-mono text-[11px] font-semibold text-cyan">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { designFilters, designs, sections } from "../../data/content";
import { useStaggerIn } from "../../hooks/useStaggerIn";
import { ScrollTrigger } from "../../lib/gsap";
import { useLightbox } from "../../lib/lightbox";
import DesignCard from "../ui/DesignCard";
import SectionHeader from "../ui/SectionHeader";

const PER_TRAY = 3;
const ease = [0.16, 1, 0.3, 1];

export default function Design() {
  const ref = useRef(null);
  const [filter, setFilter] = useState("All");
  const { open } = useLightbox();
  useStaggerIn(ref);

  const visible = useMemo(() => (filter === "All" ? designs : designs.filter((d) => d.category === filter)), [filter]);
  const trays = useMemo(() => {
    const rows = [];
    for (let i = 0; i < visible.length; i += PER_TRAY) rows.push(visible.slice(i, i + PER_TRAY));
    return rows;
  }, [visible]);

  return (
    <section ref={ref} id="design" className="relative px-[var(--gutter)] py-24 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader {...sections.design} />

        <LayoutGroup>
          <div className="mt-10 flex flex-wrap gap-2 md:mt-14" role="group" aria-label="Filter designs">
            {designFilters.map((name) => {
              const active = filter === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFilter(name)}
                  aria-pressed={active}
                  className={`relative rounded-full border px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors md:text-xs ${
                    active ? "border-ink text-paper-2" : "border-ink/20 text-ink hover:border-ink"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />
                  )}
                  <span className="relative">{name}</span>
                </button>
              );
            })}
          </div>

          <motion.div layout className="mt-8 flex flex-col gap-8 md:gap-10" transition={{ duration: 0.6, ease }}>
            <AnimatePresence mode="popLayout" onExitComplete={() => ScrollTrigger.refresh()}>
              {trays.map((row, t) => (
                <motion.div
                  key={`tray-${t}`}
                  layout
                  className="tray p-3 sm:p-4 md:p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, ease }}
                >
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6">
                    <AnimatePresence mode="popLayout">
                      {row.map((design) => {
                        const index = designs.indexOf(design);
                        return (
                          <motion.div
                            key={design.id}
                            layoutId={design.id}
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.5, ease }}
                          >
                            <DesignCard
                              design={design}
                              index={index}
                              onOpen={() => open({ kind: "image", items: visible, index: visible.indexOf(design) })}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <p className="serif-italic mt-8 text-center text-xl text-ink-2">Social posts, restaurant promos, brand systems &amp; posters.</p>
      </div>
    </section>
  );
}

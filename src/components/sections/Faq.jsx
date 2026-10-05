import { FiPlus } from "react-icons/fi";
import { faq, sections } from "../../data/content";
import SectionHeader from "../ui/SectionHeader";

// Native <details> keeps every answer in the HTML (readable by crawlers) while
// staying collapsible for visitors. Mirrors the FAQPage JSON-LD.
export default function Faq() {
  return (
    <section id="faq" className="relative px-[var(--gutter)] py-24 md:py-32" aria-labelledby="faq-h">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader {...sections.faq} id="faq-h" />

        <div className="mt-14 border-t border-ink/20 md:mt-20">
          {faq.map((item, i) => (
            <details key={item.q} className="group border-b border-ink/20" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-4 py-6 md:gap-8 md:py-8 [&::-webkit-details-marker]:hidden">
                <span className="mono-label w-8 shrink-0" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="card-title flex-1 text-[clamp(1.25rem,2.6vw,2.4rem)]">{item.q}</h3>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-open:rotate-45 group-open:bg-ink group-open:text-paper-2 md:h-14 md:w-14">
                  <FiPlus className="h-5 w-5" />
                </span>
              </summary>
              <p className="max-w-3xl pb-8 pl-12 text-lg md:pl-[4.5rem]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

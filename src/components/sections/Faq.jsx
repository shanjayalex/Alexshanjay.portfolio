import { useRef } from "react";
import { faq, sections } from "../../data/content";
import { gsap, SplitText, prefersReducedMotion } from "../../lib/gsap";
import { BASE, EASE, f, SNAP } from "../../lib/motion";
import EditTransition from "../fx/EditTransition";
import SectionHeader from "../ui/SectionHeader";

// Native <details> keeps every answer in the HTML (readable by crawlers) while
// staying collapsible for visitors. Mirrors the FAQPage JSON-LD.
// Styled like After Effects layer properties: a ▶ twirl-down, the answer opens
// with its height animated and a keyframe diamond staggers in on each line.
// Only one answer is open at a time.
export default function Faq() {
  const ref = useRef(null);

  function animateOpen(details) {
    const body = details.querySelector("[data-answer]");
    if (prefersReducedMotion()) return;
    if (!body.dataset.split) {
      body.dataset.split = "1";
      SplitText.create(body.querySelector("p"), { type: "lines", tag: "span", linesClass: "kf-line", aria: "none" });
    }
    gsap.fromTo(body, { height: 0 }, { height: "auto", duration: BASE, ease: EASE.keyframe, clearProps: "height" });
    gsap.fromTo(body.querySelectorAll(".kf-line"), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: f(8), ease: EASE.keyframe, stagger: f(2), delay: f(3) });
  }

  function close(details) {
    const body = details.querySelector("[data-answer]");
    if (prefersReducedMotion()) {
      details.open = false;
      return;
    }
    gsap.to(body, { height: 0, duration: SNAP * 1.5, ease: EASE.keyframe, onComplete: () => ((details.open = false), gsap.set(body, { clearProps: "height" })) });
  }

  function onSummaryClick(e) {
    e.preventDefault();
    const details = e.currentTarget.parentElement;
    if (details.open) return close(details);
    ref.current.querySelectorAll("details[open]").forEach(close);
    details.open = true;
    animateOpen(details);
  }

  return (
    <section ref={ref} id="faq" className="relative px-[var(--gutter)] py-24 md:py-32" aria-labelledby="faq-h">
      <EditTransition type="dip" />
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader {...sections.faq} id="faq-h" />

        <div className="mt-14 border-t border-ink/20 md:mt-20">
          {faq.map((item, i) => (
            <details key={item.q} className="group border-b border-ink/20" open={i === 0}>
              <summary onClick={onSummaryClick} className="flex cursor-pointer list-none items-center gap-4 py-6 md:gap-8 md:py-8 [&::-webkit-details-marker]:hidden">
                <span className="grid h-8 w-8 shrink-0 place-items-center text-ink" aria-hidden="true">
                  <span className="block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-current transition-transform duration-[250ms] ease-[cubic-bezier(.16,1,.3,1)] group-open:rotate-90" />
                </span>
                <span className="mono-label w-8 shrink-0" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="card-title flex-1 text-[clamp(1.25rem,2.6vw,2.4rem)]">{item.q}</h3>
              </summary>
              <div data-answer className="overflow-hidden">
                <p className="max-w-3xl pb-8 pl-8 text-lg md:pl-[8.5rem]">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

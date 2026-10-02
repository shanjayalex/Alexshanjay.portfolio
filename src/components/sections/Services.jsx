import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { rates, sections, services, studio } from "../../data/content";
import { useStaggerIn } from "../../hooks/useStaggerIn";
import SectionHeader from "../ui/SectionHeader";
import Tray from "../ui/Tray";

export default function Services() {
  const ref = useRef(null);
  useStaggerIn(ref);

  return (
    <section ref={ref} id="services" className="relative px-[var(--gutter)] py-24 md:py-32" aria-labelledby="services-h">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader {...sections.services} id="services-h" />

        <Tray className="mt-10 md:mt-14">
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {services.map((service, i) => (
              <li key={service.title} data-card className="paper-card flex min-h-[220px] flex-col justify-between p-6 md:p-8">
                <span className="mono-label">
                  Service # <b className="font-bold text-ink">{String(i + 1).padStart(2, "0")}</b>
                </span>
                <div>
                  <h3 className="card-title text-[clamp(1.5rem,2.4vw,2.2rem)]">{service.title}</h3>
                  <p className="mt-2">{service.text}</p>
                </div>
              </li>
            ))}

            <li data-card className="paper-card flex min-h-[220px] flex-col justify-between !border-orange-deep/30 !bg-orange p-6 text-ink md:p-8">
              <span className="mono-label text-ink">
                <b className="font-bold">Rates</b> · LKR
              </span>
              <div>
                <p className="card-title text-[clamp(1.4rem,2.2vw,2rem)]">
                  Reel editing from <span className="whitespace-nowrap">{rates.reelFrom}.</span>
                </p>
                <p className="mt-2 font-semibold">
                  Shoot + edit content packages from {rates.packagesFrom} ({rates.packagesNote}).
                </p>
                <a
                  href={studio.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 font-bold underline decoration-2 underline-offset-4"
                >
                  All {studio.name} packages <FiArrowUpRight />
                </a>
              </div>
            </li>
          </ul>
        </Tray>
      </div>
    </section>
  );
}

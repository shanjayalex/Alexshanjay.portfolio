import { clients, profile } from "../../data/content";
import Marquee from "./Marquee";

const star = (
  <span className="text-[0.8em] text-orange" aria-hidden="true">
    ✦
  </span>
);

// "Trusted by" band under the hero.
export default function CreditsBand() {
  return (
    <section aria-label="Clients" className="relative mb-[clamp(30px,4vw,60px)] flex items-stretch border-y border-ink/20">
      <p className="mono-label z-[1] flex shrink-0 items-center border-r border-ink/20 bg-paper px-[var(--gutter)]">
        <b className="font-bold">Credits</b>
      </p>
      <Marquee
        items={clients}
        repeat={2}
        label="Clients"
        className="min-w-0 flex-1 !border-0"
        itemClassName="card-title text-[clamp(1.25rem,2.4vw,2rem)]"
        separator={star}
        renderItem={(name) => (
          <span className="flex items-center gap-3">
            {name}
            {name === profile.now.org && <span className="chip is-orange !text-[10px]">Now</span>}
          </span>
        )}
      />
    </section>
  );
}

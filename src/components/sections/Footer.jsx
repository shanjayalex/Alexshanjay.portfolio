import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { navLinks, profile, studio } from "../../data/content";
import Logo from "../ui/Logo";
import TornEdge from "../ui/TornEdge";

function useClock(timeZone) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return "--:--:--";
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
}

export default function Footer() {
  const time = useClock(profile.timezone);

  return (
    <footer className="on-ink relative overflow-hidden bg-ink px-[var(--gutter)] pt-16 text-paper-2 md:pt-24">
      <TornEdge color="var(--ink)" side="top" seed={13} />

      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-3">
        <div>
          <a href={studio.url} target="_blank" rel="noreferrer" className="mb-8 inline-block text-paper-2 transition-colors hover:text-orange" aria-label={`${studio.name} — studio site`}>
            <Logo title={null} className="h-20 w-auto md:h-24" />
          </a>
          <p className="mono-label">Local time — Sri Lanka</p>
          <p className="mt-2 font-mono text-3xl font-medium tabular-nums text-paper-2 md:text-4xl" aria-live="off">
            {time} <span className="text-base text-paper-2/60">GMT+5:30</span>
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-block py-1 text-paper-2/80 transition-colors hover:text-orange">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <a href="#top" className="pill pill-outline pill-sm">
            Back to top <FiArrowUp />
          </a>
          <p className="mono-label">© 2026 {profile.name}</p>
        </div>
      </div>

      <p
        className="display pointer-events-none mt-12 select-none whitespace-nowrap text-center text-paper-2 [font-size:clamp(3rem,12vw,20rem)] [margin-bottom:-0.17em] md:mt-20"
        aria-hidden="true"
      >
        {studio.name}
      </p>
    </footer>
  );
}

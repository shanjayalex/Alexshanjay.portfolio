import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, profile } from "../../data/content";
import { lockScroll, unlockScroll } from "../../lib/scroll";
import Logo from "../ui/Logo";
import MagneticButton from "../ui/MagneticButton";
import NowChip from "../ui/NowChip";

function Monogram({ base }) {
  return (
    <a href={base || "#top"} className="flex items-center gap-2.5" aria-label="Alex Shanjay — back to top">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper-2">
        <Logo variant="mark" title={null} className="h-[21px] w-auto translate-y-[-0.5px]" />
      </span>
      <span className="mono-label hidden text-ink sm:inline lg:hidden 2xl:inline">
        <b className="font-bold">Alex</b> Shanjay
      </span>
    </a>
  );
}

// `base`: "/" on the landing pages, so section links point back to the home page.
export default function Nav({ base = "" }) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 200);
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    lockScroll();
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <a href={`${base}#videos`} className="sr-only-focusable pill pill-orange fixed left-4 top-4 z-[150]">
        Skip to work
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[100] px-[var(--gutter)] pt-3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:pt-4 ${
          hidden && !menuOpen ? "-translate-y-[120%]" : ""
        }`}
      >
        <nav
          className="mx-auto flex h-[var(--nav-h)] max-w-[1600px] items-center justify-between gap-4 rounded-full border border-ink/10 bg-paper-2/80 pl-3 pr-3 shadow-[0_10px_30px_-18px_rgb(0_0_0/0.5)] backdrop-blur-md"
          aria-label="Main"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Monogram base={base} />
            <NowChip base={base} />
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={`${base}${link.href}`}
                  className="mono-label rounded-full px-3.5 py-2 text-ink transition-colors hover:bg-ink hover:text-paper-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <MagneticButton href="#contact" className="pill pill-orange min-h-[44px] px-5 text-sm">
              Hire me
            </MagneticButton>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[2px] w-5 bg-ink transition-transform duration-300 ${menuOpen ? "top-[5px] rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-5 bg-ink transition-transform duration-300 ${menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[95] flex flex-col justify-between bg-paper px-[var(--gutter)] pb-8 pt-28"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    href={`${base}${link.href}`}
                    onClick={() => setMenuOpen(false)}
                    className="display block text-[clamp(2.6rem,13vw,5rem)] transition-colors hover:text-orange-deep"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="pill pill-orange">
                WhatsApp {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`} className="pill pill-outline">
                {profile.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

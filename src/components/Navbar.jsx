import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { navLinks, profile } from "../data/content";
import MagneticButton from "./MagneticButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "border-cream/10 bg-ink/85 shadow-lg shadow-black/30 backdrop-blur-md"
            : "border-cream/0 bg-ink/20 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <a href="#top" className="font-display text-xl tracking-wide text-cream">
            ALEX<span className="text-yellow">.</span>
            <span className="hidden xl:inline text-cream/60 text-sm font-grotesk normal-case tracking-normal ml-2">
              {profile.title}
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-center gap-1.5 font-grotesk text-sm font-medium text-cream/80 transition-colors hover:text-cream"
              >
                <span className="font-mono text-[11px] text-cyan/70 group-hover:text-cyan">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            ))}
            <MagneticButton
              href="#contact"
              className="rounded-full bg-yellow px-5 py-2 font-grotesk text-sm font-semibold text-ink shadow-[0_0_0px_rgba(255,212,0,0)] transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(255,212,0,0.55)]"
            >
              Let's talk
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-cream lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </nav>
      </div>

      <div className="h-1.5 w-full flex">
        <span className="flex-1 bg-yellow" />
        <span className="flex-1 bg-navy-light" />
        <span className="flex-1 bg-lime" />
        <span className="flex-1 bg-cyan" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-ink lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 font-grotesk py-2 text-cream/80 hover:text-yellow"
                >
                  <span className="font-mono text-[11px] text-cyan/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-yellow px-5 py-2 text-center font-grotesk text-sm font-semibold text-ink"
              >
                Let's talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

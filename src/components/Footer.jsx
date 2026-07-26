import { navLinks, profile } from "../data/content";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-ink/95 pt-16 text-cream backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <a
          href="#top"
          className="block font-display text-[16vw] leading-[0.8] tracking-tight text-cream/10 transition-colors hover:text-cream/20 md:text-[9vw]"
        >
          ALEX SHANJAY
        </a>

        <div className="flex flex-col gap-8 border-t border-cream/10 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-xl">
              ALEX<span className="text-yellow">.</span>
            </div>
            <p className="mt-2 max-w-xs font-sans text-sm text-cream/50">
              {profile.title} based in {profile.location}.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-grotesk text-sm text-cream/60 transition-colors hover:text-yellow"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#top"
            className="w-fit rounded-full border border-cream/20 px-5 py-2 font-grotesk text-sm transition-colors hover:border-yellow hover:text-yellow"
          >
            Back to top ↑
          </a>
        </div>

        <div className="flex flex-col gap-2 border-t border-cream/10 py-6 font-grotesk text-xs text-cream/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span>Designed &amp; built with React, Tailwind, and Three.js.</span>
        </div>
      </div>
    </footer>
  );
}

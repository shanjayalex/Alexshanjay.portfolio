import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaLinkedin, FaBehance } from "react-icons/fa";
import { profile, socials } from "../data/content";
import SectionTag from "./SectionTag";
import MagneticButton from "./MagneticButton";

const iconMap = {
  Instagram: FaInstagram,
  YouTube: FaYoutube,
  Behance: FaBehance,
  LinkedIn: FaLinkedin,
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${form.name || "your website"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-cobalt/85 py-24 text-cream backdrop-blur-xl md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <span className="animate-float-slow absolute left-[6%] top-[15%] h-8 w-8 rounded-full bg-yellow" />
        <span className="animate-float-slower absolute right-[10%] top-[10%] h-10 w-10 rotate-12 bg-lime" />
        <span className="animate-twinkle absolute right-[20%] bottom-[15%] text-3xl text-cyan">
          ✦
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <SectionTag index="06" label="Contact" />

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl leading-[0.9] md:text-6xl">
              Let's create
              <br />
              <span className="font-serif italic normal-case tracking-normal text-stroke">
                something
              </span>
              <br />
              worth watching.
            </h2>
            <p className="mt-6 max-w-md font-sans text-cream/70">
              Have an edit, campaign, or brand that needs a story? Reach out
              and let's talk about it.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center gap-4 rounded-2xl bg-navy/40 px-5 py-4 backdrop-blur-sm transition-colors hover:bg-navy/60"
              >
                <FiMail className="text-yellow" size={20} />
                <span className="font-grotesk text-sm md:text-base">{profile.email}</span>
                <FiArrowUpRight className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 rounded-2xl bg-navy/40 px-5 py-4 backdrop-blur-sm transition-colors hover:bg-navy/60"
              >
                <FiPhone className="text-lime" size={20} />
                <span className="font-grotesk text-sm md:text-base">{profile.phone}</span>
                <FiArrowUpRight className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <div className="flex items-center gap-4 rounded-2xl bg-navy/40 px-5 py-4 backdrop-blur-sm">
                <FiMapPin className="text-cyan" size={20} />
                <span className="font-grotesk text-sm md:text-base">{profile.location}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              {socials.map((s) => {
                const Icon = iconMap[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/40 transition-colors hover:bg-yellow hover:text-ink"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="rounded-3xl bg-navy p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-wide text-cream/60">
                  Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-cream/10 bg-navy-light px-4 py-3 font-sans text-cream outline-none transition-colors focus:border-yellow"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-wide text-cream/60">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-cream/10 bg-navy-light px-4 py-3 font-sans text-cream outline-none transition-colors focus:border-yellow"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-wide text-cream/60">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-cream/10 bg-navy-light px-4 py-3 font-sans text-cream outline-none transition-colors focus:border-yellow"
                  placeholder="Tell me about your project..."
                />
              </div>
              <MagneticButton
                as="button"
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-6 py-3.5 font-grotesk font-semibold text-ink"
              >
                Send message
                <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

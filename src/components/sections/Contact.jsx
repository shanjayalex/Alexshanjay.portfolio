import { FiArrowUpRight } from "react-icons/fi";
import { profile, sections, socials } from "../../data/content";
import { fitLength } from "../../lib/type";
import MetaRow from "../ui/MetaRow";
import ScriptWord from "../ui/ScriptWord";
import StencilTitle from "../ui/StencilTitle";

const copy = sections.contact;

const rows = [
  { label: "WhatsApp", value: profile.phone, href: profile.whatsapp, primary: true },
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  ...socials.filter((s) => s.href).map((s) => ({ label: s.label, value: s.handle, href: s.href })),
];

function ContactRow({ label, value, href, primary }) {
  const external = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={`group relative flex items-center justify-between gap-4 overflow-hidden border-b border-ink/20 px-1 py-5 transition-colors md:py-7 ${
          primary ? "text-ink" : ""
        }`}
      >
        <span
          className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100 ${
            primary ? "bg-orange" : "bg-ink"
          }`}
          aria-hidden="true"
        />
        <span className={`relative flex min-w-0 flex-col gap-1 md:flex-row md:items-baseline md:gap-10 ${primary ? "" : "group-hover:text-paper-2"}`}>
          <span className={`mono-label w-32 shrink-0 ${primary ? "" : "group-hover:text-paper-2/70"}`}>{label}</span>
          <span className="card-title truncate text-[clamp(1.05rem,4.6vw,3.4rem)] transition-colors group-hover:text-current">
            {value}
          </span>
        </span>
        <span
          className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-[-8px] group-hover:rotate-45 md:h-16 md:w-16 ${
            primary ? "bg-orange text-ink group-hover:bg-ink group-hover:text-orange" : "bg-ink text-paper-2 group-hover:bg-paper-2 group-hover:text-ink"
          }`}
        >
          <FiArrowUpRight className="h-5 w-5 md:h-6 md:w-6" />
        </span>
      </a>
    </li>
  );
}

export default function Contact() {
  const title = copy.lines.join("\n");

  return (
    <section id="contact" className="relative px-[var(--gutter)] pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <MetaRow left={copy.meta[0]} right={copy.meta[1]} />

        <div className="type-stack relative mt-[max(0.5em,3rem)]" style={{ "--len": fitLength(title) }}>
          <span className="ghost-script pointer-events-none absolute right-[2%] top-[-0.25em] text-[0.4em]" aria-hidden="true" data-text={copy.ghost} />
          <StencilTitle text={title} label={copy.lines.join(" ")} className="relative" />
          <ScriptWord className="absolute bottom-[-0.32em] right-[2%] z-10 -rotate-8 text-[0.62em]">{copy.script}</ScriptWord>
        </div>

        <div className="mt-16 flex items-center gap-4 md:mt-20">
          <span className="relative shrink-0">
            <img src={profile.photoAvatar} alt={profile.photoAlt} width="56" height="56" loading="lazy" decoding="async" className="h-14 w-14 rounded-full border border-ink/15 object-cover" />
            <span className="live-dot absolute bottom-0 right-0" aria-hidden="true" />
          </span>
          <p className="leading-snug">
            <b className="font-bold text-ink">{profile.name}</b>
            <br />
            <span className="text-[15px]">{profile.replyTime}</span>
          </p>
        </div>

        <ul className="mt-8 border-t border-ink/20 md:mt-10">
          {rows.map((row) => (
            <ContactRow key={row.label} {...row} />
          ))}
        </ul>

        <p className="serif-italic mt-8 text-xl text-ink-2 md:text-2xl">
          {profile.locationLong} · {profile.availability}
        </p>
      </div>
    </section>
  );
}

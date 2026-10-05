import { MotionConfig } from "framer-motion";
import { FiArrowUpRight, FiLinkedin } from "react-icons/fi";
import { packages, process, profile, seoPages, shorts, socials, videos } from "../data/content";
import { useLightbox } from "../lib/lightbox";
import { fitLength } from "../lib/type";
import Contact from "../components/sections/Contact";
import Footer from "../components/sections/Footer";
import Nav from "../components/sections/Nav";
import LightboxProvider from "../components/ui/Lightbox";
import MagneticButton from "../components/ui/MagneticButton";
import MetaRow from "../components/ui/MetaRow";
import ScriptWord from "../components/ui/ScriptWord";
import ShortCard from "../components/ui/ShortCard";
import StencilTitle from "../components/ui/StencilTitle";
import Tray from "../components/ui/Tray";
import VideoCard from "../components/ui/VideoCard";
import WhatsAppFab from "../components/ui/WhatsAppFab";

const rupees = (n) => `Rs. ${n.toLocaleString("en-US")}`;
const linkedin = socials.find((s) => s.label === "LinkedIn")?.href;

function Work({ ids }) {
  const { open } = useLightbox();
  const long = ids.map((id) => videos.find((v) => v.id === id)).filter(Boolean);
  const vertical = ids.map((id) => shorts.find((v) => v.id === id)).filter(Boolean);
  return (
    <div className="space-y-6">
      {long.length > 0 && (
        <Tray className="grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
          {long.map((video, i) => (
            <VideoCard key={video.id} video={video} number={i + 1} onOpen={() => open({ kind: "video", items: long, index: i })} />
          ))}
        </Tray>
      )}
      {vertical.length > 0 && (
        <Tray className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
          {vertical.map((short, i) => (
            <ShortCard key={short.id} short={short} number={i + 1} onOpen={() => open({ kind: "short", items: vertical, index: i })} />
          ))}
        </Tray>
      )}
    </div>
  );
}

function Heading({ kicker, children, id }) {
  return (
    <div className="mb-8 md:mb-10">
      <p className="mono-label mb-3">
        <b className="font-bold">{kicker}</b>
      </p>
      <h2 id={id} className="card-title text-[clamp(1.8rem,3.6vw,3rem)]">
        {children}
      </h2>
    </div>
  );
}

// SEO landing page for one kind of search ("video editor Sri Lanka",
// "video editing services", …). Same look as the home page, real content,
// pre-rendered at /<slug>/ with its own head tags (src/lib/seo.js).
export default function ServicePage({ page }) {
  const title = page.h1.replaceAll("\\n", "\n");
  const pricing = page.pricing ?? (page.packagesFromContent ? packages.filter((p) => p.price >= 20000).map((p) => ({ name: `${p.name} — ${p.description}`, price: rupees(p.price) })) : null);
  const related = seoPages.filter((p) => p.slug !== page.slug);

  return (
    <MotionConfig reducedMotion="user">
      <LightboxProvider>
        <Nav base="/" />
        <main className="overflow-x-clip">
          <article>
            <header id="top" className="px-[var(--gutter)] pb-16 pt-[calc(var(--nav-h)+36px)] md:pb-24 md:pt-[calc(var(--nav-h)+52px)]">
              <div className="mx-auto max-w-[1600px]">
                <nav aria-label="Breadcrumb" className="mono-label mb-6">
                  <ol className="flex flex-wrap gap-2">
                    <li>
                      <a href="/" className="underline decoration-ink/30 underline-offset-4 hover:text-ink">
                        Home
                      </a>{" "}
                      /
                    </li>
                    <li aria-current="page">
                      <b className="font-bold">{page.nav}</b>
                    </li>
                  </ol>
                </nav>
                <MetaRow left={page.kicker[0]} right={page.kicker[1]} />

                <div className="type-stack relative mt-[max(0.5em,3rem)]" style={{ "--len": fitLength(title) }} aria-hidden="true">
                  <StencilTitle as="div" text={title} />
                  <ScriptWord className="absolute bottom-[-0.2em] right-[2%] z-10 -rotate-8 text-[0.5em]">{page.script}</ScriptWord>
                </div>

                <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.2fr_1fr] md:gap-16">
                  <div>
                    <h1 className="card-title text-[clamp(1.7rem,3.4vw,3rem)]">{page.headline}</h1>
                    <p className="mt-6 text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-[1.5] text-ink">{page.lead}</p>
                    {page.body.map((p) => (
                      <p key={p.slice(0, 24)} className="mt-4 text-[17px] md:text-lg">
                        {p}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col items-start gap-4 md:pt-2">
                    <MagneticButton href={profile.whatsapp} target="_blank" rel="noreferrer" className="pill pill-orange">
                      WhatsApp {profile.phone} <FiArrowUpRight />
                    </MagneticButton>
                    <MagneticButton href="#work" className="pill pill-outline">
                      See the work
                    </MagneticButton>
                    {linkedin && (
                      <a href={linkedin} target="_blank" rel="noreferrer me" className="pill pill-outline">
                        <FiLinkedin /> {profile.name} on LinkedIn
                      </a>
                    )}
                    <p className="serif-italic text-xl text-ink-2">{profile.replyTime}.</p>
                  </div>
                </div>
              </div>
            </header>

            <section className="px-[var(--gutter)] pb-20 md:pb-28" aria-labelledby="what-h">
              <div className="mx-auto max-w-[1600px]">
                <Heading kicker="What you get" id="what-h">
                  {page.nav} — what's included
                </Heading>
                <Tray>
                  <ul className={`grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6 ${page.points.length % 3 ? "" : "lg:grid-cols-3"}`}>
                    {page.points.map((point, i) => (
                      <li key={point.title} className="paper-card flex min-h-[180px] flex-col justify-between p-6 md:p-8">
                        <span className="mono-label">
                          No. <b className="font-bold text-ink">{String(i + 1).padStart(2, "0")}</b>
                        </span>
                        <div>
                          <h3 className="card-title text-[clamp(1.35rem,2vw,1.9rem)]">{point.title}</h3>
                          <p className="mt-2">{point.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Tray>
              </div>
            </section>

            <section id="work" className="px-[var(--gutter)] pb-20 md:pb-28" aria-labelledby="work-h">
              <div className="mx-auto max-w-[1600px]">
                <Heading kicker="Selected work" id="work-h">
                  Recent edits
                </Heading>
                <Work ids={page.work} />
                <p className="mt-6">
                  <a href="/#videos" className="font-bold text-ink underline decoration-orange decoration-2 underline-offset-4">
                    See the full portfolio
                  </a>
                </p>
              </div>
            </section>

            {pricing && (
              <section className="px-[var(--gutter)] pb-20 md:pb-28" aria-labelledby="price-h">
                <div className="mx-auto max-w-[1600px]">
                  <Heading kicker="Rates · LKR" id="price-h">
                    Prices
                  </Heading>
                  <dl className="border-t border-ink/20">
                    {pricing.map((row) => (
                      <div key={row.name} className="flex flex-col justify-between gap-1 border-b border-ink/20 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                        <dt className="text-lg font-semibold text-ink">{row.name}</dt>
                        <dd className="card-title shrink-0 text-xl">{row.price}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-[15px]">Prices in Sri Lankan rupees. International clients get a quote in their currency.</p>
                </div>
              </section>
            )}

            <section className="px-[var(--gutter)] pb-20 md:pb-28" aria-labelledby="how-h">
              <div className="mx-auto max-w-[1600px]">
                <Heading kicker="How it works" id="how-h">
                  From brief to final file
                </Heading>
                <ol className="grid gap-6 md:grid-cols-5">
                  {process.map((step, i) => (
                    <li key={step.title} className="border-t-2 border-ink pt-4">
                      <span className="mono-label">Step {String(i + 1).padStart(2, "0")}</span>
                      <h3 className="card-title mt-2 text-xl">{step.title}</h3>
                      <p className="mt-2 text-[15px]">{step.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="px-[var(--gutter)] pb-20 md:pb-28" aria-labelledby="faq-h">
              <div className="mx-auto max-w-[1600px]">
                <Heading kicker="Questions" id="faq-h">
                  {page.nav} — FAQ
                </Heading>
                <div className="border-t border-ink/20">
                  {page.faq.map((item, i) => (
                    <details key={item.q} className="group border-b border-ink/20" open={i === 0}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                        <h3 className="card-title text-[clamp(1.15rem,2vw,1.7rem)]">{item.q}</h3>
                        <span className="text-2xl text-ink transition-transform group-open:rotate-45" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <p className="max-w-3xl pb-6 text-lg">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            <nav className="px-[var(--gutter)] pb-8" aria-labelledby="more-h">
              <div className="mx-auto max-w-[1600px]">
                <Heading kicker="Also" id="more-h">
                  More services
                </Heading>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <a href={`/${p.slug}/`} className="paper-card is-interactive flex h-full items-center justify-between gap-4 p-5">
                        <span className="card-title text-lg">{p.nav}</span>
                        <FiArrowUpRight className="h-5 w-5 shrink-0" />
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="/" className="paper-card is-interactive flex h-full items-center justify-between gap-4 p-5">
                      <span className="card-title text-lg">Full portfolio</span>
                      <FiArrowUpRight className="h-5 w-5 shrink-0" />
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </article>
          <Contact />
        </main>
        <Footer base="/" />
        <WhatsAppFab />
        <div className="grain" aria-hidden="true" />
      </LightboxProvider>
    </MotionConfig>
  );
}

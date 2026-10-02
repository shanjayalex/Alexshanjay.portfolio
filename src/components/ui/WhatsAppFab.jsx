import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { profile } from "../../data/content";

// Floating WhatsApp button. Steps aside while the Contact section or footer is on
// screen — WhatsApp is the first contact row there, and the button would cover
// the row arrows and FAQ toggles on phones.
export default function WhatsAppFab() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById("contact"), document.querySelector("footer")].filter(Boolean);
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={profile.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`fixed bottom-5 right-5 z-[80] grid h-14 w-14 place-items-center rounded-full bg-orange text-ink shadow-[0_14px_30px_-10px_rgb(0_0_0/0.5)] transition-[background-color,transform,opacity] duration-300 hover:scale-105 hover:bg-orange-deep md:bottom-8 md:right-8 ${
        hidden ? "pointer-events-none translate-y-4 opacity-0" : ""
      }`}
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}

import { FaWhatsapp } from "react-icons/fa";
import { profile } from "../../data/content";

export default function WhatsAppFab() {
  return (
    <a
      href={profile.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[80] grid h-14 w-14 place-items-center rounded-full bg-orange text-ink shadow-[0_14px_30px_-10px_rgb(0_0_0/0.5)] transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-orange-deep md:bottom-8 md:right-8"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}

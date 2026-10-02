import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import { ScrollTrigger } from "./lib/gsap";
import { onIntroDone } from "./lib/intro";
import { scrollToTarget } from "./lib/scroll";
import Preloader from "./components/sections/Preloader";
import Nav from "./components/sections/Nav";
import Hero from "./components/sections/Hero";
import Showreel from "./components/sections/Showreel";
import Videos from "./components/sections/Videos";
import Shorts from "./components/sections/Shorts";
import Design from "./components/sections/Design";
import Studio from "./components/sections/Studio";
import Services from "./components/sections/Services";
import About from "./components/sections/About";
import Journey from "./components/sections/Journey";
import Faq from "./components/sections/Faq";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import CustomCursor from "./components/ui/CustomCursor";
import LightboxProvider from "./components/ui/Lightbox";
import WhatsAppFab from "./components/ui/WhatsAppFab";

// Rendered first so Lenis exists before the preloader's effects lock scroll.
function SmoothScroll() {
  useLenis();
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    // Deep links (#videos, #contact…) — the browser's own jump happens before React renders.
    return onIntroDone(() => {
      if (location.hash.length > 1) requestAnimationFrame(() => scrollToTarget(location.hash));
    });
  }, []);
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LightboxProvider>
        <SmoothScroll />
        <Preloader />
        <CustomCursor />
        <Nav />
        <main className="overflow-x-clip">
          <Hero />
          <Showreel />
          <Videos />
          <Shorts />
          <Design />
          <Studio />
          <Services />
          <About />
          <Journey />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFab />
        <div className="grain" aria-hidden="true" />
      </LightboxProvider>
    </MotionConfig>
  );
}

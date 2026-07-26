import { MotionConfig } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import PersistentWorld from "./three/PersistentWorld";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Showreel from "./components/Showreel";
import Work from "./components/Work";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  useLenis();

  return (
    <MotionConfig reducedMotion="user">
      <PersistentWorld />
      <Preloader />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Showreel />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}

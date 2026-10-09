import { MotionConfig, useReducedMotion } from "framer-motion";
import { Navbar } from "./sections/Navbar";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { FloorMap } from "./sections/FloorMap";
import { HowItWorks } from "./sections/HowItWorks";
import { SignalBand } from "./sections/SignalBand";
import { ScreenShowcase } from "./sections/ScreenShowcase";
import { Reviews } from "./sections/Reviews";
import { FooterCTA } from "./sections/FooterCTA";
import { LoginPage } from "./sections/LoginPage";

function PageContent() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`site-shell${reduceMotion ? " reduce-motion" : ""}`}>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
        <FloorMap />
        <HowItWorks />
        <SignalBand />
        <ScreenShowcase />
          <Reviews />
        <FooterCTA />
      </main>
    </div>
  );
}

export default function App() {
  const isAuthPage = ["/login", "/signup"].includes(window.location.pathname);

  return (
    <MotionConfig reducedMotion="user">
      {isAuthPage ? <LoginPage /> : <PageContent />}
    </MotionConfig>
  );
}
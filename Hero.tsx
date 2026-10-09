import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, LocateFixed, MapPin, ScanLine } from "lucide-react";
import { Eyebrow } from "../components/Eyebrow";

const words = ["Walk", "straight", "to", "the", "shop."];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-layout mx-auto grid max-w-screen-xl items-center px-5 md:px-9">
        <div className="hero-copy">
          <Eyebrow className="hero-eyebrow">Indoor navigation, made simple</Eyebrow>
          <motion.h1 id="hero-title" className="hero-title" initial="hidden" animate="visible">
            {words.map((word, index) => (
              <motion.span className="hero-word" key={word} custom={index} variants={{
                hidden: { y: 34, opacity: 0 },
                visible: (wordIndex: number) => ({ y: 0, opacity: 1, transition: { delay: 0.12 + wordIndex * 0.1, duration: 0.62, ease: [0.22, 1, 0.36, 1] } }),
              }}>{word}</motion.span>
            ))}
          </motion.h1>
          <motion.p className="hero-description" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.55 }}>
            Scan a QR code, choose where you’re going, and let clear AR directions take you there.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.55 }}>
            <a className="button button-primary" href="#get-started">Get started <ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="button button-secondary" href="#floor-map"><span className="button-icon"><MapPin size={17} aria-hidden="true" /></span> Try the floor map</a>
          </motion.div>
          <div className="hero-proof" aria-label="NaviSense features">
            <span><ScanLine size={15} aria-hidden="true" /> One QR scan</span>
            <span className="proof-divider" aria-hidden="true" />
            <span><LocateFixed size={15} aria-hidden="true" /> No guesswork</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Preview of AR indoor navigation">
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <motion.div className="hero-phone-wrap" animate={reduceMotion ? undefined : { y: [0, -11, 0], rotate: [2, 1, 2] }} transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}>
            <div className="hero-phone">
              <div className="phone-island" aria-hidden="true" />
              <div className="phone-status"><span>9:41</span><span className="status-signals" aria-hidden="true">● ◔ ▰</span></div>
              <div className="corridor-scene" aria-hidden="true">
                <div className="corridor-ceiling" />
                <div className="corridor-wall corridor-wall-left" />
                <div className="corridor-wall corridor-wall-right" />
                <div className="corridor-back" />
                <div className="corridor-floor" />
                <div className="corridor-shop shop-left"><span>MARKET</span></div>
                <div className="corridor-shop shop-right"><span>ATELIER</span></div>
                <div className="corridor-light light-left" />
                <div className="corridor-light light-right" />
                <svg className="phone-route" viewBox="0 0 320 500" preserveAspectRatio="none">
                  <motion.path d="M 159 460 C 160 370, 159 340, 160 302 S 178 236, 160 196 S 160 142, 160 108" fill="none" stroke="#6baeff" strokeWidth="7" strokeLinecap="round" strokeDasharray="12 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : 1.7, delay: 0.8, ease: "easeInOut" }} />
                  <path d="M 142 325 L 160 306 L 178 325 M 142 260 L 160 241 L 178 260" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <motion.div className="turn-banner" animate={reduceMotion ? undefined : { x: [28, 0, 0, 28], opacity: [0, 1, 1, 0] }} transition={{ duration: 7, times: [0, 0.15, 0.72, 1], repeat: Infinity, repeatDelay: 1 }}>
                  <span className="turn-arrow"><ArrowRight size={19} aria-hidden="true" /></span>
                  <span><strong>Turn right</strong><small>in 20 meters</small></span>
                </motion.div>
                <div className="you-are-here" title="You are here"><span /></div>
              </div>
              <div className="phone-destination"><span className="destination-mini-pin"><MapPin size={17} fill="currentColor" aria-hidden="true" /></span><span><strong>Zara</strong><small>3 min <b>·</b> 100 m</small></span><ArrowUpRight size={17} aria-hidden="true" /></div>
              <div className="phone-home-indicator" aria-hidden="true" />
            </div>
          </motion.div>
          <motion.div className="hero-location-chip" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.55 }}>
            <span className="location-pulse"><span /></span>
            <span><strong>You’re on level 1</strong><small>Ground floor · East wing</small></span>
          </motion.div>
          <div className="hero-scroll-cue"><span>Find your way inside</span><ArrowDown size={15} aria-hidden="true" /></div>
        </div>
      </div>
      <div className="hero-bottom-rule" aria-hidden="true" />
    </section>
  );
}
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight, MoveRight, Pause, Play } from "lucide-react";
import { Eyebrow } from "../components/Eyebrow";
import { appScreens, type AppScreen } from "../data/content";

function ScreenCard({ screen, decorative = false }: { screen: AppScreen; decorative?: boolean }) {
  return (
    <article className="screen-card" role="listitem">
      <div className={`screen-card-image${screen.src ? "" : " screen-card-placeholder"}`}>
        {screen.src ? <img src={screen.src} alt={decorative ? "" : `${screen.label} screen in the NaviSense app`} loading="lazy" draggable="false" /> : <NearbyScreen />}
        <span className="screen-card-number">{String(screen.number).padStart(2, "0")}</span>
      </div>
      <div className="screen-card-copy"><div><span>{screen.label}</span><h3>{screen.title}</h3></div><MoveRight size={18} aria-hidden="true" /></div>
    </article>
  );
}

function NearbyScreen() {
  return (
    <div className="nearby-screen" aria-label="Nearby places app screen preview">
      <div className="nearby-status"><span>9:41</span><span>● ◔ ▰</span></div>
      <div className="nearby-content">
        <span className="nearby-kicker">NORTHSTAR MALL · LEVEL 1</span>
        <h4>Places close by</h4>
        <div className="nearby-search">⌕ <span>Where to?</span></div>
        <div className="nearby-place"><i className="nearby-place-icon">Z</i><span><strong>Zara</strong><small>Fashion · 150 m</small></span><b>›</b></div>
        <div className="nearby-place"><i className="nearby-place-icon nearby-food">F</i><span><strong>Food Court</strong><small>Dining · 210 m</small></span><b>›</b></div>
        <div className="nearby-place"><i className="nearby-place-icon nearby-prayer">P</i><span><strong>Prayer Room</strong><small>Facilities · 90 m</small></span><b>›</b></div>
        <span className="nearby-map-link">See floor map <ArrowRight size={11} aria-hidden="true" /></span>
      </div>
    </div>
  );
}

export function ScreenShowcase() {
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasEntered = useInView(carouselRef, { once: true, amount: 0.1 });

  function renderGroup(decorative = false) {
    return appScreens.map((screen) => <ScreenCard key={screen.number} screen={screen} decorative={decorative} />);
  }

  return (
    <section className="screens-section" id="app-screens" aria-labelledby="screens-title">
      <div className="section-wrap">
        <div className="section-heading screens-heading">
          <div><Eyebrow>A peek inside the app</Eyebrow><h2 id="screens-title">Made to move with you.</h2></div>
          <div className="screens-heading-actions">
            <span className="screen-total">22 app screens</span>
            <button className="icon-button carousel-toggle" type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Resume screen animation" : "Pause screen animation"} aria-pressed={isPaused} title={isPaused ? "Resume animation" : "Pause animation"}>
              {isPaused ? <Play size={15} fill="currentColor" aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            </button>
            <a className="text-link" href="#floor-map">Explore the map <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <div className={`screen-carousel${isPaused ? " is-paused" : ""}`} ref={carouselRef} tabIndex={0} aria-label="NaviSense app screens, automatically looping through all 22 screens">
        <div className={`screen-track${isPaused || !hasEntered ? " is-paused" : ""}`}>
          <div className="screen-track-group" role="list">{renderGroup()}</div>
          <div className="screen-track-group" role="list" aria-hidden="true">{renderGroup(true)}</div>
        </div>
      </div>
    </section>
  );
}
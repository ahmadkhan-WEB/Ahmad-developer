import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation2 } from "lucide-react";
import { Eyebrow } from "../components/Eyebrow";
import { destinations } from "../data/content";

export function FloorMap() {
  const [selectedId, setSelectedId] = useState<(typeof destinations)[number]["id"]>("zara");
  const selected = destinations.find((destination) => destination.id === selectedId) ?? destinations[0];

  return (
    <section className="map-section" id="floor-map" aria-labelledby="map-title">
      <div className="section-wrap">
        <div className="section-heading map-heading">
          <div>
            <Eyebrow>Know the way before you go</Eyebrow>
            <h2 id="map-title">The whole mall.<br /><span>One clear route.</span></h2>
          </div>
          <p className="section-lede">Tap a destination to see how NaviSense guides you there, turn by turn.</p>
        </div>
        <div className="map-stage">
          <div className="map-toolbar"><span className="map-level-dot" /><span>Northstar Mall</span><span className="map-toolbar-divider">/</span><span>Level 1</span><span className="map-live"><i /> Live map</span></div>
          <div className="mall-map-scroll">
            <svg className="mall-map" viewBox="0 0 680 360" role="img" aria-labelledby="mall-map-title mall-map-desc">
              <title id="mall-map-title">Interactive Northstar Mall floor map</title>
              <desc id="mall-map-desc">A simplified mall map. The route from your location to {selected.name} is highlighted in blue.</desc>
              <defs>
                <pattern id="mapGrid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="currentColor" strokeOpacity=".045" strokeWidth="1" /></pattern>
                <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <rect x="5" y="5" width="670" height="350" rx="22" className="map-floor" />
              <rect x="5" y="5" width="670" height="350" rx="22" fill="url(#mapGrid)" />
              <path d="M42 183H638 M318 30V330" className="map-corridor" />
              <path d="M42 183H638 M318 30V330" className="map-corridor-highlight" />
              <g className="map-block map-block-zara"><rect x="64" y="40" width="158" height="106" rx="13" /><text x="143" y="98">ZARA</text><text x="143" y="119" className="map-block-caption">FASHION</text></g>
              <g className="map-block map-block-food"><rect x="270" y="39" width="172" height="74" rx="13" /><text x="356" y="80">Food Court</text><text x="356" y="99" className="map-block-caption">LEVEL 1</text></g>
              <g className="map-block map-block-prayer"><rect x="466" y="214" width="148" height="94" rx="13" /><text x="540" y="258">Prayer room</text><text x="540" y="279" className="map-block-caption">QUIET SPACE</text></g>
              <g className="map-block map-block-rest"><rect x="64" y="226" width="112" height="68" rx="12" /><text x="120" y="257">Washrooms</text><text x="120" y="276" className="map-block-caption">ALL GENDER</text></g>
              <g className="map-block map-block-store"><rect x="494" y="45" width="116" height="80" rx="12" /><text x="552" y="82">Studio</text><text x="552" y="101" className="map-block-caption">HOME</text></g>
              <g className="map-block map-block-store"><rect x="204" y="230" width="112" height="76" rx="12" /><text x="260" y="268">Market</text><text x="260" y="287" className="map-block-caption">GROCERIES</text></g>
              <path d="M80 183H596" className="map-walkway" />
              <motion.path key={selected.id} d={selected.route} className="map-route" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }} />
              <g className="map-user" transform="translate(86 274)"><circle r="18" className="map-user-halo" /><circle r="9" className="map-user-core" /><Navigation2 size={11} x={-5.5} y={-5.5} color="white" aria-hidden="true" /></g>
              <motion.g className="map-destination-pin" animate={{ x: selected.x, y: selected.y }} transition={{ type: "spring", stiffness: 190, damping: 18 }}>
                <circle r="18" className="destination-pin-halo" /><path d="M0 -12C-6.6 -12 -11 -7 -11 -1c0 7 11 18 11 18S11 6 11-1C11-7 6.6-12 0-12Z" /><circle cy="-2" r="3.5" fill="white" />
              </motion.g>
              <g className="map-entrance"><path d="M335 330v-22m-9 9 9-9 9 9" /><text x="335" y="348">ENTRANCE</text></g>
            </svg>
          </div>
          <div className="map-footer"><span><i className="legend-user" /> You are here</span><span><i className="legend-route" /> Your route</span><span className="map-scale" aria-hidden="true"><i /><i /><i /></span></div>
        </div>
        <div className="destination-list" aria-label="Choose a destination">
          {destinations.map((destination) => (
            <button className={`destination-chip ${selectedId === destination.id ? "is-selected" : ""}`} type="button" key={destination.id} onClick={() => setSelectedId(destination.id)} aria-pressed={selectedId === destination.id}>
              <span className="chip-pin"><MapPin size={15} fill="currentColor" aria-hidden="true" /></span>
              <span>{destination.name}</span><span className="chip-distance">{destination.distance}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
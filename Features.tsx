import { motion } from "framer-motion";
import type { MouseEvent } from "react";
import { Eyebrow } from "../components/Eyebrow";
import { features } from "../data/content";

export function Features() {
  function navigateToFeature(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    if (window.location.hash !== href) window.history.pushState(null, "", href);
    document.querySelector(href)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }

  return (
    <section className="features-section section-wrap" id="features" aria-labelledby="features-title">
      <motion.div className="section-heading" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55 }}>
        <div>
          <Eyebrow>The mall, in your pocket</Eyebrow>
          <h2 id="features-title">Everything you need.<br /><span>Right around the corner.</span></h2>
        </div>
        <p className="section-lede">From finding a favorite store to finding your friends, the whole place is easier to navigate.</p>
      </motion.div>
      <div className="feature-grid">
        {features.map(({ title, description, icon: Icon, tone, href }, index) => (
          <motion.a className="feature-card" href={href} onClick={(event) => navigateToFeature(event, href)} aria-label={`Explore ${title}`} key={title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.07, duration: 0.5 }} whileHover={{ y: -5, rotate: index % 2 === 0 ? -0.45 : 0.45 }}>
            <span className={`feature-icon tone-${tone}`}><Icon size={21} strokeWidth={1.9} aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p>{description}</p>
            <span className="feature-index" aria-hidden="true">0{index + 1}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
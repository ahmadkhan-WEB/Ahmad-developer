import { motion } from "framer-motion";
import { ArrowDownRight, Compass, ScanLine, Signpost } from "lucide-react";
import { Eyebrow } from "../components/Eyebrow";

const steps = [
  { title: "Scan the QR code", description: "One quick scan places you right where you are.", icon: ScanLine },
  { title: "Choose your destination", description: "Search for a shop, facility, or someone you know.", icon: Compass },
  { title: "Follow the arrows", description: "Simple AR directions lead you all the way there.", icon: Signpost },
];

export function HowItWorks() {
  return (
    <section className="steps-section section-wrap" id="how-it-works" aria-labelledby="steps-title">
      <div className="section-heading">
        <div>
          <Eyebrow>Three steps. Zero wrong turns.</Eyebrow>
          <h2 id="steps-title">Getting there is easy.</h2>
        </div>
        <ArrowDownRight className="steps-heading-mark" size={42} strokeWidth={1.35} aria-hidden="true" />
      </div>
      <div className="steps-grid">
        {steps.map(({ title, description, icon: Icon }, index) => (
          <motion.article className="step-card" key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ delay: index * 0.8, duration: 0.6 }}>
            <div className="step-topline"><span className="step-number">0{index + 1}<i /></span><span className="step-icon"><Icon size={22} strokeWidth={1.8} aria-hidden="true" /></span></div>
            <h3>{title}</h3>
            <p>{description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
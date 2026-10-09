import { motion } from "framer-motion";
import { Eyebrow } from "../components/Eyebrow";
import { useCountUp } from "../hooks/useCountUp";
import { stats } from "../data/content";

function Stat({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { ref, count } = useCountUp(value);
  return <div className="stat-item"><span className="stat-value"><span ref={ref}>{count}</span>{suffix}</span><span className="stat-label">{label}</span></div>;
}

const marquee = "AR navigation ✦ QR location ✦ Live friends ✦ Floor maps ✦ ";

export function SignalBand() {
  return (
    <section className="signal-section" aria-label="NaviSense at a glance">
      <div className="marquee-window" aria-hidden="true">
        <motion.div className="marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 26, ease: "linear", repeat: Infinity }}>
          <span>{marquee}</span><span>{marquee}</span>
        </motion.div>
      </div>
      <div className="signal-content section-wrap">
        <div className="signal-intro"><Eyebrow>A little closer, every day</Eyebrow><h2>Built around<br />the way people move.</h2></div>
        <div className="stats-grid">
          {stats.map((stat, index) => <motion.div className="stat-cell" key={stat.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.1, duration: 0.45 }}><Stat {...stat} /></motion.div>)}
        </div>
        <p className="language-line">Made for everyone <span aria-hidden="true">·</span> English <i /> اردو</p>
      </div>
    </section>
  );
}
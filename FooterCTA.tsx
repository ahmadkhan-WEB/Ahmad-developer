import { ArrowRight, ArrowUpRight, Instagram, Linkedin, MapPin } from "lucide-react";
import { Eyebrow } from "../components/Eyebrow";
import { socialLinks } from "../data/content";

export function FooterCTA() {
  return (
    <footer className="footer-section" id="get-started">
      <div className="footer-cta section-wrap">
        <div><Eyebrow>Your next stop is closer</Eyebrow><h2>Stop searching.<br /><span>Start arriving.</span></h2></div>
        <a className="button button-light" href="#floor-map">Get started <ArrowUpRight size={17} aria-hidden="true" /></a>
        <div className="footer-coordinate" aria-hidden="true"><MapPin size={18} /><span>31.5204° N<br />74.3587° E</span></div>
      </div>
      <div className="footer-bottom section-wrap">
        <a className="brand-lockup footer-brand" href="#top"><span className="brand-pin"><span /></span><span>Navi<span>Sense</span></span></a>
        <p>Find your way inside.</p>
        <div className="footer-links">
          <a href="mailto:hello@navisense.app">Email us <ArrowUpRight size={13} aria-hidden="true" /></a>
          {socialLinks.map((link) => {
            const Icon = link.label === "Instagram" ? Instagram : Linkedin;
            return <a href={link.href} key={link.label} target="_blank" rel="noreferrer" aria-label={`NaviSense on ${link.label}`}><Icon size={17} aria-hidden="true" /><span>{link.label}</span></a>;
          })}
          <a className="back-to-top" href="#top" aria-label="Back to top">Back to top <ArrowRight size={14} aria-hidden="true" /></a>
        </div>
        <span className="footer-copyright">© 2026 NaviSense</span>
      </div>
    </footer>
  );
}
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: "Explore", href: "#features" },
    { label: "Floor map", href: "#floor-map" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Reviews", href: "#reviews" },
  ];

  return (
    <header className="site-header">
      <div className="nav-inner mx-auto flex w-full max-w-screen-xl items-center justify-between px-5 md:px-9">
        <a className="brand-lockup" href="#top" aria-label="NaviSense home">
          <span className="brand-pin"><span /></span>
          <span>Navi<span>Sense</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <a className="nav-sign-in" href="/login">Sign in</a>
          <a className="button button-primary nav-cta" href="#get-started">Get the app <ArrowUpRight size={16} aria-hidden="true" /></a>
          <button className="icon-button menu-toggle" type="button" onClick={() => setMenuOpen((isOpen) => !isOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {links.map((link) => <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
            <a href="/login" onClick={() => setMenuOpen(false)}>Sign in</a>
            <a href="#get-started" onClick={() => setMenuOpen(false)}>Get the app <ArrowUpRight size={15} aria-hidden="true" /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
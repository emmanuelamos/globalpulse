/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Top navigation bar with GlobalPulse branding + theme toggle + language selector
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Radio, BarChart3, Search, Globe, Sun, Moon, User, Briefcase, Trophy } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector, { LanguageSelectorMobile } from "./LanguageSelector";
import { Link, useLocation } from "wouter";

const NAV_LINKS = [
  { key: "nav.trends", icon: Zap, href: "/trends" },
  { key: "nav.rankings", icon: BarChart3, href: "/rankings" },
  { key: "nav.broadcasters", icon: Radio, href: "/broadcasters" },
  { key: "nav.search", icon: Search, href: "/search" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-xl border-b border-neon-cyan/10">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/icon-192x192.png"
            alt="GlobalPulse"
            className="w-9 h-9 rounded-lg group-hover:shadow-[0_0_20px_oklch(0.85_0.18_195/0.5)] transition-shadow"
          />
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-neon-cyan">Global</span>
            <span className="text-foreground">Pulse</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-medium transition-all ${
                location === link.href || location.startsWith(link.href + "/")
                  ? "text-neon-cyan bg-neon-cyan/10"
                  : "text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Language + Theme toggle + CTA + Mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <LanguageSelector />

          {/* Sun / Moon toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-lg border border-neon-cyan/20 flex items-center justify-center text-muted-foreground hover:text-neon-amber hover:border-neon-amber/30 hover:bg-neon-amber/5 transition-all overflow-hidden"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ y: 12, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -12, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ y: 12, opacity: 0, rotate: 90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -12, opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Profile */}
          <Link href="/profile" className="hidden sm:flex w-9 h-9 rounded-lg border border-border/30 items-center justify-center text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/30 transition-all">
            <User className="w-4 h-4" />
          </Link>

          <Link href="/trends" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.4)] transition-shadow">
            <Zap className="w-4 h-4" />
            {t("nav.enterPulse")}
          </Link>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-neon-cyan/10 bg-background/95 backdrop-blur-xl"
          >
            <div className="container py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-medium transition-all ${
                    location === link.href
                      ? "text-neon-cyan bg-neon-cyan/10"
                      : "text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {t(link.key)}
                </Link>
              ))}
              <Link
                href="/business"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-medium transition-all ${
                  location === "/business"
                    ? "text-neon-cyan bg-neon-cyan/10"
                    : "text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Business
              </Link>
              <Link
                href="/sports"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-medium transition-all ${
                  location === "/sports"
                    ? "text-neon-cyan bg-neon-cyan/10"
                    : "text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5"
                }`}
              >
                <Trophy className="w-4 h-4" />
                Sports
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-medium text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              {/* Theme toggle in mobile menu */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-medium text-muted-foreground hover:text-neon-amber hover:bg-neon-amber/5 transition-all"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
              </button>
              {/* Language selector in mobile menu */}
              <LanguageSelectorMobile />
              <Link
                href="/trends"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 mt-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm"
              >
                <Zap className="w-4 h-4" />
                {t("nav.enterPulse")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Cookie consent banner — broadcast style
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, X } from "lucide-react";
import { Link } from "wouter";

const COOKIE_KEY = "gp_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="max-w-4xl mx-auto glass-card rounded-xl border border-neon-cyan/20 p-5 md:p-6 shadow-[0_0_40px_oklch(0.85_0.18_195/0.1)]">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="hidden sm:flex w-10 h-10 rounded-lg bg-neon-cyan/10 items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-neon-cyan" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-neon-cyan tracking-widest">DATA PROTOCOL</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  GlobalPulse uses cookies and similar tracking technologies to enhance your broadcast experience,
                  analyze signal traffic, and personalize your news feed. By continuing, you agree to our{" "}
                  <Link href="/privacy" className="text-neon-cyan hover:underline">Privacy Policy</Link>
                  {" "}and{" "}
                  <Link href="/terms" className="text-neon-cyan hover:underline">Terms of Service</Link>.
                </p>
              </div>

              {/* Close */}
              <button
                onClick={decline}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={decline}
                className="px-5 py-2 rounded-lg bg-secondary/50 border border-border/30 text-sm font-display font-medium text-muted-foreground hover:text-foreground hover:border-border/50 transition-all"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white text-sm font-display font-bold hover:shadow-[0_0_20px_oklch(0.85_0.18_195/0.3)] transition-all"
              >
                Accept All Cookies
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

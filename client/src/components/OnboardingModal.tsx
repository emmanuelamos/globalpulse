/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Onboarding welcome modal for first-time visitors
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, TrendingUp, Shield, Flame, Laugh, Star, CloudSun,
  Briefcase, Mic, Globe, ChevronRight, X, Zap
} from "lucide-react";

const ONBOARDING_KEY = "gp_onboarded";

const STEPS = [
  {
    title: "Welcome to GlobalPulse",
    subtitle: "The World's First AI-Ranked News Network",
    desc: "We don't just report news — we rank it. Every story, every country, every category — tracked, scored, and ranked in real time by AI. You're about to see the world like never before.",
    icon: Globe,
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
  },
  {
    title: "8 Pulse Categories",
    subtitle: "Every Angle. Every Trend. Ranked.",
    desc: "Crime, Trending, Funny, Entertainment, Celebrity, Gossip, Weather, Business — each with Global Top 10 rankings that drill down to countries, states, and cities.",
    icon: Flame,
    color: "text-neon-magenta",
    bg: "bg-neon-magenta/10",
  },
  {
    title: "The Broadcasters Room",
    subtitle: "AI Anchors. Live Call-Ins. Your Voice.",
    desc: "Listen to Marcus & Victoria — our AI news anchors — deliver trending stories with personality and roasts. Premium subscribers can call in, rewind, and access 48-hour archives.",
    icon: Mic,
    color: "text-neon-amber",
    bg: "bg-neon-amber/10",
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  };

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative glass-card rounded-2xl border border-neon-cyan/20 p-8 max-w-md w-full shadow-[0_0_60px_oklch(0.85_0.18_195/0.15)]"
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === step ? "w-8 bg-neon-cyan" : i < step ? "w-4 bg-neon-cyan/40" : "w-4 bg-secondary/50"
                  }`}
                />
              ))}
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                {step + 1}/{STEPS.length}
              </span>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`w-14 h-14 rounded-xl ${current.bg} flex items-center justify-center mb-5`}>
                  <current.icon className={`w-7 h-7 ${current.color}`} />
                </div>

                <span className="text-[10px] font-mono tracking-widest text-muted-foreground block mb-2">
                  {current.subtitle}
                </span>

                <h2 className="text-2xl font-display font-bold mb-3">
                  {current.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={close}
                className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={next}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm hover:shadow-[0_0_20px_oklch(0.85_0.18_195/0.3)] transition-all"
              >
                {step < STEPS.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Enter the Pulse
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

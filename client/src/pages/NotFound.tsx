/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: 404 — "Signal Lost"
 */
import { motion } from "framer-motion";
import { Radio, Home, Search, ArrowLeft, WifiOff, Zap } from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OGMeta from "@/components/OGMeta";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <OGMeta title="404 — Signal Lost | GlobalPulse" description="This frequency is offline. The page you're looking for doesn't exist on GlobalPulse." />
      <Navbar />

      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Animated background noise */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-magenta/5 via-transparent to-neon-cyan/5" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)`,
          backgroundSize: "100% 4px",
          animation: "scan 8s linear infinite",
        }} />

        <div className="container relative text-center max-w-2xl mx-auto">
          {/* Glitchy 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <span className="text-[120px] md:text-[180px] font-display font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-magenta">
                404
              </span>
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Signal lost badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta text-sm font-display font-bold mb-6"
          >
            <WifiOff className="w-4 h-4" />
            SIGNAL LOST
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-4xl font-display font-bold mb-4"
          >
            This Frequency Is{" "}
            <span className="text-neon-magenta text-glow-magenta">Off Air</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-md mx-auto mb-10"
          >
            The page you're looking for has either been moved, deleted, or never existed.
            Our broadcast signal couldn't reach this destination. Let's get you back on air.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => setLocation("/")}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.3)] transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Command Center
            </button>
            <button
              onClick={() => setLocation("/trends")}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-display font-bold text-sm hover:bg-neon-cyan/20 transition-all"
            >
              <Radio className="w-4 h-4" />
              Browse Trending
            </button>
            <button
              onClick={() => setLocation("/search")}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-display font-bold text-sm hover:border-neon-cyan/30 transition-all"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </motion.div>

          {/* Fun ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground/60"
          >
            <Zap className="w-3 h-3 text-neon-amber" />
            <span>ERROR CODE: GP-404 | TIMESTAMP: {new Date().toISOString()} | STATUS: OFF_AIR</span>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Hero section — massive headline, globe visual, live counters, CTA
 * Full-bleed dark background with hero broadcast image overlay
 */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap, Users, Radio, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HERO_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/ZssTRmQxKAJEj5VSkQfJny/sandbox/ONZFVijnF85DwNUEwqPtFq-img-1_1770540973000_na1fn_aGVyby1icm9hZGNhc3Q.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWnNzVFJtUXhLQUpFajVWU2tRZkpueS9zYW5kYm94L09OWkZWaWpuRjg1RHdOVUV3cVB0RnEtaW1nLTFfMTc3MDU0MDk3MzAwMF9uYTFmbl9hR1Z5YnkxaWNtOWhaR05oYzNRLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=d4w8drDHJkmJG7h7qg9TxupJnaLK3tHrPX0i8PVN9FIqhwEY4W1bTB-N-7Z9YX9Cngmrov2aX5LvLCLBYxhJz9oPNQ7eZR0V6ama~E6l0sqa5FCsufJkOZ-JEhMtfgc5frwvZLXvm2EGIEJ-IpzE1EoDyQcZis0mDH2Sd6RpociKe5pgO~wilBJlJITNko-~ojVtd0fvts20DAFCdS5dVpj-aIRCDiPTeIUxfDIx39ej3aiX5yPkYtulHUDMmmxR95iLdOAi2M1kHlGK8JkQr3lo5YX4u-fMXD2n-RPdO~WHTZZzDvta82z9IBqu-wp4gtroIPIUmbCb5L~v5pmNSQ__";

const GLOBE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/ZssTRmQxKAJEj5VSkQfJny/sandbox/ONZFVijnF85DwNUEwqPtFq-img-5_1770540971000_na1fn_Z2xvYmUtbmV0d29yaw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWnNzVFJtUXhLQUpFajVWU2tRZkpueS9zYW5kYm94L09OWkZWaWpuRjg1RHdOVUV3cVB0RnEtaW1nLTVfMTc3MDU0MDk3MTAwMF9uYTFmbl9aMnh2WW1VdGJtVjBkMjl5YXcuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Dp-XPjmC9c5kBay7ffeCWF75gk2XerS3sxgi5LLAAWA-Gv699GJEpQp01vi74fjFjsbLVoRbov7yS3JkhIwmlT4gstb34ezGn2GEIoZbviUUgF8i0QyW6OAqJ9vyy2nqhWXNKwEhUSDWavH69frB~maC3NYZ8Bvl-Ea3vR~OQ2KQvhVAfN5cdzt8-ZvFI6O5m0juLL5Wb2x7VasuQnTNU5TTzjk~kQpC-KxLx-AnKoGvJg~cBQ~dql3YvRHDQCRHc6-QY0p47hM2HrwGBBep8TAihePK9-N8hUpAcK3vp5vbKS5fUXwo4c9yz7Aef5iA8EqgQDsJgTHqJdjTiYKsmg__";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span className="font-mono font-bold text-2xl md:text-3xl text-neon-cyan tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/80" />
      </div>

      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="space-y-8">
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/30"
            >
              <span className="live-dot w-2 h-2 rounded-full bg-neon-red inline-block" />
              <span className="text-neon-red font-display text-xs font-bold tracking-wider uppercase">{t("hero.badge")}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight"
            >
              <span className="text-foreground">{t("hero.title1")}</span>
              <br />
              <span className="text-glow-cyan text-neon-cyan">{t("hero.title2")}</span>
              <br />
              <span className="text-foreground">{t("hero.title3")}</span>{" "}
              <span className="text-glow-magenta text-neon-magenta">{t("hero.title4")}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-base hover:shadow-[0_0_40px_oklch(0.85_0.18_195/0.5)] transition-all hover:scale-[1.02]">
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                {t("hero.cta1")}
              </button>
              <button className="flex items-center gap-2 px-8 py-4 rounded-xl border border-neon-cyan/30 text-neon-cyan font-display font-bold text-base hover:bg-neon-cyan/5 hover:border-neon-cyan/50 transition-all">
                <Radio className="w-5 h-5" />
                {t("hero.cta2")}
              </button>
            </motion.div>

            {/* Live counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              <div className="flex flex-col">
                <AnimatedCounter target={127843} suffix="+" />
                <span className="text-xs text-muted-foreground font-display mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {t("hero.stat2")}
                </span>
              </div>
              <div className="flex flex-col">
                <AnimatedCounter target={47} />
                <span className="text-xs text-muted-foreground font-display mt-1 flex items-center gap-1">
                  <Radio className="w-3 h-3" /> {t("hero.stat1")}
                </span>
              </div>
              <div className="flex flex-col">
                <AnimatedCounter target={2847} suffix="+" />
                <span className="text-xs text-muted-foreground font-display mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {t("hero.stat3")}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Globe visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <div className="relative w-[480px] h-[480px]">
              {/* Glow behind globe */}
              <div className="absolute inset-0 rounded-full bg-neon-cyan/10 blur-3xl" />
              <div className="absolute inset-8 rounded-full bg-neon-magenta/5 blur-2xl" />
              <img
                src={GLOBE_IMG}
                alt="Global network"
                className="relative w-full h-full object-contain animate-float"
              />
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 -left-4 glass-card rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="live-dot w-2 h-2 rounded-full bg-neon-red inline-block" />
                <span className="text-xs font-display text-neon-red font-bold">LIVE: Mumbai</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 -right-4 glass-card rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="text-xs font-mono text-neon-cyan font-bold">#1 Tokyo</span>
                <span className="text-[10px] text-neon-green">Safest</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -right-8 glass-card rounded-lg px-3 py-2"
              >
                <span className="text-xs font-display text-neon-amber font-bold">Trending: Lagos</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

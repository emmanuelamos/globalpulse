/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Features grid — key selling points with icons and descriptions
 */
import { motion } from "framer-motion";
import { Smartphone, Bell, Search, MessageSquare, Heart, Share2, Map, Wifi } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FEATURES = [
  {
    icon: Smartphone,
    title: "Install in Seconds",
    description: "Progressive Web App — no app store needed. Add to home screen and you're in. Works on any device, any browser.",
    color: "text-neon-cyan",
  },
  {
    icon: Search,
    title: "Deep Dive Search",
    description: "Type 'Entertainment Canada' and get the top 10 ranked stories instantly. AI-powered suggestions learn what you love.",
    color: "text-neon-magenta",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "'Breaking: Canada jumps in safety ranks!' Custom notifications for your city, your categories, your obsessions.",
    color: "text-neon-amber",
  },
  {
    icon: MessageSquare,
    title: "Likes, Comments, Replies",
    description: "React to stories. Debate rankings. Reply to other users. This isn't passive news — it's a conversation.",
    color: "text-neon-green",
  },
  {
    icon: Map,
    title: "Hotspot Maps",
    description: "Visual crime heatmaps, weather overlays, safety zones. See the world's data painted on interactive maps.",
    color: "text-neon-red",
  },
  {
    icon: Heart,
    title: "Trend Streaks",
    description: "Swipe all 9 categories daily to earn your Trend Streak badge. Gamified news consumption that keeps you coming back.",
    color: "text-neon-violet",
  },
  {
    icon: Share2,
    title: "Shareable Rank Cards",
    description: "'Barrie's calmest day this month!' Generate beautiful rank cards to share on social media and flex your city.",
    color: "text-neon-cyan",
  },
  {
    icon: Wifi,
    title: "Offline Ready",
    description: "Cached trends and rankings for instant opens. No signal? No problem. Your last pulse is always available.",
    color: "text-neon-amber",
  },
];

export default function FeaturesGrid() {
  const { t } = useLanguage();
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-neon-cyan font-display text-sm font-bold tracking-widest uppercase mb-3 block">
            {t("features.label")}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
            {t("features.title1")}{" "}
            <span className="text-neon-cyan text-glow-cyan">{t("features.title2")}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-lg">
            Every feature designed to make you come back. Every interaction designed to keep you hooked.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-xl p-6 hover:border-neon-cyan/30 transition-all group cursor-pointer hover:scale-[1.02]"
            >
              <feat.icon className={`w-8 h-8 ${feat.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="font-display font-bold text-base mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

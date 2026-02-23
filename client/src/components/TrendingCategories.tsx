/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Trending news categories showcase — 9 swipeable categories
 * Each category gets its own neon color identity
 */
import { motion } from "framer-motion";
import { Siren, TrendingUp, Laugh, Film, Star, MessageCircle, CloudLightning, Briefcase, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NEWS_CARDS_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/IcIVtwaLxaWTAppN.png";

const CATEGORIES = [
  { name: "Crime", icon: Siren, color: "from-red-500 to-red-700", border: "border-neon-red/40", glow: "hover:shadow-[0_0_30px_oklch(0.65_0.25_25/0.3)]", text: "text-neon-red", sample: "Toronto heist gone wrong — 3 suspects flee", heat: "HOT" },
  { name: "Trending", icon: TrendingUp, color: "from-cyan-400 to-cyan-600", border: "border-neon-cyan/40", glow: "hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.3)]", text: "text-neon-cyan", sample: "Canada jumps 3 spots in global safety", heat: "RISING" },
  { name: "Funny", icon: Laugh, color: "from-amber-400 to-amber-600", border: "border-neon-amber/40", glow: "hover:shadow-[0_0_30px_oklch(0.82_0.18_80/0.3)]", text: "text-neon-amber", sample: "India's dancing cop hits 50M views", heat: "VIRAL" },
  { name: "Entertainment", icon: Film, color: "from-pink-400 to-pink-600", border: "border-neon-magenta/40", glow: "hover:shadow-[0_0_30px_oklch(0.7_0.25_350/0.3)]", text: "text-neon-magenta", sample: "Box office explodes — 5 new blockbusters", heat: "HOT" },
  { name: "Celebrity", icon: Star, color: "from-violet-400 to-violet-600", border: "border-neon-violet/40", glow: "hover:shadow-[0_0_30px_oklch(0.6_0.25_300/0.3)]", text: "text-neon-violet", sample: "Hollywood A-lister spotted in secret meeting", heat: "RISING" },
  { name: "Gossip", icon: MessageCircle, color: "from-amber-300 to-orange-500", border: "border-neon-amber/40", glow: "hover:shadow-[0_0_30px_oklch(0.82_0.18_80/0.3)]", text: "text-neon-amber", sample: "Bollywood's biggest couple splits — fans in shock", heat: "HOT" },
  { name: "Weather", icon: CloudLightning, color: "from-green-400 to-emerald-600", border: "border-neon-green/40", glow: "hover:shadow-[0_0_30px_oklch(0.8_0.2_150/0.3)]", text: "text-neon-green", sample: "Barrie hits -30°C — residents build snow forts", heat: "ALERT" },
  { name: "Business", icon: Briefcase, color: "from-emerald-400 to-teal-600", border: "border-neon-cyan/40", glow: "hover:shadow-[0_0_30px_oklch(0.75_0.15_175/0.3)]", text: "text-neon-cyan", sample: "Bitcoin surges past $120K — crypto markets on fire", heat: "SURGE" },
  { name: "Sports", icon: Trophy, color: "from-blue-400 to-indigo-600", border: "border-blue-400/40", glow: "hover:shadow-[0_0_30px_oklch(0.65_0.2_260/0.3)]", text: "text-blue-400", sample: "Super Bowl LX — Chiefs vs Eagles epic rematch", heat: "LIVE" },
];

export default function TrendingCategories() {
  const { t } = useLanguage();
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Section header */}
      <div className="container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-neon-cyan font-display text-sm font-bold tracking-widest uppercase mb-3 block">
              {t("trending.label")}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
              {t("trending.title1")}{" "}
              <span className="text-neon-magenta text-glow-magenta">{t("trending.title2")}</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg text-lg">
              From crime busts to viral fails, celebrity drama to extreme weather, stock market surges to crypto explosions, 
              billion-dollar startups to trending apps — every category ranked, every story AI-summarized, every trend tracked in real time.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-display font-bold">
              <span className="live-dot w-2 h-2 rounded-full bg-neon-cyan inline-block" />
              2,847 stories trending now
            </span>
          </div>
        </motion.div>
      </div>

      {/* Category cards grid */}
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group glass-card rounded-xl p-5 ${cat.border} ${cat.glow} transition-all cursor-pointer hover:scale-[1.03] hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${cat.text} bg-current/10 border border-current/20`}>
                  {cat.heat}
                </span>
              </div>
              <h3 className={`font-display font-bold text-lg ${cat.text} mb-2`}>{cat.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{cat.sample}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">Top 10</span>
                <span className="text-neon-cyan/30">|</span>
                <span>Global + Local</span>
              </div>
            </motion.div>
          ))}
          {/* "All Categories" card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.64 }}
            className="group glass-card rounded-xl p-5 border-dashed border-neon-cyan/20 hover:border-neon-cyan/40 transition-all cursor-pointer hover:scale-[1.03] hover:-translate-y-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center mb-3">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <span className="font-display font-bold text-neon-cyan">{t("trending.exploreAll")}</span>
            <span className="text-xs text-muted-foreground mt-1">{t("trending.diveDeeper")}</span>
          </motion.div>
        </div>
      </div>

      {/* Full-width cards showcase image */}
      <div className="container mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          <img src={NEWS_CARDS_IMG} alt="Trending news cards" className="w-full h-auto rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <span className="text-sm font-display text-foreground/80">{t("trending.swipe")}</span>
            <span className="text-xs font-mono text-neon-cyan">← SWIPE →</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

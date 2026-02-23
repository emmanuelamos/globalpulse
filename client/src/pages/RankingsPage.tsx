import { useState } from "react";
import { motion } from "framer-motion";
import {
  Siren, Flame, Smile, Thermometer, Star, MessageCircle, Tv, Briefcase, Trophy, BarChart3, Globe
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import CategoryRankings from "@/components/CategoryRankings";
import { CATEGORIES } from "@/lib/mockData"; 
import OGMeta from "@/components/OGMeta";
// 1. Import the hook
import { useLanguage } from "@/contexts/LanguageContext";

const CATEGORY_ICONS: Record<string, any> = {
  crime: Siren,
  trending: Flame,
  funny: Smile,
  entertainment: Tv,
  celebrity: Star,
  gossip: MessageCircle,
  weather: Thermometer,
  business: Briefcase,
  sports: Trophy,
};

const CATEGORY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  crime: { color: "text-red-400", bg: "from-red-600/20 to-red-900/20", border: "border-red-500/30" },
  trending: { color: "text-orange-400", bg: "from-orange-600/20 to-orange-900/20", border: "border-orange-500/30" },
  funny: { color: "text-yellow-400", bg: "from-yellow-600/20 to-yellow-900/20", border: "border-yellow-500/30" },
  entertainment: { color: "text-purple-400", bg: "from-purple-600/20 to-purple-900/20", border: "border-purple-500/30" },
  celebrity: { color: "text-amber-400", bg: "from-amber-600/20 to-amber-900/20", border: "border-amber-500/30" },
  gossip: { color: "text-pink-400", bg: "from-pink-600/20 to-pink-900/20", border: "border-pink-500/30" },
  weather: { color: "text-cyan-400", bg: "from-cyan-600/20 to-cyan-900/20", border: "border-cyan-500/30" },
  business: { color: "text-emerald-400", bg: "from-emerald-600/20 to-emerald-900/20", border: "border-emerald-500/30" },
  sports: { color: "text-blue-400", bg: "from-blue-600/20 to-indigo-900/20", border: "border-blue-500/30" },
};

export default function RankingsPage() {
  const { t } = useLanguage(); // 2. Initialize translation
  const [activeCategory, setActiveCategory] = useState("crime");
  const [timePeriod] = useState("Today");

  const style = CATEGORY_STYLES[activeCategory] || CATEGORY_STYLES.crime;
  const Icon = CATEGORY_ICONS[activeCategory] || BarChart3;
  const catData = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <AppLayout>
      <OGMeta category="main" title="GlobalPulse — Global Rankings" description="Live global rankings across 9 categories." />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${style.bg}`}>
              <Icon className={`w-6 h-6 ${style.color}`} />
            </div>
            {/* 3. Translated Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold font-display">{t("trendsPage.globalRankings")}</h1>
          </div>
          <p className="text-muted-foreground">
            {/* Note: You can add this key to your JSON dictionaries */}
            {t("trendsPage.subtitle")}
          </p>
        </motion.div>

        {/* Category Selection */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            {CATEGORIES.map(cat => {
              const catStyle = CATEGORY_STYLES[cat.id] || CATEGORY_STYLES.crime;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? `bg-gradient-to-r ${catStyle.bg} ${catStyle.color} border ${catStyle.border} shadow-lg shadow-black/40`
                      : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span> {t(`cat.${cat.id}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 border border-white/10 text-neon-cyan">
            {/* 4. Live Label */}
            {t("trendsPage.live").toUpperCase()}: {timePeriod}
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground italic">
            <Globe className="w-4 h-4 text-neon-cyan" />
            <span>Interactive: Click rows to explore</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`rounded-2xl border ${style.border} bg-black/40 backdrop-blur-md p-6 min-h-[600px]`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{catData?.emoji}</span>
                <h2 className="text-xl font-bold font-display">{t(`cat.${activeCategory}`)} {t("trendsPage.rankings")}</h2>
              </div>
              
              <CategoryRankings category={activeCategory} maxItems={20} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Context / AI Insight */}
            <div className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-sm font-semibold text-neon-cyan uppercase tracking-tighter">Live Insight</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our Pulse Engine is currently aggregating data for <strong>{t(`cat.${activeCategory}`)}</strong>. 
                Recent spikes in activity suggest shifting trends in the {activeCategory === 'weather' ? 'Northern Hemisphere' : 'Emerging Markets'}. 
                Updates occur every 5 minutes.
              </p>
            </div>

            {/* Verification Stats */}
            <div className="rounded-2xl border border-border/30 bg-card/30 p-5">
              <h3 className="text-xs font-bold mb-4 text-muted-foreground uppercase tracking-widest">Network Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Global Nodes</span>
                  <span className="font-mono font-bold text-neon-cyan text-sm">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last DB Sync</span>
                  <span className="font-mono text-xs text-white">Just Now</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/30 bg-card/30 p-5">
              <h3 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-widest">Methodology</h3>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Rankings are calculated using a weighted Heat Score ($$H$$) based on frequency, sentiment, and source reliability:
              </p>
              <div className="mt-2 p-2 bg-black/40 rounded font-mono text-[10px] text-neon-magenta">
                {`$$H = \\sum_{i=1}^{n} (V_i \\times R_i) \\times e^{-\\lambda t}$$`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
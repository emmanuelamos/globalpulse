/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Rankings dashboard preview — animated leaderboard with 9 ranking categories
 * Shows live-updating rankings with country flags and trend arrows
 */
import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Siren, Flame, Smile, Thermometer, Sun, Wind, TrendingUp, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RANKINGS_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/ZssTRmQxKAJEj5VSkQfJny/sandbox/ONZFVijnF85DwNUEwqPtFq-img-3_1770540966000_na1fn_cmFua2luZ3MtZGFzaGJvYXJk.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWnNzVFJtUXhLQUpFajVWU2tRZkpueS9zYW5kYm94L09OWkZWaWpuRjg1RHdOVUV3cVB0RnEtaW1nLTNfMTc3MDU0MDk2NjAwMF9uYTFmbl9jbUZ1YTJsdVozTXRaR0Z6YUdKdllYSmsuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NtfDN~HKOa95PAHlIoW8ITWe1XRmbYPQvTlgIymemNKlWgk7xLNZVItX1yh8RdCBlWwVU29iTcWFMcYtY3fy7z2ek1TgVI9hQY3K3W4XwV5Wx5VfiAyvax8B0MbvvmuuYpXiVqz8OMTiA~NiDTYAZGrBpMxqHJVMmOA602jAB3ae8cYkvAZy-SQXfQkzuJQ4BbtiOJ1T6OrJ67wojqmoZrSfs8ud4mY9cmRs44OjfnJh162aZUDihF0rMnq40sDRhk7ZSsQd~xk0ynt46nrVZiCmbEWlnX~TCOSD~FMWO1t27UErbZzV2gkOiSAf7yz5WkzxKKQU3buNXWQGLZ9n0w__";

const RANKING_TABS = [
  { id: "crime", label: "Highest Crime", icon: Siren, color: "text-neon-red" },
  { id: "safest", label: "Safest", icon: Shield, color: "text-neon-green" },
  { id: "violent", label: "Most Violent", icon: Flame, color: "text-neon-red" },
  { id: "fun", label: "Fun Vibes", icon: Smile, color: "text-neon-amber" },
  { id: "coldest", label: "Coldest", icon: Thermometer, color: "text-neon-cyan" },
  { id: "hottest", label: "Hottest", icon: Sun, color: "text-neon-amber" },
  { id: "calmest", label: "Calmest Weather", icon: Wind, color: "text-neon-green" },
  { id: "business", label: "Top Markets", icon: TrendingUp, color: "text-neon-cyan" },
  { id: "sports", label: "Top Sports", icon: Trophy, color: "text-blue-400" },
];

const MOCK_RANKINGS: Record<string, Array<{ rank: number; name: string; flag: string; stat: string; trend: "up" | "down" | "same" }>> = {
  crime: [
    { rank: 1, name: "Brazil", flag: "🇧🇷", stat: "487/100k", trend: "up" },
    { rank: 2, name: "South Africa", flag: "🇿🇦", stat: "412/100k", trend: "same" },
    { rank: 3, name: "Mexico", flag: "🇲🇽", stat: "389/100k", trend: "up" },
    { rank: 4, name: "Colombia", flag: "🇨🇴", stat: "356/100k", trend: "down" },
    { rank: 5, name: "USA", flag: "🇺🇸", stat: "312/100k", trend: "up" },
  ],
  safest: [
    { rank: 1, name: "Japan", flag: "🇯🇵", stat: "Score: 98.2", trend: "same" },
    { rank: 2, name: "Singapore", flag: "🇸🇬", stat: "Score: 97.1", trend: "up" },
    { rank: 3, name: "Switzerland", flag: "🇨🇭", stat: "Score: 96.8", trend: "same" },
    { rank: 4, name: "Iceland", flag: "🇮🇸", stat: "Score: 96.3", trend: "down" },
    { rank: 5, name: "Canada", flag: "🇨🇦", stat: "Score: 94.7", trend: "up" },
  ],
  violent: [
    { rank: 1, name: "Venezuela", flag: "🇻🇪", stat: "Spike +23%", trend: "up" },
    { rank: 2, name: "Honduras", flag: "🇭🇳", stat: "Spike +18%", trend: "up" },
    { rank: 3, name: "El Salvador", flag: "🇸🇻", stat: "Spike +12%", trend: "down" },
    { rank: 4, name: "Nigeria", flag: "🇳🇬", stat: "Spike +9%", trend: "up" },
    { rank: 5, name: "Afghanistan", flag: "🇦🇫", stat: "Spike +7%", trend: "same" },
  ],
  fun: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "Vibe: 94/100", trend: "up" },
    { rank: 2, name: "India", flag: "🇮🇳", stat: "Vibe: 91/100", trend: "up" },
    { rank: 3, name: "UK", flag: "🇬🇧", stat: "Vibe: 88/100", trend: "same" },
    { rank: 4, name: "Brazil", flag: "🇧🇷", stat: "Vibe: 87/100", trend: "up" },
    { rank: 5, name: "Nigeria", flag: "🇳🇬", stat: "Vibe: 85/100", trend: "up" },
  ],
  coldest: [
    { rank: 1, name: "Russia", flag: "🇷🇺", stat: "-48°C", trend: "same" },
    { rank: 2, name: "Canada", flag: "🇨🇦", stat: "-38°C", trend: "up" },
    { rank: 3, name: "Mongolia", flag: "🇲🇳", stat: "-35°C", trend: "down" },
    { rank: 4, name: "Finland", flag: "🇫🇮", stat: "-29°C", trend: "same" },
    { rank: 5, name: "Norway", flag: "🇳🇴", stat: "-26°C", trend: "up" },
  ],
  hottest: [
    { rank: 1, name: "Kuwait", flag: "🇰🇼", stat: "52°C", trend: "up" },
    { rank: 2, name: "Iraq", flag: "🇮🇶", stat: "51°C", trend: "same" },
    { rank: 3, name: "Saudi Arabia", flag: "🇸🇦", stat: "50°C", trend: "up" },
    { rank: 4, name: "India", flag: "🇮🇳", stat: "48°C", trend: "up" },
    { rank: 5, name: "Nigeria", flag: "🇳🇬", stat: "42°C", trend: "same" },
  ],
  calmest: [
    { rank: 1, name: "Singapore", flag: "🇸🇬", stat: "Calm: 97", trend: "same" },
    { rank: 2, name: "Hawaii (US)", flag: "🇺🇸", stat: "Calm: 95", trend: "up" },
    { rank: 3, name: "Canary Islands", flag: "🇪🇸", stat: "Calm: 93", trend: "same" },
    { rank: 4, name: "Maldives", flag: "🇲🇻", stat: "Calm: 91", trend: "down" },
    { rank: 5, name: "Costa Rica", flag: "🇨🇷", stat: "Calm: 89", trend: "up" },
  ],
  business: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "S&P +2.4%", trend: "up" },
    { rank: 2, name: "Nigeria", flag: "🇳🇬", stat: "NGX +3.1%", trend: "up" },
    { rank: 3, name: "India", flag: "🇮🇳", stat: "Sensex +1.8%", trend: "up" },
    { rank: 4, name: "Canada", flag: "🇨🇦", stat: "TSX +1.2%", trend: "same" },
    { rank: 5, name: "Japan", flag: "🇯🇵", stat: "Nikkei +0.9%", trend: "down" },
  ],
  sports: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "Sports: 99", trend: "up" },
    { rank: 2, name: "UK", flag: "🇬🇧", stat: "Sports: 97", trend: "up" },
    { rank: 3, name: "Brazil", flag: "🇧🇷", stat: "Sports: 96", trend: "same" },
    { rank: 4, name: "Germany", flag: "🇩🇪", stat: "Sports: 93", trend: "up" },
    { rank: 5, name: "Spain", flag: "🇪🇸", stat: "Sports: 92", trend: "same" },
  ],
};

const TIME_FILTERS = ["Today", "This Week", "This Month", "This Year"];

export default function RankingsSection() {
  const [activeTab, setActiveTab] = useState("crime");
  const { t } = useLanguage();
  const [activeTime, setActiveTime] = useState("Today");
  const rankings = MOCK_RANKINGS[activeTab] || MOCK_RANKINGS.crime;
  const activeTabData = RANKING_TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="relative py-24">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/50 to-transparent pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-neon-amber font-display text-sm font-bold tracking-widest uppercase mb-3 block">
            {t("rankings.label")}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
            {t("rankings.title1")}{" "}
            <span className="text-neon-cyan text-glow-cyan">{t("rankings.title2")}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            {t("rankings.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Dashboard image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative rounded-2xl overflow-hidden"
          >
            <img src={RANKINGS_IMG} alt="Rankings dashboard" className="w-full h-full object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60" />
          </motion.div>

          {/* Right: Interactive rankings */}
          <div className="lg:col-span-3">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {RANKING_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
                    activeTab === tab.id
                      ? `${tab.color} bg-current/10 border border-current/30`
                      : "text-muted-foreground hover:text-foreground bg-secondary/50 border border-transparent"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Time filters */}
            <div className="flex gap-2 mb-6">
              {TIME_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTime(t)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                    activeTime === t
                      ? "text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Rankings list */}
            <div className="space-y-2">
              {rankings.map((item, i) => (
                <motion.div
                  key={`${activeTab}-${item.rank}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-xl px-5 py-4 flex items-center gap-4 hover:border-neon-cyan/30 transition-all group cursor-pointer"
                >
                  {/* Rank number */}
                  <span className={`font-mono font-bold text-2xl w-8 text-center ${i === 0 ? "text-neon-amber" : i === 1 ? "text-foreground/60" : i === 2 ? "text-neon-amber/60" : "text-muted-foreground"}`}>
                    {item.rank}
                  </span>
                  {/* Flag */}
                  <span className="text-3xl">{item.flag}</span>
                  {/* Name */}
                  <span className="font-display font-bold text-foreground flex-1">{item.name}</span>
                  {/* Stat */}
                  <span className={`font-mono text-sm ${activeTabData.color}`}>{item.stat}</span>
                  {/* Trend */}
                  <span className={`text-sm font-bold ${item.trend === "up" ? "text-neon-red" : item.trend === "down" ? "text-neon-green" : "text-muted-foreground"}`}>
                    {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "—"}
                  </span>
                  {/* Why button */}
                  <button className="text-[10px] font-display font-bold px-2 py-1 rounded-md bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    WHY?
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Drill down hint */}
            <div className="mt-6 text-center">
              <span className="text-xs text-muted-foreground font-display">
                Drill down: <span className="text-neon-cyan">Global</span> → <span className="text-neon-cyan">Country</span> → <span className="text-neon-cyan">State</span> → <span className="text-neon-cyan">City</span> → <span className="text-neon-cyan">Neighborhood</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Business Page — Drill-down into business sub-categories.
 * RANKINGS FIRST (our USP), then market data, then stories.
 * Stocks, Crypto, Trending Apps, Startups, Products.
 * Global view + per-country filtering.
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, TrendingUp, Bitcoin, Smartphone, Rocket, ShoppingBag,
  Globe, ChevronDown, ArrowUp, ArrowDown, Minus, BarChart3, Newspaper
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StoryCard from "@/components/StoryCard";
import CategoryRankings from "@/components/CategoryRankings";
import { MOCK_STORIES, BUSINESS_SUBCATEGORIES, COUNTRIES } from "@/lib/mockData";
import OGMeta from "@/components/OGMeta";

const SUBCATEGORY_ICONS: Record<string, React.ReactNode> = {
  stocks: <TrendingUp className="w-5 h-5" />,
  crypto: <Bitcoin className="w-5 h-5" />,
  apps: <Smartphone className="w-5 h-5" />,
  startups: <Rocket className="w-5 h-5" />,
  products: <ShoppingBag className="w-5 h-5" />,
};

const MOCK_MARKET_DATA = [
  { name: "S&P 500", value: "5,892", change: "+2.4%", trend: "up" as const, country: "US", flag: "🇺🇸" },
  { name: "NGX All-Share", value: "98,432", change: "+3.1%", trend: "up" as const, country: "NG", flag: "🇳🇬" },
  { name: "Sensex", value: "78,234", change: "+1.8%", trend: "up" as const, country: "IN", flag: "🇮🇳" },
  { name: "TSX", value: "22,891", change: "+1.2%", trend: "up" as const, country: "CA", flag: "🇨🇦" },
  { name: "Nikkei 225", value: "39,456", change: "-0.3%", trend: "down" as const, country: "JP", flag: "🇯🇵" },
  { name: "FTSE 100", value: "8,234", change: "+0.8%", trend: "up" as const, country: "GB", flag: "🇬🇧" },
  { name: "DAX", value: "18,567", change: "+1.5%", trend: "up" as const, country: "DE", flag: "🇩🇪" },
  { name: "Bitcoin", value: "$95,200", change: "+12.3%", trend: "up" as const, country: "US", flag: "₿" },
  { name: "Ethereum", value: "$4,890", change: "+8.1%", trend: "up" as const, country: "US", flag: "Ξ" },
];

export default function BusinessPage() {
  const [activeSub, setActiveSub] = useState("all");
  const [activeCountry, setActiveCountry] = useState("all");
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [activeView, setActiveView] = useState<"rankings" | "stories">("rankings");

  const businessStories = useMemo(() => {
    let stories = MOCK_STORIES.filter(s => s.category === "business");
    if (activeSub !== "all") {
      stories = stories.filter(s => s.businessSubcategory === activeSub);
    }
    if (activeCountry !== "all") {
      stories = stories.filter(s => s.country === activeCountry);
    }
    return stories.sort((a, b) => b.heatScore - a.heatScore);
  }, [activeSub, activeCountry]);

  const filteredMarkets = useMemo(() => {
    if (activeCountry === "all") return MOCK_MARKET_DATA;
    return MOCK_MARKET_DATA.filter(m => m.country === activeCountry);
  }, [activeCountry]);

  return (
    <AppLayout>
      <OGMeta category="business" />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-700">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Business</h1>
            <span className="text-2xl">💼</span>
          </div>
          <p className="text-muted-foreground">
            Trending stocks, crypto, startups, apps, and products — ranked by what's hot right now.
          </p>
        </motion.div>

        {/* Live Market Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Markets
          </h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {filteredMarkets.map((market, i) => (
                <motion.div
                  key={market.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="shrink-0 p-3 rounded-xl bg-card/50 border border-border/30 min-w-[160px] hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{market.flag}</span>
                    <span className="text-xs font-semibold text-muted-foreground">{market.name}</span>
                  </div>
                  <div className="font-mono font-bold text-lg">{market.value}</div>
                  <div className={`flex items-center gap-1 text-sm font-mono font-semibold ${
                    market.trend === "up" ? "text-green-400" : market.trend === "down" ? "text-red-400" : "text-muted-foreground"
                  }`}>
                    {market.trend === "up" ? <ArrowUp className="w-3 h-3" /> : market.trend === "down" ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {market.change}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sub-category Tabs */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setActiveSub("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeSub === "all"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-700 text-white shadow-lg"
                  : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-emerald-500/40"
              }`}
            >
              All Business
            </button>
            {BUSINESS_SUBCATEGORIES.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeSub === sub.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-700 text-white shadow-lg"
                    : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-emerald-500/40"
                }`}
              >
                {SUBCATEGORY_ICONS[sub.id]} {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle + Country Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex rounded-xl overflow-hidden border border-border/30">
            <button
              onClick={() => setActiveView("rankings")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                activeView === "rankings"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-700 text-white"
                  : "bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Rankings
            </button>
            <button
              onClick={() => setActiveView("stories")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                activeView === "stories"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-700 text-white"
                  : "bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Stories
            </button>
          </div>

          <button
            onClick={() => setShowCountryFilter(!showCountryFilter)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/30 text-sm font-semibold hover:border-emerald-500/40 transition-all"
          >
            <Globe className="w-4 h-4" />
            {activeCountry === "all" ? "Global" : COUNTRIES.find(c => c.code === activeCountry)?.flag + " " + COUNTRIES.find(c => c.code === activeCountry)?.name}
            <ChevronDown className={`w-4 h-4 transition-transform ${showCountryFilter ? "rotate-180" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {showCountryFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-card/30 border border-border/30">
                <button
                  onClick={() => { setActiveCountry("all"); setShowCountryFilter(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    activeCountry === "all" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-card/50 border border-border/30 hover:border-emerald-500/40"
                  }`}
                >
                  🌍 Global
                </button>
                {COUNTRIES.map(country => (
                  <button
                    key={country.code}
                    onClick={() => { setActiveCountry(country.code); setShowCountryFilter(false); }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      activeCountry === country.code ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-card/50 border border-border/30 hover:border-emerald-500/40"
                    }`}
                  >
                    {country.flag} {country.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === "rankings" ? (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 to-teal-900/10 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">💼</span>
                    <div>
                      <h2 className="text-xl font-bold font-display">Business Rankings</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Global → Country → State/Province → City</p>
                    </div>
                    <span className="ml-auto text-xs font-mono text-emerald-400">TOP 10-20</span>
                  </div>
                  <CategoryRankings category="business" maxItems={20} />
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveView("stories")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/50 border border-border/30 text-sm font-semibold hover:border-emerald-500/40 transition-all"
                >
                  <Newspaper className="w-4 h-4" />
                  View Business Stories
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {businessStories.map((story, i) => (
                    <StoryCard key={story.id} story={story} index={i} />
                  ))}
                </AnimatePresence>
              </div>

              {businessStories.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold mb-2">No business stories found</h3>
                  <p className="text-muted-foreground">Try a different sub-category or country.</p>
                </motion.div>
              )}

              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveView("rankings")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/50 border border-border/30 text-sm font-semibold hover:border-emerald-500/40 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Rankings
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

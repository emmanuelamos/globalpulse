/**
 * Sports Page — Drill-down into sports sub-categories.
 * RANKINGS FIRST (our USP), then live scores ticker, then stories.
 * Football/Soccer, Basketball, American Football, F1, Tennis, MMA/Boxing, Olympics.
 * Global view + per-country filtering.
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Globe, ChevronDown, BarChart3, Newspaper,
  Flame, Timer, Medal
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StoryCard from "@/components/StoryCard";
import CategoryRankings from "@/components/CategoryRankings";
import { MOCK_STORIES, SPORTS_SUBCATEGORIES, COUNTRIES } from "@/lib/mockData";
import OGMeta from "@/components/OGMeta";

const SUBCATEGORY_ICONS: Record<string, React.ReactNode> = {
  football: <span className="text-lg">⚽</span>,
  basketball: <span className="text-lg">🏀</span>,
  american_football: <span className="text-lg">🏈</span>,
  f1: <span className="text-lg">🏎️</span>,
  tennis: <span className="text-lg">🎾</span>,
  mma: <span className="text-lg">🥊</span>,
  olympics: <span className="text-lg">🥇</span>,
};

const MOCK_LIVE_SCORES = [
  { event: "Chiefs vs Eagles", league: "NFL", status: "LIVE Q3", score: "21-17", sport: "american_football", flag: "🏈" },
  { event: "Liverpool vs Leicester", league: "Premier League", status: "FT", score: "0-4", sport: "football", flag: "⚽" },
  { event: "Lakers vs Celtics", league: "NBA", status: "LIVE Q4", score: "119-112", sport: "basketball", flag: "🏀" },
  { event: "Bahrain GP", league: "Formula 1", status: "FINISHED", score: "Leclerc P1", sport: "f1", flag: "🏎️" },
  { event: "UFC 310 Main", league: "UFC", status: "KO R1", score: "Usman Jr. wins", sport: "mma", flag: "🥊" },
  { event: "AUS Open Final", league: "ATP", status: "UPCOMING", score: "Sinner vs Alcaraz", sport: "tennis", flag: "🎾" },
  { event: "Real Madrid vs Barcelona", league: "La Liga", status: "LIVE 67'", score: "2-2", sport: "football", flag: "⚽" },
  { event: "Warriors vs Bucks", league: "NBA", status: "LIVE Q2", score: "54-48", sport: "basketball", flag: "🏀" },
];

export default function SportsPage() {
  const [activeSub, setActiveSub] = useState("all");
  const [activeCountry, setActiveCountry] = useState("all");
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [activeView, setActiveView] = useState<"rankings" | "stories">("rankings");

  const sportsStories = useMemo(() => {
    let stories = MOCK_STORIES.filter(s => s.category === "sports");
    if (activeSub !== "all") {
      stories = stories.filter(s => s.sportsSubcategory === activeSub);
    }
    if (activeCountry !== "all") {
      stories = stories.filter(s => s.country === activeCountry);
    }
    return stories.sort((a, b) => b.heatScore - a.heatScore);
  }, [activeSub, activeCountry]);

  const filteredScores = useMemo(() => {
    if (activeSub === "all") return MOCK_LIVE_SCORES;
    return MOCK_LIVE_SCORES.filter(s => s.sport === activeSub);
  }, [activeSub]);

  return (
    <AppLayout>
      <OGMeta category="sports" />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-700">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Sports</h1>
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-muted-foreground">
            NFL, Premier League, NBA, F1, UFC, Tennis — every sport ranked, every country scored.
          </p>
        </motion.div>

        {/* Live Scores Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Live Scores
          </h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {filteredScores.map((game, i) => (
                <motion.div
                  key={game.event}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="shrink-0 p-3 rounded-xl bg-card/50 border border-border/30 min-w-[180px] hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{game.flag}</span>
                    <span className="text-xs font-semibold text-muted-foreground">{game.league}</span>
                    <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      game.status.startsWith("LIVE") ? "bg-red-500/20 text-red-400" :
                      game.status === "UPCOMING" ? "bg-blue-500/20 text-blue-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {game.status}
                    </span>
                  </div>
                  <div className="font-semibold text-sm mb-0.5">{game.event}</div>
                  <div className="font-mono font-bold text-lg text-blue-400">{game.score}</div>
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
                  ? "bg-gradient-to-r from-blue-500 to-indigo-700 text-white shadow-lg"
                  : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-blue-500/40"
              }`}
            >
              All Sports
            </button>
            {SPORTS_SUBCATEGORIES.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeSub === sub.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-700 text-white shadow-lg"
                    : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-blue-500/40"
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
                  ? "bg-gradient-to-r from-blue-500 to-indigo-700 text-white"
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
                  ? "bg-gradient-to-r from-blue-500 to-indigo-700 text-white"
                  : "bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Stories
            </button>
          </div>

          <button
            onClick={() => setShowCountryFilter(!showCountryFilter)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/30 text-sm font-semibold hover:border-blue-500/40 transition-all"
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
                    activeCountry === "all" ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "bg-card/50 border border-border/30 hover:border-blue-500/40"
                  }`}
                >
                  🌍 Global
                </button>
                {COUNTRIES.map(country => (
                  <button
                    key={country.code}
                    onClick={() => { setActiveCountry(country.code); setShowCountryFilter(false); }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      activeCountry === country.code ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "bg-card/50 border border-border/30 hover:border-blue-500/40"
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
                <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 to-indigo-900/10 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h2 className="text-xl font-bold font-display">Sports Rankings</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Global → Country → State/Province → City</p>
                    </div>
                    <span className="ml-auto text-xs font-mono text-blue-400">TOP 10-20</span>
                  </div>
                  <CategoryRankings category="sports" maxItems={20} />
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveView("stories")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/50 border border-border/30 text-sm font-semibold hover:border-blue-500/40 transition-all"
                >
                  <Newspaper className="w-4 h-4" />
                  View Sports Stories
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
                  {sportsStories.map((story, i) => (
                    <StoryCard key={story.id} story={story} index={i} />
                  ))}
                </AnimatePresence>
              </div>

              {sportsStories.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="text-6xl mb-4">🏟️</div>
                  <h3 className="text-xl font-bold mb-2">No sports stories found</h3>
                  <p className="text-muted-foreground">Try a different sport or country.</p>
                </motion.div>
              )}

              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveView("rankings")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/50 border border-border/30 text-sm font-semibold hover:border-blue-500/40 transition-all"
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

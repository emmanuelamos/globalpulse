/**
 * Search Page — Instant search across all stories, categories, countries.
 * Type "Entertainment Canada" → instant results.
 */
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, Flame } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StoryCard from "@/components/StoryCard";
import { searchMockStories, MOCK_STORIES, CATEGORIES, COUNTRIES } from "@/lib/mockData";
import OGMeta from "@/components/OGMeta";

const TRENDING_SEARCHES = [
  "Bitcoin surge", "Taylor Swift tour", "Toronto heist",
  "AI girlfriend ban", "Nigeria fintech", "Florida man",
  "Crime Canada", "Weather Barrie", "Drake Kendrick",
];

const RECENT_SEARCHES_KEY = "globalpulse_recent_searches";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    } catch { return []; }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchMockStories(query);
  }, [query]);

  const handleSearch = (term: string) => {
    setQuery(term);
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <AppLayout showTicker={false}>
      <OGMeta title="GlobalPulse — Search" description="Search trending stories across 9 categories and every country. Find what the world is buzzing about." />
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && query.trim() && handleSearch(query.trim())}
              placeholder='Search stories, categories, countries... e.g. "Entertainment Canada"'
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-card/50 border border-border/30 text-lg focus:outline-none focus:border-neon-cyan/50 focus:shadow-lg focus:shadow-neon-cyan/10 transition-all placeholder:text-muted-foreground/50"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Quick category chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleSearch(cat.label)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-card/30 border border-border/20 hover:border-neon-cyan/30 transition-all"
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* No query — show trending + recent */}
        {!query.trim() && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Recent Searches
                  </h3>
                  <button onClick={clearRecent} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/50 border border-border/30 text-sm hover:border-neon-cyan/40 transition-all"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Trending Searches */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-neon-cyan" /> Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((term, i) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/50 border border-border/30 text-sm hover:border-neon-cyan/40 transition-all"
                  >
                    <Flame className="w-3 h-3 text-orange-400" />
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Top Stories */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-orange-400" /> Top Stories Right Now
              </h3>
              <div className="space-y-2">
                {MOCK_STORIES.slice(0, 5).map((story, i) => (
                  <StoryCard key={story.id} story={story} index={i} compact />
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Search Results */}
        {query.trim() && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Search className="w-4 h-4" />
              <span className="font-mono">{results.length}</span> results for "<span className="text-foreground font-semibold">{query}</span>"
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {results.map((story, i) => (
                    <StoryCard key={story.id} story={story} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground">Try different keywords or browse by category.</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

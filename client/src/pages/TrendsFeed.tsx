import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Globe, ChevronDown, TrendingUp, Zap, BarChart3, Newspaper } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StoryCard from "@/components/StoryCard";
import CategoryRankings from "@/components/CategoryRankings";
import { CATEGORIES, COUNTRIES } from "@/lib/mockData"; 
import { useRoute } from "wouter";
import OGMeta from "@/components/OGMeta";
// 1. Import the hook
import { useLanguage } from "@/contexts/LanguageContext";

export default function TrendsFeed() {
  const { t, language } = useLanguage(); // 2. Initialize translation tools
  const [, params] = useRoute("/trends/:category?");
  const initialCategory = params?.category || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeCountry, setActiveCountry] = useState("all");
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [activeView, setActiveView] = useState<"rankings" | "stories">("rankings");

  const ogCategory = activeCategory === "all" ? "trending" : activeCategory;
  
  const storiesQuery = trpc.stories.list.useQuery(
    {
      category: activeCategory === "all" ? undefined : activeCategory,
      country: activeCountry === "all" ? undefined : activeCountry,
      limit: 50,
      language: language.code, // 3. Pass language to the DB query
    },
    {
      placeholderData: (previousData) => previousData,
      refetchOnWindowFocus: false,
    }
  );
  
  const liveStories = storiesQuery.data || [];
  const isLoading = storiesQuery.isLoading;

  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <AppLayout>
      <OGMeta category={ogCategory} />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-magenta">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">
              {/* 4. Translated Title */}
              {activeCategory === "all" ? t("trendsPage.title") : t(`cat.${activeCategory}`)}
            </h1>
            {activeCategory !== "all" && (
              <span className="text-2xl">{activeCategoryData?.emoji}</span>
            )}
          </div>
          <p className="text-muted-foreground">
            {/* 5. Translated Subtitle */}
            {isLoading ? "..." : t("trendsPage.subtitle")}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-neon-cyan to-neon-magenta text-white shadow-lg shadow-neon-cyan/20"
                  : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-neon-cyan/40"
              }`}
            >
              <span className="flex items-center gap-1.5"><Flame className="w-4 h-4" /> {t("trendsPage.all")}</span>
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-neon-cyan/40"
                }`}
              >
                {/* 6. Use category translation keys */}
                <span className="flex items-center gap-1.5">{cat.emoji} {t(`cat.${cat.id}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex rounded-xl overflow-hidden border border-border/30">
            <button
              onClick={() => setActiveView("rankings")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                activeView === "rankings"
                  ? "bg-gradient-to-r from-neon-cyan to-neon-magenta text-white"
                  : "bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {t("trendsPage.rankings")}
            </button>
            <button
              onClick={() => setActiveView("stories")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                activeView === "stories"
                  ? "bg-gradient-to-r from-neon-cyan to-neon-magenta text-white"
                  : "bg-card/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              {t("trendsPage.stories")}
            </button>
          </div>

          {/* Country Filter */}
          <button
            onClick={() => setShowCountryFilter(!showCountryFilter)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/30 text-sm font-semibold hover:border-neon-cyan/40 transition-all"
          >
            <Globe className="w-4 h-4" />
            {activeCountry === "all" ? "Global" : COUNTRIES.find(c => c.code === activeCountry)?.flag + " " + COUNTRIES.find(c => c.code === activeCountry)?.name}
            <ChevronDown className={`w-4 h-4 transition-transform ${showCountryFilter ? "rotate-180" : ""}`} />
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono">{isLoading ? "..." : liveStories.length}</span> {t("trendsPage.live")}
          </div>
        </div>

        {/* List Content remains same, but titles within use t() */}
        <AnimatePresence mode="wait">
          {activeView === "rankings" ? (
            <motion.div key="rankings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {activeCategory === "all" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} className="rounded-2xl border border-border/30 bg-card/30 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">{cat.emoji}</span>
                        <h3 className="text-lg font-bold font-display">{t(`cat.${cat.id}`)}</h3>
                      </div>
                      <CategoryRankings category={cat.id} compact maxItems={5} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <CategoryRankings category={activeCategory} maxItems={20} />
                </div>
              )}
            </motion.div>
          ) :  (
            <motion.div key="stories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isLoading ? (
                // 1. Loading State (Skeletons)
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 rounded-2xl bg-card/50 animate-pulse border border-border/30" />
                  ))}
                </div>
              ) : (
                // 2. The Actual Stories Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveStories.map((story, i) => (
                    <StoryCard key={story.id} story={story} index={i} />
                  ))}
                </div>
              )}

              {/* 3. Empty State (Translated) */}
              {!isLoading && liveStories.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-bold mb-2">
                    {activeCategory === "all" ? "No live stories" : `No stories in ${t(`cat.${activeCategory}`)}`}
                  </h3>
                  <p className="text-muted-foreground">
                    Try switching the country filter or check back later.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
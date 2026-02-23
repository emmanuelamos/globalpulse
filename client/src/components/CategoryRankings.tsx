/**
 * Category Rankings — The core USP of GlobalPulse.
 * Shows ranked lists (e.g., Highest Market Growth, Coldest Cities)
 * strictly from the database.
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  MapPin,
  Globe,
  Building2,
  ArrowLeft,
} from "lucide-react";
// REMOVED: MOCK_RANKINGS and mock helpers
import { CATEGORY_RANKING_CONFIGS, COUNTRIES } from "@/lib/mockData";

type DrillLevel = "global" | "country" | "city";

interface CategoryRankingsProps {
  category: string;
  compact?: boolean;
  maxItems?: number;
}

// --- HELPER COMPONENTS ---

function TrendIcon({ trend }: { trend: "up" | "down" | "same" }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-400" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function RankBadge({ rank }: { rank: number }) {
  const colors = [
    "from-yellow-400 to-amber-600 text-black",
    "from-gray-300 to-gray-500 text-black",
    "from-amber-600 to-orange-800 text-white",
  ];
  if (rank <= 3) {
    return (
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[rank - 1]} flex items-center justify-center font-bold text-sm shrink-0 shadow-lg`}>
        {rank}
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-sm text-foreground/70 shrink-0 border border-white/5">
      {rank}
    </div>
  );
}

function RankingRow({
  item,
  onClick,
  canDrillDown,
  index,
}: {
  item: any; 
  onClick?: () => void; 
  canDrillDown: boolean; 
  index: number;
}) {
  const name = item.entityName || "Unknown";
  // Use the flag directly from DB (sync-service saves emojis) or fallback to Globe
  const flag = item.flag || "🌍";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={canDrillDown ? onClick : undefined}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border border-transparent ${
        canDrillDown 
          ? "cursor-pointer hover:bg-white/5 hover:border-white/10 active:scale-[0.99]" 
          : "opacity-90"
      } bg-black/20 backdrop-blur-sm`}
    >
      <RankBadge rank={item.rank} />
      <span className="text-2xl shrink-0 drop-shadow-md">{flag}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate text-sm md:text-base">{name}</p>
        <p className="text-xs text-foreground/50 font-mono tracking-wide uppercase">
          {item.stat || "Live Data"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <TrendIcon trend={item.trend || "same"} />
        {canDrillDown && <ChevronRight className="w-4 h-4 text-foreground/30" />}
      </div>
    </motion.div>
  );
}

// --- MAIN COMPONENT ---

export default function CategoryRankings({ category, compact = false, maxItems = 10 }: CategoryRankingsProps) {
  const { language, t } = useLanguage(); 
  
  const [level, setLevel] = useState<DrillLevel>("global");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState(0);

  const configs = CATEGORY_RANKING_CONFIGS[category] || [];
  const activeConfig = configs[activeSubTab];

  // Map UI labels to the ENUM keys your sync-service uses
  function getDbKey(): string {
    if (!activeConfig) return category;
    
    const mapping: Record<string, string> = {
      weather: "hottest",      
      hottest: "hottest",       
      coldest: "coldest",       
      calmest_weather: "calmest", 
      highest_crime: "crime", 
      safest: "safest", 
      most_violent: "violent",
      business: "business",
      top_markets: "business",
      entertainment: "fun",   
      top_entertainment: "fun",
      top_sports: "sports"
    };

    const key = mapping[activeConfig.id] || mapping[category] || category;
    console.log("📡 Fetching from DB with type:", key); // This will show in your browser console
    return key;
  }

  let targetEntityType = "country"; // Default for Business, Crime, etc.

  if (category === "weather") {
    targetEntityType = "city";
  } else if (category === "sports") {
    targetEntityType = "match"; // <--- MATCHES YOUR DB
  } else if (category === "fun" || category === "entertainment") {
    targetEntityType = "show";  // <--- MATCHES YOUR DB
  }
  else if (category === "celebrity" || category === "gossip") targetEntityType = "person";
  else if (category === "trending" || category === "funny") targetEntityType = "topic";

  // 1. Fetch REAL rankings
  const rankingsQuery = trpc.rankings.list.useQuery({
    type: getDbKey(), // This gets 'sports', 'fun', 'business', etc.
    entityType: targetEntityType, // Now sends 'match' or 'show' correctly
    country: selectedCountry || undefined,
    limit: maxItems,
    language: language.code,
  }, {
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });

  const displayData = rankingsQuery.data || [];
  console.log(displayData)
  const isLoading = rankingsQuery.isLoading && displayData.length === 0;

  // --- HANDLERS ---

  function handleDrillDown(item: any) {
    if (level === "global") {
      setSelectedCountry(item.entityName);
      setLevel("country");
    } else if (level === "country") {
      setSelectedState(item.entityName);
      setLevel("city");
    }
  }

  function goBack() {
    if (level === "city") {
      setSelectedState(null);
      setLevel("country");
    } else if (level === "country") {
      setSelectedCountry(null);
      setLevel("global");
    }
  }

  // --- UI ---

  const levelIcon = level === "global" ? <Globe className="w-4 h-4 text-neon-cyan" /> :
                    level === "country" ? <MapPin className="w-4 h-4 text-neon-magenta" /> :
                    <Building2 className="w-4 h-4 text-neon-amber" />;

  const levelLabel = level === "global" ? "Global Rankings" :
                     level === "country" ? `${selectedCountry}` :
                     `${selectedState}`;

  return (
    <div className={`${compact ? "" : "space-y-6"}`}>
      
      {/* Type Filter (e.g. Coldest vs Hottest) */}
      {configs.length > 1 && !compact && (
        <div className="flex flex-wrap gap-2 pb-2">
          {configs.map((config, i) => (
            <button
              key={config.id}
              onClick={() => {
                setActiveSubTab(i);
                setLevel("global");
                setSelectedCountry(null);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all border ${
                i === activeSubTab
                  ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan"
                  : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      )}

      {/* Header / Breadcrumbs */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-3">
          {level !== "global" && (
            <button onClick={goBack} className="flex items-center gap-1 pr-3 border-r border-white/10 text-muted-foreground hover:text-neon-cyan">
              <ArrowLeft className="w-4 h-4" />
              {t("nav.back") || "Back"}
            </button>
          )}
          <div className="flex items-center gap-2">
            {levelIcon}
            <span className="font-display font-bold uppercase tracking-wide">
              {levelLabel}
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${level}-${getDbKey()}`} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
               ))
            ) : displayData.length > 0 ? (
              displayData.map((item, i) => (
                <RankingRow
                  key={item.id || i}
                  item={item}
                  index={i}
                  canDrillDown={level !== "city"}
                  onClick={() => handleDrillDown(item)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                <Trophy className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">No Live Rankings Found</p>
                <p className="text-xs opacity-50">Try running the sync-service.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
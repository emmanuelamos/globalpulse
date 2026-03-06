import "dotenv/config";
import axios from "axios";
import { fileURLToPath } from "url";
import { getDb } from "../db"; 
import { stories, rankings } from "../../drizzle/schema"; 
import { eq } from "drizzle-orm";

// --- CONFIGURATION ---
const API_KEYS = {
  NEWS: process.env.NEWS_API_KEY,
  SERP: process.env.SERP_API_KEY, // Ensure this is in your .env
};

const CORE_CATEGORIES = [
  // --- Crime ---
  { id: "highest_crime", newsQuery: "crime rate", trendQuery: "highest crime rate" },
  { id: "safest", newsQuery: "safe cities", trendQuery: "safest countries to live" },
  { id: "most_violent", newsQuery: "violent crime", trendQuery: "violent crime" },

  // --- Trending ---
  { id: "most_trending", newsQuery: "trending news", trendQuery: "trending" },
  { id: "fastest_rising", newsQuery: "viral", trendQuery: "viral trends" },

  // --- Funny ---
  { id: "funniest", newsQuery: "funny news", trendQuery: "funny" },
  { id: "most_memes", newsQuery: "memes", trendQuery: "memes" },

  // --- Entertainment ---
  { id: "top_entertainment", newsQuery: "entertainment", trendQuery: "entertainment" },
  { id: "top_music", newsQuery: "music industry", trendQuery: "music" },
  { id: "top_film", newsQuery: "movies", trendQuery: "movies" },

  // --- Celebrity ---
  { id: "most_celeb_news", newsQuery: "celebrity news", trendQuery: "celebrities" },
  { id: "most_followed", newsQuery: "influencer", trendQuery: "influencers" },

  // --- Gossip ---
  { id: "hottest_gossip", newsQuery: "gossip", trendQuery: "gossip" },
  { id: "most_drama", newsQuery: "scandal", trendQuery: "scandal" },

  // --- Weather ---
  { id: "coldest", newsQuery: "cold weather", trendQuery: "coldest countries" },
  { id: "hottest", newsQuery: "heatwave", trendQuery: "hottest countries" },
  { id: "calmest_weather", newsQuery: "perfect weather", trendQuery: "best weather countries" },
  { id: "most_extreme", newsQuery: "extreme weather", trendQuery: "extreme weather" },

  // --- Business ---
  { id: "top_markets", newsQuery: "stock market", trendQuery: "stock market" },
  { id: "top_crypto", newsQuery: "cryptocurrency", trendQuery: "crypto" },
  { id: "top_startups", newsQuery: "startups", trendQuery: "startups" },
  { id: "top_apps", newsQuery: "trending apps", trendQuery: "apps" },

  // --- Sports ---
  { id: "top_sports_nations", newsQuery: "sports", trendQuery: "sports" },
  { id: "top_football", newsQuery: "football OR soccer", trendQuery: "football" },
  { id: "top_basketball", newsQuery: "basketball", trendQuery: "basketball" },
  { id: "top_combat", newsQuery: "MMA OR boxing", trendQuery: "UFC" }
];

const NEWS_CATEGORIES = [
  { id: "crime", newsQuery: "crime OR police" },
  { id: "trending", newsQuery: "breaking news OR trending" },
  { id: "funny", newsQuery: "weird news OR offbeat OR humor" },
  { id: "entertainment", newsQuery: "movies OR television OR entertainment" },
  { id: "celebrity", newsQuery: "celebrity OR red carpet" },
  { id: "gossip", newsQuery: "gossip OR scandal" },
  { id: "weather", newsQuery: "weather OR climate" },
  { id: "business", newsQuery: "economy OR stocks OR business" },
  { id: "sports", newsQuery: "sports OR tournament" }
];

// --- HELPERS ---
function getCountryFlag(code: string) {
  if (!code || code === "Global") return "🌍";
  if (code.length > 2) return "📍"; // Fallback for full country names
  let cleanCode = code === "UK" ? "GB" : code === "USA" ? "US" : code;
  const codePoints = cleanCode.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const truncate = (str: string | null | undefined, length: number) => {
  if (!str) return "";
  return str.length > length ? str.substring(0, length - 3) + "..." : str;
};


// ==========================================
// 1. RANKINGS: SerpApi (Google Trends Geo Map)
// ==========================================
async function syncAllRankingsViaSerpApi(db: any) {
  console.log("📊 Fetching Global Trends via SerpApi for ALL Categories...");

  for (const cat of CORE_CATEGORIES) {
    try {
      const res = await axios.get(`https://serpapi.com/search.json`, {
        params: {
          engine: "google_trends",
          q: cat.trendQuery,
          data_type: "GEO_MAP_0",
          api_key: API_KEYS.SERP
        }
      });

      const regions = res.data.interest_by_region || [];
      
      if (regions.length > 0) {
        // Clear old rankings for this category
        await db.delete(rankings).where(eq(rankings.type, cat.id as any));

        // Sort by interest value descending
        regions.sort((a: any, b: any) => b.value - a.value);

        for (let i = 0; i < Math.min(regions.length, 10); i++) {
          const r = regions[i];
          const countryCode = r.geo || "Global"; // SerpApi returns 2-letter ISO in 'geo'

          await db.insert(rankings).values({
            type: cat.id as any,
            rank: i + 1,
            entityName: r.location || "Global", // <--- CHANGE THIS LINE
            entityType: "country",
            country: countryCode,
            flag: getCountryFlag(countryCode), 
            stat: `Search Interest: ${r.value}/100`,
            trend: r.value > 75 ? "up" : r.value < 25 ? "down" : "same",
            updatedAt: new Date(),
          });
        }
        console.log(`   ✅ Synced ${cat.id.toUpperCase()} Rankings (Top: ${regions[0].location})`);
      }
    } catch (e: any) { 
      console.error(`⚠️ SerpApi fail for ${cat.id}: ${e.message}`);
      
      // FALLBACK: If API fails, insert a "Global" placeholder
      await db.insert(rankings).values({
          type: cat.id as any,
          rank: 1,
          entityName: "Global",
          entityType: "country",
          country: "Global",
          flag: "🌍", 
          stat: `Trending Now`,
          trend: "same",
          updatedAt: new Date(),
      });
    }
  }
}

// ==========================================
// 2. NEWS: NewsAPI
// ==========================================
async function syncAllStories(db: any) {
  console.log("📰 Syncing All 9 News Categories...");
  for (const cat of NEWS_CATEGORIES) {
    try {
      const res = await axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: cat.newsQuery,
          language: "en",
          sortBy: "relevancy",
          pageSize: 10,
          apiKey: API_KEYS.NEWS
        }
      });

      const articles = res.data.articles || [];
      for (const article of articles) {
        if (!article.title || article.title === "[Removed]") continue;
        await db.insert(stories).values({
          title: truncate(article.title, 200),
          summary: truncate(article.description, 400),
          category: cat.id as any,
          sourceName: article.source.name,
          sourceUrl: article.url,
          imageUrl: article.urlToImage,
          publishedAt: new Date(article.publishedAt),
          heatScore: Math.floor(Math.random() * 30) + 70
        });
      }
      // Brief pause to respect rate limits
      await new Promise(res => setTimeout(res, 2000));
    } catch (e: any) {
        console.error(`⚠️ NewsAPI fail for ${cat.id}: ${e.message}`);
    }
  }
  console.log("   ✅ News Sync Complete");
}

// --- ORCHESTRATOR ---
export async function performGlobalSync() {
  console.log("🌍 --- STARTING OPTIMIZED GLOBAL PULSE SYNC ---");
  const db = await getDb();
  if (!db) return;

  // Run SerpApi rankings and NewsAPI fetches concurrently
  await Promise.all([
      // syncAllRankingsViaSerpApi(db),
      syncAllStories(db)
  ]);

  console.log("🏁 --- GLOBAL PULSE SYNC COMPLETE ---");
}

// --- SINGLE ENTRY POINT ---
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const timeout = setTimeout(() => {
    console.error("❌ Sync timed out!");
    process.exit(1);
  }, 10 * 60 * 1000);

  performGlobalSync()
    .then(() => {
      clearTimeout(timeout);
      console.log("✅ Sync finished successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("💥 Sync crashed:", err);
      process.exit(1);
    });
}
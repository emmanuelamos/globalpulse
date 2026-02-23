import "dotenv/config";
import axios from "axios";
import YahooFinance from 'yahoo-finance2'; 
import { fileURLToPath } from "url";
import { getDb } from "../db"; 
import { stories, rankings } from "../../drizzle/schema"; 
import { eq } from "drizzle-orm";

// --- CONFIGURATION ---
const API_KEYS = {
  NEWS: process.env.NEWS_API_KEY,
  WEATHER: process.env.OPENWEATHER_KEY || process.env.OPENWEATHERMAP_API_KEY,
  TMDB: process.env.TMDB_API_KEY,
};

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// --- STRICT TYPES ---
// These MUST match the frontend activeConfig.id mapping
type RankingType = "business" | "crime" | "fun" | "hottest" | "coldest" | "calmest" | "safest" | "sports";

// --- HELPER: COUNTRY FLAGS ---
function getCountryFlag(code: string) {
  if (!code || code === "Global") return "🌍";
  if (code === "UK") code = "GB"; // Common mismatch fix
  if (code === "USA") code = "US";
  const codePoints = code.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// --- HELPER: TRUNCATE ---
const truncate = (str: string | null | undefined, length: number) => {
  if (!str) return "";
  return str.length > length ? str.substring(0, length - 3) + "..." : str;
};

// --- HELPER: KEYWORD EXTRACTOR ---
// Extracts capitalized words (potential names/topics) from a list of titles
function extractTopKeywords(titles: string[], excludeList: string[] = []): { word: string, count: number }[] {
  const stopWords = new Set(['The', 'A', 'An', 'In', 'On', 'At', 'For', 'To', 'Of', 'With', 'By', 'From', 'And', 'But', 'Or', 'Is', 'Are', 'Was', 'Were', 'Be', 'New', 'Daily', 'Weekly', 'Report', 'Breaking', 'Update', 'News', 'Live', 'Video', 'Photos', 'Global', 'World']);
  excludeList.forEach(w => stopWords.add(w));
  
  const counts: Record<string, number> = {};

  titles.forEach(title => {
    // Remove special chars and split
    const words = title.replace(/[^\w\s]/g, '').split(/\s+/);
    words.forEach(word => {
      // Logic: Must be capitalized, longer than 2 chars, and not a stop word
      if (word.length > 2 && /^[A-Z]/.test(word) && !stopWords.has(word)) {
        counts[word] = (counts[word] || 0) + 1;
      }
    });
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a) // Sort by count desc
    .slice(0, 5) // Top 5
    .map(([word, count]) => ({ word, count }));
}

// ==========================================
// 1. BUSINESS: Yahoo Finance
// ==========================================
async function syncBusinessRankings(db: any) {
  console.log("📈 Fetching Global Market Indices...");
  
  const GLOBAL_MARKETS = [
    { symbol: "^GSPC", country: "US", name: "USA", label: "S&P 500" },
    { symbol: "^GSPTSE", country: "CA", name: "Canada", label: "TSX" },
    { symbol: "^FTSE", country: "GB", name: "UK", label: "FTSE 100" },
    { symbol: "^GDAXI", country: "DE", name: "Germany", label: "DAX" },
    { symbol: "^N225", country: "JP", name: "Japan", label: "Nikkei 225" },
    { symbol: "^BSESN", country: "IN", name: "India", label: "Sensex" },
    { symbol: "^BVSP", country: "BR", name: "Brazil", label: "Bovespa" },
    { symbol: "^AXJO", country: "AU", name: "Australia", label: "ASX 200" },
    { symbol: "^KS11", country: "KR", name: "South Korea", label: "KOSPI" },
    { symbol: "000001.SS", country: "CN", name: "China", label: "Shanghai" },
  ];

  try {
    const marketData = [];
    for (const m of GLOBAL_MARKETS) {
      try {
        const quote = await yahooFinance.quote(m.symbol) as any;
        if (!quote) continue;

        const change = quote.regularMarketChangePercent || 0;
        marketData.push({
          ...m,
          change: change,
          stat: `${m.label} ${change > 0 ? "+" : ""}${change.toFixed(2)}%`
        });
      } catch (e) { /* silent fail for individual ticker */ }
    }

    if (marketData.length > 0) {
      await db.delete(rankings).where(eq(rankings.type, "business"));
      
      // Sort: Highest Growth First
      marketData.sort((a, b) => b.change - a.change);

      for (let i = 0; i < marketData.length; i++) {
        const item = marketData[i];
        let trend = "same";
        if (item.change > 0.05) trend = "up";
        if (item.change < -0.05) trend = "down";

        await db.insert(rankings).values({
          type: "business",
          rank: i + 1,
          entityName: item.name,
          entityType: "country", // Strictly 'country'
          country: item.country,
          flag: getCountryFlag(item.country),
          stat: item.stat,
          trend: trend,
          updatedAt: new Date(),
        });
      }
      console.log(`   ✅ Saved ${marketData.length} Business Rankings`);
    }
  } catch (e: any) { console.error(`❌ Business Sync Fail: ${e.message}`); }
}

// ==========================================
// 2. SPORTS: ESPN Hidden API (No Key Needed)
// ==========================================
async function syncSportsRankings(db: any) {
  console.log("⚽ Fetching Live Sports Scores...");

  const ENDPOINTS = [
    { league: "EPL", url: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard" },
    { league: "NBA", url: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard" },
    { league: "NFL", url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard" },
  ];

  let allMatches: any[] = [];

  for (const src of ENDPOINTS) {
    try {
      const res = await axios.get(src.url);
      const events = res.data.events || [];
      
      events.slice(0, 5).forEach((event: any) => {
        const c = event.competitions[0];
        const team1 = c.competitors[0].team.abbreviation;
        const score1 = c.competitors[0].score;
        const team2 = c.competitors[1].team.abbreviation;
        const score2 = c.competitors[1].score;
        const status = event.status.type.state === "in" ? "🔴 LIVE" : "Final";
        
        allMatches.push({
          name: `${team1} vs ${team2}`,
          stat: `${score1} - ${score2}`,
          status: status,
          league: src.league
        });
      });
    } catch (e) { /* ignore */ }
  }

  if (allMatches.length > 0) {
    await db.delete(rankings).where(eq(rankings.type, "sports"));

    // Insert Top 10 Matches
    for (let i = 0; i < Math.min(allMatches.length, 10); i++) {
      const m = allMatches[i];
      await db.insert(rankings).values({
        type: "sports",
        rank: i + 1,
        entityName: m.name,
        entityType: "match", // Special type, frontend handles this gracefully
        country: "Global",
        flag: "🏆",
        stat: `${m.league}: ${m.stat}`,
        trend: m.status === "🔴 LIVE" ? "up" : "same",
        updatedAt: new Date(),
      });
    }
    console.log(`   ✅ Saved ${allMatches.length} Sports Rankings`);
  }
}

// ==========================================
// 3. WEATHER: Hottest, Coldest, Calmest
// ==========================================
async function syncWeather(db: any) {
  if (!API_KEYS.WEATHER) return console.log("⚠️ No Weather Key");
  console.log("🌦️ Fetching Extreme Weather...");
  
  // A mix of typically hot, cold, and calm cities
  const CANDIDATES = [
    { name: "Yakutsk", country: "RU" }, { name: "Death Valley", country: "US" },
    { name: "Dubai", country: "AE" }, { name: "Singapore", country: "SG" },
    { name: "London", country: "GB" }, { name: "Reykjavik", country: "IS" },
    { name: "Bangkok", country: "TH" }, { name: "Cairo", country: "EG" },
    { name: "Sydney", country: "AU" }, { name: "Wellington", country: "NZ" },
    { name: "Zurich", country: "CH" }, { name: "Vancouver", country: "CA" },
    { name: "Honolulu", country: "US" }, { name: "Lisbon", country: "PT" }
  ];

  try {
    const weatherData = [];
    for (const city of CANDIDATES) {
      try {
        const res = await axios.get(
           `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${API_KEYS.WEATHER}`
        );
        weatherData.push({
          name: city.name,
          country: res.data.sys.country,
          temp: res.data.main.temp,
          wind: res.data.wind.speed, // m/s
          desc: res.data.weather[0].main
        });
      } catch (e) { /* skip */ }
    }

    // Helper to insert
    const insertRank = async (type: RankingType, data: any[], statFn: (d: any) => string) => {
      await db.delete(rankings).where(eq(rankings.type, type));
      for (let idx = 0; idx < data.length; idx++) {
        const item = data[idx];
        await db.insert(rankings).values({
          type: type,
          entityName: item.name,
          entityType: "city", // STRICTLY CITY
          stat: statFn(item),
          rank: idx + 1,
          country: item.country,
          flag: getCountryFlag(item.country),
          trend: "same",
          updatedAt: new Date(),
        });
      }
    };

    // 1. Coldest (Sort Temp Ascending)
    await insertRank('coldest', [...weatherData].sort((a, b) => a.temp - b.temp).slice(0, 5), (d) => `${Math.round(d.temp)}°C`);
    
    // 2. Hottest (Sort Temp Descending)
    await insertRank('hottest', [...weatherData].sort((a, b) => b.temp - a.temp).slice(0, 5), (d) => `${Math.round(d.temp)}°C`);

    // 3. Calmest (Sort Wind Speed Ascending)
    await insertRank('calmest', [...weatherData].sort((a, b) => a.wind - b.wind).slice(0, 5), (d) => `${d.wind} m/s Wind`);

    console.log("   ✅ Synced Weather Rankings (Hottest, Coldest, Calmest)");
  } catch (e: any) { console.error(`Weather Sync Error: ${e.message}`); }
}

// ==========================================
// 4. CRIME & SAFETY: Smart Fallback
// ==========================================
async function syncCrimeRankings(db: any) {
  console.log("🚨 Syncing Crime & Safety Index...");

  // HARDCODED BASELINE (Numbeo 2024 Data approximation)
  // This ensures the tab is populated even without a paid API Key
  const BASELINE_DATA = [
    { country: "VE", name: "Venezuela", crime: 82, safety: 18 },
    { country: "PG", name: "Papua New Guinea", crime: 79, safety: 21 },
    { country: "AF", name: "Afghanistan", crime: 78, safety: 22 },
    { country: "ZA", name: "South Africa", crime: 75, safety: 25 },
    { country: "BR", name: "Brazil", crime: 66, safety: 34 },
    { country: "QA", name: "Qatar", crime: 14, safety: 86 },
    { country: "AE", name: "UAE", crime: 15, safety: 85 },
    { country: "TW", name: "Taiwan", crime: 16, safety: 84 },
    { country: "CH", name: "Switzerland", crime: 20, safety: 80 },
    { country: "JP", name: "Japan", crime: 22, safety: 78 },
  ];

  try {
    // 1. Insert Highest Crime
    await db.delete(rankings).where(eq(rankings.type, "crime"));
    const highCrime = [...BASELINE_DATA].sort((a, b) => b.crime - a.crime).slice(0, 5);
    
    for (let i = 0; i < highCrime.length; i++) {
        await db.insert(rankings).values({
            type: "crime",
            entityName: highCrime[i].name,
            entityType: "country",
            stat: `Index: ${highCrime[i].crime}`,
            rank: i + 1,
            country: highCrime[i].country,
            flag: getCountryFlag(highCrime[i].country),
            trend: "up", // Assuming high crime is bad/up
            updatedAt: new Date()
        });
    }

    // 2. Insert Safest (Calmest/Safety)
    await db.delete(rankings).where(eq(rankings.type, "safest"));
    const safest = [...BASELINE_DATA].sort((a, b) => b.safety - a.safety).slice(0, 5);

    for (let i = 0; i < safest.length; i++) {
        await db.insert(rankings).values({
            type: "safest",
            entityName: safest[i].name,
            entityType: "country",
            stat: `Safety: ${safest[i].safety}`,
            rank: i + 1,
            country: safest[i].country,
            flag: getCountryFlag(safest[i].country),
            trend: "same",
            updatedAt: new Date()
        });
    }
    console.log("   ✅ Synced Crime & Safety (Baseline Data)");
  } catch(e) { console.error("Crime Sync Error"); }
}

// ==========================================
// 5. ENTERTAINMENT & FUN
// ==========================================
async function syncEntertainment(db: any) {
    if (!API_KEYS.TMDB) return;
    console.log("🎬 Fetching TMDB Trending...");

    try {
        const res = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEYS.TMDB}`);
        const items = res.data.results.slice(0, 5);

        await db.delete(rankings).where(eq(rankings.type, "fun"));
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const name = item.title || item.name;
            const origin = item.origin_country ? item.origin_country[0] : "US";
            
            await db.insert(rankings).values({
                type: "fun",
                entityName: truncate(name, 20),
                entityType: "show",
                stat: `Rating: ${item.vote_average?.toFixed(1) || 'N/A'}`,
                rank: i + 1,
                country: origin,
                flag: getCountryFlag(origin),
                trend: "up",
                updatedAt: new Date()
            });
        }
        console.log("   ✅ Synced Entertainment");
    } catch(e) {}
}

// ==========================================
// 6. NEWS STORIES SYNC (Aggregator)
// ==========================================
async function syncNewsStories(db: any, category: string, query: string) {
    if (!API_KEYS.NEWS) return;
    // console.log(`📰 Syncing Stories: ${category}...`);
    
    // We use 'everything' for broader topic coverage, 'top-headlines' for standard cats
    const isStandard = ['business', 'technology', 'sports', 'entertainment'].includes(category);
    const url = isStandard 
        ? `https://newsapi.org/v2/top-headlines?language=en&category=${category}&pageSize=10&apiKey=${API_KEYS.NEWS}`
        : `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEYS.NEWS}`;

    try {
        const res = await axios.get(url);
        const articles = res.data.articles || [];
        
        for (const article of articles) {
            if (!article.title || article.title === "[Removed]") continue;
            try {
                await db.insert(stories).values({
                    title: truncate(article.title, 200),
                    summary: truncate(article.description, 400),
                    category: category,
                    sourceName: article.source.name,
                    sourceUrl: article.url,
                    imageUrl: article.urlToImage,
                    publishedAt: new Date(article.publishedAt),
                    heatScore: Math.floor(Math.random() * 30) + 70 // Mock heat for now
                }).onDuplicateKeyUpdate({ set: { title: article.title } });
            } catch(e) {}
        }
    } catch(e) { 
        // Silent fail for news quotas 
    }
}

// ==========================================
// 7. BUZZ GENERATOR (Trending, Celeb, etc.)
// ==========================================
async function generateBuzzRankings(db: any) {
  console.log("🐝 Generating Buzz Rankings from Stories...");

  // Define specific mappings
  const SPECIAL_MAPPINGS = [
    { sourceCat: 'entertainment', rankType: 'celebrity', entityType: 'person' },
    { sourceCat: 'gossip', rankType: 'gossip', entityType: 'person' },
    { sourceCat: 'funny', rankType: 'funny', entityType: 'topic' }
  ];

  // 1. GENERATE SPECIFIC CATEGORIES (Celeb, Gossip, Funny)
  for (const map of SPECIAL_MAPPINGS) {
    try {
      const recentStories = await db.select().from(stories)
        .where(eq(stories.category, map.sourceCat as any))
        .limit(50); 

      if (recentStories.length === 0) continue;

      const topKeywords = extractTopKeywords(recentStories.map((s: any) => s.title));

      if (topKeywords.length > 0) {
        await db.delete(rankings).where(eq(rankings.type, map.rankType as any));
        for (let i = 0; i < topKeywords.length; i++) {
          await db.insert(rankings).values({
            type: map.rankType as any,
            entityName: topKeywords[i].word,
            entityType: map.entityType as any,
            stat: `${topKeywords[i].count} Mentions`,
            rank: i + 1,
            country: 'Global',
            flag: '💬', 
            trend: 'up',
            updatedAt: new Date()
          });
        }
        console.log(`   ✅ Generated ${map.rankType}: Top is "${topKeywords[0].word}"`);
      }
    } catch (e: any) { console.log(`   ⚠️ Failed ${map.rankType}: ${e.message}`); }
  }

  // 2. GENERATE "TRENDING" (Aggregating ALL categories for better results)
  try {
    // Fetch last 100 stories from ANY category
    const allStories = await db.select().from(stories)
      .orderBy(stories.publishedAt)
      .limit(100);

    if (allStories.length > 0) {
      const trendKeywords = extractTopKeywords(allStories.map((s: any) => s.title));

      if (trendKeywords.length > 0) {
        await db.delete(rankings).where(eq(rankings.type, 'trending'));
        
        for (let i = 0; i < trendKeywords.length; i++) {
           await db.insert(rankings).values({
            type: 'trending',
            entityName: trendKeywords[i].word,
            entityType: 'topic', // Ensure this matches schema
            stat: `${trendKeywords[i].count} Mentions`,
            rank: i + 1,
            country: 'Global',
            flag: '🔥', 
            trend: 'up',
            updatedAt: new Date()
          });
        }
        console.log(`   ✅ Generated trending: Top is "${trendKeywords[0].word}"`);
      }
    }
  } catch (e: any) { console.log(`   ⚠️ Failed Trending: ${e.message}`); }
}

// ==========================================
// MAIN ORCHESTRATOR
// ==========================================
export async function performGlobalSync() {
  console.log("🌍 --- STARTING GLOBAL PULSE SYNC ---");
  const db = await getDb();
  if (!db) return;

  // 1. Run Ranking Syncs (The Table Data)
  await Promise.all([
      syncBusinessRankings(db),
      syncWeather(db),
      syncCrimeRankings(db),
      syncSportsRankings(db),
      syncEntertainment(db)
  ]);

  // 2. Run Story Syncs (The News Feed)
  // We run these sequentially to avoid rate limits on free NewsAPI keys
  await syncNewsStories(db, "business", "market");
  await syncNewsStories(db, "technology", "tech");
  await syncNewsStories(db, "politics", "politics");
  await syncNewsStories(db, "science", "science");
  await syncNewsStories(db, "crime", "crime");
  await syncNewsStories(db, "funny", "weird news");

  await generateBuzzRankings(db);

  console.log("🏁 --- GLOBAL PULSE SYNC COMPLETE ---");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  performGlobalSync().then(() => process.exit(0));
}
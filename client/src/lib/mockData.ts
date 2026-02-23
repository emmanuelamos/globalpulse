/**
 * Mock data for GlobalPulse — replaces live API data until keys are provided.
 * Structured to match the database schema exactly for seamless swap.
 */

export type MockStory = {
  id: number;
  title: string;
  summary: string;
  aiSummary: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl: string;
  category: string;
  businessSubcategory?: string;
  sportsSubcategory?: string;
  country: string;
  countryFlag: string;
  city?: string;
  heatScore: number;
  rank: number;
  likesCount: number;
  commentsCount: number;
  publishedAt: string;
};

export type MockRanking = {
  rank: number;
  name: string;
  flag: string;
  stat: string;
  trend: "up" | "down" | "same";
  entityType: "country" | "state" | "city";
  country?: string;
  state?: string;
};

export type CategoryRankingConfig = {
  id: string;
  label: string;
  statLabel: string;
  description: string;
};

export const CATEGORIES = [
  { id: "crime", label: "Crime", emoji: "🔴", color: "from-red-600 to-red-900", textColor: "text-red-400" },
  { id: "trending", label: "Trending", emoji: "🔥", color: "from-orange-500 to-red-600", textColor: "text-orange-400" },
  { id: "funny", label: "Funny", emoji: "😂", color: "from-yellow-400 to-orange-500", textColor: "text-yellow-400" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬", color: "from-purple-500 to-pink-600", textColor: "text-purple-400" },
  { id: "celebrity", label: "Celebrity", emoji: "⭐", color: "from-amber-400 to-yellow-600", textColor: "text-amber-400" },
  { id: "gossip", label: "Gossip", emoji: "💬", color: "from-pink-500 to-rose-600", textColor: "text-pink-400" },
  { id: "weather", label: "Weather", emoji: "🌦️", color: "from-cyan-400 to-blue-600", textColor: "text-cyan-400" },
  { id: "business", label: "Business", emoji: "💼", color: "from-emerald-500 to-teal-700", textColor: "text-emerald-400" },
  { id: "sports", label: "Sports", emoji: "🏆", color: "from-blue-500 to-indigo-700", textColor: "text-blue-400" },
] as const;

/** Each category has its own ranking config describing what is ranked */
export const CATEGORY_RANKING_CONFIGS: Record<string, CategoryRankingConfig[]> = {
  crime: [
    { id: "highest_crime", label: "Highest Crime Rate", statLabel: "Crime Index", description: "Countries ranked by overall crime rate per 100k population" },
    { id: "safest", label: "Safest / Calmest", statLabel: "Safety Score", description: "Countries ranked by safety and low crime" },
    { id: "most_violent", label: "Most Violent", statLabel: "Violence Index", description: "Countries ranked by violent crime incidents" },
  ],
  trending: [
    { id: "most_trending", label: "Most Trending Activity", statLabel: "Trend Score", description: "Countries with the most viral and trending content right now" },
    { id: "fastest_rising", label: "Fastest Rising", statLabel: "Rise Rate", description: "Countries where trends are spreading the fastest" },
  ],
  funny: [
    { id: "funniest", label: "Funniest Content", statLabel: "Humor Score", description: "Countries producing the most viral funny content" },
    { id: "most_memes", label: "Most Memes", statLabel: "Meme Volume", description: "Countries generating the most memes and viral comedy" },
  ],
  entertainment: [
    { id: "top_entertainment", label: "Top Entertainment Buzz", statLabel: "Buzz Score", description: "Countries with the most entertainment news activity" },
    { id: "top_music", label: "Top Music Scene", statLabel: "Music Index", description: "Countries with the hottest music scenes right now" },
    { id: "top_film", label: "Top Film/TV", statLabel: "Film Score", description: "Countries producing the most talked-about films and TV" },
  ],
  celebrity: [
    { id: "most_celeb_news", label: "Most Celebrity News", statLabel: "Celeb Index", description: "Countries generating the most celebrity news" },
    { id: "most_followed", label: "Most Followed Celebs", statLabel: "Follower Score", description: "Countries with the most-followed celebrities globally" },
  ],
  gossip: [
    { id: "hottest_gossip", label: "Hottest Gossip", statLabel: "Gossip Score", description: "Countries with the most viral gossip right now" },
    { id: "most_drama", label: "Most Drama", statLabel: "Drama Index", description: "Countries with the most dramatic stories trending" },
  ],
  weather: [
    { id: "coldest", label: "Coldest Right Now", statLabel: "Temperature", description: "Coldest countries in the world right now" },
    { id: "hottest", label: "Hottest Right Now", statLabel: "Temperature", description: "Hottest countries in the world right now" },
    { id: "calmest_weather", label: "Calmest Weather", statLabel: "Calm Score", description: "Countries with the most pleasant weather right now" },
    { id: "most_extreme", label: "Most Extreme Weather", statLabel: "Extreme Index", description: "Countries experiencing the most extreme weather events" },
  ],
  business: [
    { id: "top_markets", label: "Top Stock Markets", statLabel: "Market Change", description: "Countries with the best-performing stock markets today" },
    { id: "top_crypto", label: "Top Crypto Activity", statLabel: "Crypto Volume", description: "Countries with the highest crypto trading volume" },
    { id: "top_startups", label: "Top Startup Activity", statLabel: "Startup Score", description: "Countries with the most startup funding and launches" },
    { id: "top_apps", label: "Trending Apps", statLabel: "Download Score", description: "Countries with the most trending app downloads" },
  ],
  sports: [
    { id: "top_sports_nations", label: "Top Sports Nations", statLabel: "Sports Index", description: "Countries dominating global sports right now" },
    { id: "top_football", label: "Top Football/Soccer", statLabel: "Football Score", description: "Countries with the most football buzz and results" },
    { id: "top_basketball", label: "Top Basketball", statLabel: "Basketball Score", description: "Countries leading in basketball news and performance" },
    { id: "top_combat", label: "Top Combat Sports", statLabel: "Fight Score", description: "Countries dominating MMA, boxing, and combat sports" },
  ],
};

export const BUSINESS_SUBCATEGORIES = [
  { id: "stocks", label: "Stocks", emoji: "📈" },
  { id: "crypto", label: "Crypto", emoji: "₿" },
  { id: "apps", label: "Trending Apps", emoji: "📱" },
  { id: "startups", label: "Startups", emoji: "🚀" },
  { id: "products", label: "Products", emoji: "🛍️" },
] as const;

export const SPORTS_SUBCATEGORIES = [
  { id: "football", label: "Football/Soccer", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "american_football", label: "American Football", emoji: "🏈" },
  { id: "f1", label: "Formula 1", emoji: "🏎️" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "mma", label: "MMA/Boxing", emoji: "🥊" },
  { id: "olympics", label: "Olympics", emoji: "🥇" },
] as const;

export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
] as const;

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
];

export const MOCK_STORIES: MockStory[] = [
  // Crime
  { id: 1, title: "Toronto Heist Gone Wrong — 3 Suspects Flee Downtown Core", summary: "A brazen daylight robbery at a jewelry store in Toronto's financial district ended in a dramatic car chase. Police have identified three suspects.", aiSummary: "Three suspects attempted a jewelry heist in downtown Toronto during rush hour. The chase lasted 45 minutes across the city. Two suspects are still at large. This is the third major heist in Canadian cities this month, pushing crime rankings up.", sourceUrl: "#", sourceName: "CP24", imageUrl: STOCK_IMAGES[0], category: "crime", country: "CA", countryFlag: "🇨🇦", city: "Toronto", heatScore: 94, rank: 1, likesCount: 2847, commentsCount: 412, publishedAt: "2026-02-08T08:30:00Z" },
  { id: 2, title: "Lagos Armed Robbery Ring Busted After 6-Month Investigation", summary: "Nigerian police have dismantled a major armed robbery network operating across Lagos state.", aiSummary: "A six-month undercover operation by Nigerian police has led to the arrest of 15 members of an armed robbery ring in Lagos. The group was responsible for over 30 robberies.", sourceUrl: "#", sourceName: "Punch NG", imageUrl: STOCK_IMAGES[1], category: "crime", country: "NG", countryFlag: "🇳🇬", city: "Lagos", heatScore: 91, rank: 2, likesCount: 1923, commentsCount: 287, publishedAt: "2026-02-08T07:15:00Z" },
  { id: 3, title: "Chicago Carjacking Spree — 12 Vehicles Stolen in 48 Hours", summary: "A wave of carjackings has hit Chicago's South Side, with police deploying additional units.", aiSummary: "Chicago police report 12 carjackings in just 48 hours across the South Side. The spike has pushed Chicago's crime heat score to 96 this week.", sourceUrl: "#", sourceName: "Chicago Tribune", imageUrl: STOCK_IMAGES[2], category: "crime", country: "US", countryFlag: "🇺🇸", city: "Chicago", heatScore: 89, rank: 3, likesCount: 3102, commentsCount: 534, publishedAt: "2026-02-08T06:45:00Z" },

  // Trending
  { id: 4, title: "AI Girlfriend Apps Banned in 3 Countries — Users in Uproar", summary: "Italy, France, and Germany have moved to ban AI companion apps citing mental health concerns.", aiSummary: "Three European nations have banned AI girlfriend/boyfriend apps. The ban affects over 2 million users. Social media is exploding with reactions.", sourceUrl: "#", sourceName: "Reuters", imageUrl: STOCK_IMAGES[3], category: "trending", country: "DE", countryFlag: "🇩🇪", heatScore: 98, rank: 1, likesCount: 15420, commentsCount: 2341, publishedAt: "2026-02-08T09:00:00Z" },
  { id: 5, title: "TikTok's New 'Reality Check' Feature Goes Viral Worldwide", summary: "TikTok has launched a feature that fact-checks viral claims in real-time using AI.", aiSummary: "TikTok's new Reality Check feature uses AI to add fact-check overlays on viral videos. It's already been used 50 million times in the first 24 hours.", sourceUrl: "#", sourceName: "The Verge", imageUrl: STOCK_IMAGES[4], category: "trending", country: "US", countryFlag: "🇺🇸", heatScore: 96, rank: 2, likesCount: 8934, commentsCount: 1567, publishedAt: "2026-02-08T08:00:00Z" },

  // Funny
  { id: 6, title: "Man Accidentally Joins Police Chase Thinking It Was a Flash Mob", summary: "A Florida man ran alongside police officers chasing a suspect, believing it was a community event.", aiSummary: "A Florida man saw people running and joined in, thinking it was a flash mob or charity run. He ran for 3 blocks before realizing it was a police chase. The video has 40M views.", sourceUrl: "#", sourceName: "Florida Times", imageUrl: STOCK_IMAGES[5], category: "funny", country: "US", countryFlag: "🇺🇸", city: "Miami", heatScore: 95, rank: 1, likesCount: 24500, commentsCount: 3890, publishedAt: "2026-02-08T07:00:00Z" },
  { id: 7, title: "Nigerian Grandma Goes Viral Dancing to Burna Boy at 87", summary: "An 87-year-old grandmother from Enugu has gone viral after a video of her dancing to Burna Boy's latest hit.", aiSummary: "87-year-old Mama Nkechi from Enugu, Nigeria went viral dancing to Burna Boy. The video has 25M views. Burna Boy himself reposted it.", sourceUrl: "#", sourceName: "Linda Ikeji", imageUrl: STOCK_IMAGES[0], category: "funny", country: "NG", countryFlag: "🇳🇬", city: "Enugu", heatScore: 93, rank: 2, likesCount: 18700, commentsCount: 2100, publishedAt: "2026-02-08T06:30:00Z" },

  // Entertainment
  { id: 8, title: "Taylor Swift Announces Surprise World Tour Extension — 15 New Cities", summary: "Taylor Swift has added 15 new cities to her Eras Tour, including Lagos, Mumbai, and São Paulo.", aiSummary: "Taylor Swift extends the Eras Tour with 15 new cities across Africa, Asia, and South America. Lagos and Mumbai dates sold out in 8 minutes.", sourceUrl: "#", sourceName: "Billboard", imageUrl: STOCK_IMAGES[1], category: "entertainment", country: "US", countryFlag: "🇺🇸", heatScore: 99, rank: 1, likesCount: 45000, commentsCount: 8900, publishedAt: "2026-02-08T10:00:00Z" },
  { id: 9, title: "Nollywood Film Breaks Netflix Global Top 10 for First Time", summary: "A Nollywood production has cracked Netflix's global top 10, marking a historic first.", aiSummary: "The Nollywood film 'Kingdom of Dust' has entered Netflix's global top 10 at #7, the first Nigerian film to achieve this. It's been watched 28M hours in its first week.", sourceUrl: "#", sourceName: "Variety", imageUrl: STOCK_IMAGES[2], category: "entertainment", country: "NG", countryFlag: "🇳🇬", heatScore: 92, rank: 2, likesCount: 12300, commentsCount: 1800, publishedAt: "2026-02-08T09:30:00Z" },

  // Celebrity
  { id: 10, title: "Drake and Kendrick Lamar Spotted Together — Fans Lose Their Minds", summary: "Rival rappers Drake and Kendrick Lamar were photographed having dinner together in Los Angeles.", aiSummary: "Drake and Kendrick Lamar were seen dining together at Nobu in LA. The photo has broken Twitter/X records with 2M retweets in 3 hours. Fans are speculating a collaboration.", sourceUrl: "#", sourceName: "TMZ", imageUrl: STOCK_IMAGES[3], category: "celebrity", country: "US", countryFlag: "🇺🇸", city: "Los Angeles", heatScore: 97, rank: 1, likesCount: 34000, commentsCount: 5600, publishedAt: "2026-02-08T11:00:00Z" },

  // Gossip
  { id: 11, title: "Royal Family Insider Leaks — Prince Harry's Secret Meeting with King Charles", summary: "An anonymous palace source has revealed details of a private meeting between Harry and Charles.", aiSummary: "A palace insider leaked details of a secret 2-hour meeting between Prince Harry and King Charles at Windsor Castle. The meeting reportedly covered inheritance and the children's titles.", sourceUrl: "#", sourceName: "Daily Mail", imageUrl: STOCK_IMAGES[4], category: "gossip", country: "GB", countryFlag: "🇬🇧", heatScore: 94, rank: 1, likesCount: 28000, commentsCount: 4200, publishedAt: "2026-02-08T08:45:00Z" },

  // Weather
  { id: 12, title: "Barrie Hits -30°C — Coldest February in 40 Years", summary: "The city of Barrie, Ontario is experiencing its coldest February since 1986.", aiSummary: "Barrie, Ontario has hit -30°C, making this the coldest February in 40 years. Schools are closed, pipes are bursting, and the city has opened emergency warming centers.", sourceUrl: "#", sourceName: "Weather Network", imageUrl: STOCK_IMAGES[5], category: "weather", country: "CA", countryFlag: "🇨🇦", city: "Barrie", heatScore: 88, rank: 1, likesCount: 5600, commentsCount: 890, publishedAt: "2026-02-08T07:30:00Z" },

  // Business
  { id: 13, title: "Bitcoin Surges Past $95K — Crypto Market in Frenzy", summary: "Bitcoin has broken through the $95,000 barrier, sending shockwaves through global markets.", aiSummary: "Bitcoin hit $95,200 today, up 12% in 24 hours. The surge is driven by institutional buying and ETF inflows. Altcoins are following with Ethereum up 8%.", sourceUrl: "#", sourceName: "CoinDesk", imageUrl: STOCK_IMAGES[0], category: "business", businessSubcategory: "crypto", country: "US", countryFlag: "🇺🇸", heatScore: 97, rank: 1, likesCount: 19800, commentsCount: 3400, publishedAt: "2026-02-08T10:30:00Z" },
  { id: 14, title: "Nigerian Fintech Startup Raises $50M — Largest African Series B", summary: "Lagos-based fintech company PayStack+ has raised $50M in Series B funding.", aiSummary: "PayStack+ has raised $50M from Sequoia and Andreessen Horowitz, the largest Series B for an African startup. The company processes $2B in annual transactions.", sourceUrl: "#", sourceName: "TechCrunch", imageUrl: STOCK_IMAGES[1], category: "business", businessSubcategory: "startups", country: "NG", countryFlag: "🇳🇬", city: "Lagos", heatScore: 93, rank: 2, likesCount: 8700, commentsCount: 1200, publishedAt: "2026-02-08T09:15:00Z" },
  { id: 15, title: "S&P 500 Hits All-Time High — Wall Street Celebrates", summary: "The S&P 500 has reached a new all-time high, driven by tech earnings.", aiSummary: "The S&P 500 closed at 5,892, a new all-time high. Tech giants led the rally with Apple up 4% and NVIDIA up 6%. Analysts predict continued momentum.", sourceUrl: "#", sourceName: "Bloomberg", imageUrl: STOCK_IMAGES[2], category: "business", businessSubcategory: "stocks", country: "US", countryFlag: "🇺🇸", heatScore: 90, rank: 3, likesCount: 6500, commentsCount: 980, publishedAt: "2026-02-08T08:00:00Z" },
  { id: 16, title: "New AI Coding App 'CodePulse' Hits 1M Downloads in 48 Hours", summary: "A new AI-powered coding assistant app has taken the App Store by storm.", aiSummary: "CodePulse, an AI coding assistant, hit 1M downloads in just 48 hours. It's the fastest-growing productivity app of 2026. It supports 40 programming languages.", sourceUrl: "#", sourceName: "Product Hunt", imageUrl: STOCK_IMAGES[3], category: "business", businessSubcategory: "apps", country: "US", countryFlag: "🇺🇸", heatScore: 88, rank: 4, likesCount: 7200, commentsCount: 1100, publishedAt: "2026-02-08T07:45:00Z" },

  // Sports
  { id: 17, title: "Super Bowl LX — Kansas City Chiefs vs. Philadelphia Eagles in Epic Rematch", summary: "The NFL's biggest game returns with a blockbuster rematch as the Chiefs face the Eagles in Super Bowl LX.", aiSummary: "Super Bowl LX is set for the ultimate rematch. Kansas City Chiefs vs. Philadelphia Eagles. Mahomes vs. Hurts. 120M viewers expected. Vegas odds have the Chiefs as slight favorites. The halftime show features Kendrick Lamar.", sourceUrl: "#", sourceName: "ESPN", imageUrl: STOCK_IMAGES[0], category: "sports", sportsSubcategory: "american_football", country: "US", countryFlag: "🇺🇸", heatScore: 99, rank: 1, likesCount: 52000, commentsCount: 9800, publishedAt: "2026-02-08T11:00:00Z" },
  { id: 18, title: "Premier League Shock — Liverpool Loses 4-0 to Newly Promoted Side", summary: "Liverpool suffers a historic defeat as newly promoted Leicester City thrash them at Anfield.", aiSummary: "Liverpool's title hopes take a massive hit after a 4-0 loss to Leicester City at Anfield. It's Liverpool's worst home defeat in 12 years. The Premier League title race is blown wide open.", sourceUrl: "#", sourceName: "BBC Sport", imageUrl: STOCK_IMAGES[1], category: "sports", sportsSubcategory: "football", country: "GB", countryFlag: "🇬🇧", city: "Liverpool", heatScore: 96, rank: 2, likesCount: 38000, commentsCount: 7200, publishedAt: "2026-02-08T10:00:00Z" },
  { id: 19, title: "LeBron James Drops 50 Points at Age 41 — NBA Record Shattered", summary: "LeBron James becomes the oldest player to score 50+ points in an NBA game.", aiSummary: "LeBron James, age 41, dropped 50 points against the Celtics, shattering the NBA record for oldest player to hit 50. The Lakers won 128-119. Social media is calling it the greatest performance by a 40+ athlete ever.", sourceUrl: "#", sourceName: "NBA.com", imageUrl: STOCK_IMAGES[2], category: "sports", sportsSubcategory: "basketball", country: "US", countryFlag: "🇺🇸", city: "Los Angeles", heatScore: 97, rank: 3, likesCount: 41000, commentsCount: 6500, publishedAt: "2026-02-08T09:30:00Z" },
  { id: 20, title: "Verstappen Crashes Out in Lap 1 — F1 Season Opener Chaos", summary: "Max Verstappen's title defense starts in disaster as he crashes out on the first lap of the Bahrain GP.", aiSummary: "Max Verstappen crashed out on Lap 1 of the Bahrain GP after contact with Norris. Leclerc won the race. Verstappen's championship defense is off to the worst possible start. Red Bull is furious.", sourceUrl: "#", sourceName: "Formula1.com", imageUrl: STOCK_IMAGES[3], category: "sports", sportsSubcategory: "f1", country: "NL", countryFlag: "🇳🇱", heatScore: 94, rank: 4, likesCount: 29000, commentsCount: 5100, publishedAt: "2026-02-08T08:00:00Z" },
  { id: 21, title: "UFC 310 — Nigerian Fighter Wins Middleweight Title in 30 Seconds", summary: "Nigerian-born fighter Kamaru Usman Jr. wins the UFC middleweight title with a devastating first-round KO.", aiSummary: "Kamaru Usman Jr. knocked out the champion in just 30 seconds at UFC 310 in Las Vegas. It's the fastest title fight finish in UFC middleweight history. Nigeria is celebrating.", sourceUrl: "#", sourceName: "MMA Fighting", imageUrl: STOCK_IMAGES[4], category: "sports", sportsSubcategory: "mma", country: "NG", countryFlag: "🇳🇬", heatScore: 93, rank: 5, likesCount: 22000, commentsCount: 4300, publishedAt: "2026-02-08T07:00:00Z" },
  { id: 22, title: "Djokovic Announces Retirement — Tennis World in Tears", summary: "Novak Djokovic announces his retirement from professional tennis after 24 Grand Slam titles.", aiSummary: "Novak Djokovic, 38, has announced his retirement from professional tennis. With 24 Grand Slam titles, he retires as the most decorated male tennis player in history. The tennis world is in shock.", sourceUrl: "#", sourceName: "ATP Tour", imageUrl: STOCK_IMAGES[5], category: "sports", sportsSubcategory: "tennis", country: "RS", countryFlag: "🇷🇸", heatScore: 95, rank: 6, likesCount: 35000, commentsCount: 6800, publishedAt: "2026-02-08T06:30:00Z" },
];

/* ─────────────────────────────────────────────────────────
 * RANKINGS DATA — Global Top 10-20 → Country → State → City
 * This is the core USP of GlobalPulse.
 * Every category has rankings. Every ranking drills down.
 * ───────────────────────────────────────────────────────── */

export const MOCK_RANKINGS: Record<string, MockRanking[]> = {
  // ─── CRIME ───
  crime: [
    { rank: 1, name: "Brazil", flag: "🇧🇷", stat: "487/100k", trend: "up", entityType: "country" },
    { rank: 2, name: "South Africa", flag: "🇿🇦", stat: "412/100k", trend: "same", entityType: "country" },
    { rank: 3, name: "Mexico", flag: "🇲🇽", stat: "389/100k", trend: "up", entityType: "country" },
    { rank: 4, name: "Nigeria", flag: "🇳🇬", stat: "301/100k", trend: "down", entityType: "country" },
    { rank: 5, name: "USA", flag: "🇺🇸", stat: "287/100k", trend: "up", entityType: "country" },
    { rank: 6, name: "Colombia", flag: "🇨🇴", stat: "265/100k", trend: "down", entityType: "country" },
    { rank: 7, name: "India", flag: "🇮🇳", stat: "241/100k", trend: "same", entityType: "country" },
    { rank: 8, name: "UK", flag: "🇬🇧", stat: "198/100k", trend: "up", entityType: "country" },
    { rank: 9, name: "Canada", flag: "🇨🇦", stat: "176/100k", trend: "up", entityType: "country" },
    { rank: 10, name: "Australia", flag: "🇦🇺", stat: "152/100k", trend: "same", entityType: "country" },
  ],
  safest: [
    { rank: 1, name: "Japan", flag: "🇯🇵", stat: "Safety: 98", trend: "same", entityType: "country" },
    { rank: 2, name: "Singapore", flag: "🇸🇬", stat: "Safety: 97", trend: "same", entityType: "country" },
    { rank: 3, name: "Iceland", flag: "🇮🇸", stat: "Safety: 96", trend: "up", entityType: "country" },
    { rank: 4, name: "Switzerland", flag: "🇨🇭", stat: "Safety: 95", trend: "same", entityType: "country" },
    { rank: 5, name: "Norway", flag: "🇳🇴", stat: "Safety: 94", trend: "up", entityType: "country" },
  ],
  violent: [
    { rank: 1, name: "Venezuela", flag: "🇻🇪", stat: "Violence: 98", trend: "up", entityType: "country" },
    { rank: 2, name: "Honduras", flag: "🇭🇳", stat: "Violence: 95", trend: "same", entityType: "country" },
    { rank: 3, name: "El Salvador", flag: "🇸🇻", stat: "Violence: 91", trend: "down", entityType: "country" },
    { rank: 4, name: "Jamaica", flag: "🇯🇲", stat: "Violence: 88", trend: "up", entityType: "country" },
    { rank: 5, name: "South Africa", flag: "🇿🇦", stat: "Violence: 86", trend: "same", entityType: "country" },
  ],

  // ─── TRENDING ───
  trending: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "Trend: 99", trend: "up", entityType: "country" },
    { rank: 2, name: "India", flag: "🇮🇳", stat: "Trend: 96", trend: "up", entityType: "country" },
    { rank: 3, name: "Brazil", flag: "🇧🇷", stat: "Trend: 94", trend: "same", entityType: "country" },
    { rank: 4, name: "Nigeria", flag: "🇳🇬", stat: "Trend: 92", trend: "up", entityType: "country" },
    { rank: 5, name: "UK", flag: "🇬🇧", stat: "Trend: 89", trend: "same", entityType: "country" },
    { rank: 6, name: "Germany", flag: "🇩🇪", stat: "Trend: 87", trend: "up", entityType: "country" },
    { rank: 7, name: "Japan", flag: "🇯🇵", stat: "Trend: 85", trend: "down", entityType: "country" },
    { rank: 8, name: "South Korea", flag: "🇰🇷", stat: "Trend: 83", trend: "up", entityType: "country" },
    { rank: 9, name: "France", flag: "🇫🇷", stat: "Trend: 81", trend: "same", entityType: "country" },
    { rank: 10, name: "Canada", flag: "🇨🇦", stat: "Trend: 79", trend: "down", entityType: "country" },
  ],

  // ─── FUNNY ───
  funny: [
    { rank: 1, name: "Nigeria", flag: "🇳🇬", stat: "Humor: 99", trend: "up", entityType: "country" },
    { rank: 2, name: "Brazil", flag: "🇧🇷", stat: "Humor: 97", trend: "same", entityType: "country" },
    { rank: 3, name: "USA", flag: "🇺🇸", stat: "Humor: 95", trend: "up", entityType: "country" },
    { rank: 4, name: "UK", flag: "🇬🇧", stat: "Humor: 93", trend: "same", entityType: "country" },
    { rank: 5, name: "India", flag: "🇮🇳", stat: "Humor: 91", trend: "up", entityType: "country" },
    { rank: 6, name: "Ghana", flag: "🇬🇭", stat: "Humor: 89", trend: "up", entityType: "country" },
    { rank: 7, name: "Australia", flag: "🇦🇺", stat: "Humor: 87", trend: "same", entityType: "country" },
    { rank: 8, name: "South Africa", flag: "🇿🇦", stat: "Humor: 85", trend: "down", entityType: "country" },
    { rank: 9, name: "Mexico", flag: "🇲🇽", stat: "Humor: 83", trend: "up", entityType: "country" },
    { rank: 10, name: "Kenya", flag: "🇰🇪", stat: "Humor: 81", trend: "same", entityType: "country" },
  ],

  // ─── ENTERTAINMENT ───
  entertainment: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "Buzz: 99", trend: "up", entityType: "country" },
    { rank: 2, name: "South Korea", flag: "🇰🇷", stat: "Buzz: 97", trend: "up", entityType: "country" },
    { rank: 3, name: "Nigeria", flag: "🇳🇬", stat: "Buzz: 94", trend: "up", entityType: "country" },
    { rank: 4, name: "India", flag: "🇮🇳", stat: "Buzz: 92", trend: "same", entityType: "country" },
    { rank: 5, name: "UK", flag: "🇬🇧", stat: "Buzz: 90", trend: "down", entityType: "country" },
    { rank: 6, name: "Japan", flag: "🇯🇵", stat: "Buzz: 88", trend: "up", entityType: "country" },
    { rank: 7, name: "Brazil", flag: "🇧🇷", stat: "Buzz: 86", trend: "same", entityType: "country" },
    { rank: 8, name: "France", flag: "🇫🇷", stat: "Buzz: 84", trend: "down", entityType: "country" },
    { rank: 9, name: "Mexico", flag: "🇲🇽", stat: "Buzz: 82", trend: "up", entityType: "country" },
    { rank: 10, name: "Germany", flag: "🇩🇪", stat: "Buzz: 80", trend: "same", entityType: "country" },
  ],

  // ─── CELEBRITY ───
  celebrity: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "Celeb: 99", trend: "up", entityType: "country" },
    { rank: 2, name: "UK", flag: "🇬🇧", stat: "Celeb: 96", trend: "same", entityType: "country" },
    { rank: 3, name: "Nigeria", flag: "🇳🇬", stat: "Celeb: 93", trend: "up", entityType: "country" },
    { rank: 4, name: "India", flag: "🇮🇳", stat: "Celeb: 91", trend: "up", entityType: "country" },
    { rank: 5, name: "South Korea", flag: "🇰🇷", stat: "Celeb: 89", trend: "up", entityType: "country" },
    { rank: 6, name: "Brazil", flag: "🇧🇷", stat: "Celeb: 86", trend: "same", entityType: "country" },
    { rank: 7, name: "France", flag: "🇫🇷", stat: "Celeb: 83", trend: "down", entityType: "country" },
    { rank: 8, name: "Mexico", flag: "🇲🇽", stat: "Celeb: 80", trend: "up", entityType: "country" },
    { rank: 9, name: "Australia", flag: "🇦🇺", stat: "Celeb: 78", trend: "same", entityType: "country" },
    { rank: 10, name: "Japan", flag: "🇯🇵", stat: "Celeb: 76", trend: "down", entityType: "country" },
  ],

  // ─── GOSSIP ───
  gossip: [
    { rank: 1, name: "UK", flag: "🇬🇧", stat: "Gossip: 99", trend: "up", entityType: "country" },
    { rank: 2, name: "USA", flag: "🇺🇸", stat: "Gossip: 97", trend: "same", entityType: "country" },
    { rank: 3, name: "Nigeria", flag: "🇳🇬", stat: "Gossip: 95", trend: "up", entityType: "country" },
    { rank: 4, name: "India", flag: "🇮🇳", stat: "Gossip: 92", trend: "up", entityType: "country" },
    { rank: 5, name: "Brazil", flag: "🇧🇷", stat: "Gossip: 89", trend: "same", entityType: "country" },
    { rank: 6, name: "South Korea", flag: "🇰🇷", stat: "Gossip: 87", trend: "up", entityType: "country" },
    { rank: 7, name: "France", flag: "🇫🇷", stat: "Gossip: 84", trend: "down", entityType: "country" },
    { rank: 8, name: "Mexico", flag: "🇲🇽", stat: "Gossip: 81", trend: "up", entityType: "country" },
    { rank: 9, name: "Australia", flag: "🇦🇺", stat: "Gossip: 79", trend: "same", entityType: "country" },
    { rank: 10, name: "Ghana", flag: "🇬🇭", stat: "Gossip: 77", trend: "up", entityType: "country" },
  ],

  // ─── WEATHER ───
  coldest: [
    { rank: 1, name: "Russia", flag: "🇷🇺", stat: "-45°C", trend: "same", entityType: "country" },
    { rank: 2, name: "Canada", flag: "🇨🇦", stat: "-38°C", trend: "up", entityType: "country" },
    { rank: 3, name: "Mongolia", flag: "🇲🇳", stat: "-35°C", trend: "same", entityType: "country" },
    { rank: 4, name: "Finland", flag: "🇫🇮", stat: "-30°C", trend: "down", entityType: "country" },
    { rank: 5, name: "Norway", flag: "🇳🇴", stat: "-28°C", trend: "same", entityType: "country" },
    { rank: 6, name: "Sweden", flag: "🇸🇪", stat: "-26°C", trend: "up", entityType: "country" },
    { rank: 7, name: "Iceland", flag: "🇮🇸", stat: "-22°C", trend: "same", entityType: "country" },
    { rank: 8, name: "USA (Alaska)", flag: "🇺🇸", stat: "-20°C", trend: "down", entityType: "country" },
    { rank: 9, name: "Kazakhstan", flag: "🇰🇿", stat: "-18°C", trend: "same", entityType: "country" },
    { rank: 10, name: "Greenland", flag: "🇬🇱", stat: "-16°C", trend: "up", entityType: "country" },
  ],
  hottest: [
    { rank: 1, name: "Kuwait", flag: "🇰🇼", stat: "54°C", trend: "same", entityType: "country" },
    { rank: 2, name: "Iraq", flag: "🇮🇶", stat: "52°C", trend: "up", entityType: "country" },
    { rank: 3, name: "Saudi Arabia", flag: "🇸🇦", stat: "50°C", trend: "up", entityType: "country" },
    { rank: 4, name: "India", flag: "🇮🇳", stat: "48°C", trend: "up", entityType: "country" },
    { rank: 5, name: "Nigeria", flag: "🇳🇬", stat: "42°C", trend: "same", entityType: "country" },
    { rank: 6, name: "Pakistan", flag: "🇵🇰", stat: "41°C", trend: "up", entityType: "country" },
    { rank: 7, name: "Libya", flag: "🇱🇾", stat: "40°C", trend: "same", entityType: "country" },
    { rank: 8, name: "Australia", flag: "🇦🇺", stat: "39°C", trend: "down", entityType: "country" },
    { rank: 9, name: "Mexico", flag: "🇲🇽", stat: "38°C", trend: "up", entityType: "country" },
    { rank: 10, name: "Sudan", flag: "🇸🇩", stat: "37°C", trend: "same", entityType: "country" },
  ],
  calmest: [
    { rank: 1, name: "Singapore", flag: "🇸🇬", stat: "Calm: 97", trend: "same", entityType: "country" },
    { rank: 2, name: "Hawaii (US)", flag: "🇺🇸", stat: "Calm: 95", trend: "up", entityType: "country" },
    { rank: 3, name: "Canary Islands", flag: "🇪🇸", stat: "Calm: 93", trend: "same", entityType: "country" },
    { rank: 4, name: "Maldives", flag: "🇲🇻", stat: "Calm: 91", trend: "down", entityType: "country" },
    { rank: 5, name: "Costa Rica", flag: "🇨🇷", stat: "Calm: 89", trend: "up", entityType: "country" },
  ],
  fun: [
    { rank: 1, name: "Brazil", flag: "🇧🇷", stat: "Fun: 99", trend: "same", entityType: "country" },
    { rank: 2, name: "Thailand", flag: "🇹🇭", stat: "Fun: 96", trend: "up", entityType: "country" },
    { rank: 3, name: "Spain", flag: "🇪🇸", stat: "Fun: 94", trend: "same", entityType: "country" },
    { rank: 4, name: "Nigeria", flag: "🇳🇬", stat: "Fun: 93", trend: "up", entityType: "country" },
    { rank: 5, name: "Japan", flag: "🇯🇵", stat: "Fun: 91", trend: "same", entityType: "country" },
  ],

  // ─── SPORTS ───
  sports: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "Sports: 99", trend: "up", entityType: "country" },
    { rank: 2, name: "UK", flag: "🇬🇧", stat: "Sports: 97", trend: "up", entityType: "country" },
    { rank: 3, name: "Brazil", flag: "🇧🇷", stat: "Sports: 96", trend: "same", entityType: "country" },
    { rank: 4, name: "Germany", flag: "🇩🇪", stat: "Sports: 93", trend: "up", entityType: "country" },
    { rank: 5, name: "Spain", flag: "🇪🇸", stat: "Sports: 92", trend: "same", entityType: "country" },
    { rank: 6, name: "India", flag: "🇮🇳", stat: "Sports: 90", trend: "up", entityType: "country" },
    { rank: 7, name: "France", flag: "🇫🇷", stat: "Sports: 88", trend: "down", entityType: "country" },
    { rank: 8, name: "Nigeria", flag: "🇳🇬", stat: "Sports: 86", trend: "up", entityType: "country" },
    { rank: 9, name: "Australia", flag: "🇦🇺", stat: "Sports: 84", trend: "same", entityType: "country" },
    { rank: 10, name: "Japan", flag: "🇯🇵", stat: "Sports: 82", trend: "down", entityType: "country" },
  ],

  // ─── BUSINESS ───
  business: [
    { rank: 1, name: "USA", flag: "🇺🇸", stat: "S&P +2.4%", trend: "up", entityType: "country" },
    { rank: 2, name: "Nigeria", flag: "🇳🇬", stat: "NGX +3.1%", trend: "up", entityType: "country" },
    { rank: 3, name: "India", flag: "🇮🇳", stat: "Sensex +1.8%", trend: "up", entityType: "country" },
    { rank: 4, name: "Canada", flag: "🇨🇦", stat: "TSX +1.2%", trend: "same", entityType: "country" },
    { rank: 5, name: "Japan", flag: "🇯🇵", stat: "Nikkei +0.9%", trend: "down", entityType: "country" },
    { rank: 6, name: "Germany", flag: "🇩🇪", stat: "DAX +0.7%", trend: "up", entityType: "country" },
    { rank: 7, name: "UK", flag: "🇬🇧", stat: "FTSE +0.5%", trend: "same", entityType: "country" },
    { rank: 8, name: "South Korea", flag: "🇰🇷", stat: "KOSPI +0.4%", trend: "down", entityType: "country" },
    { rank: 9, name: "Brazil", flag: "🇧🇷", stat: "IBOV +0.3%", trend: "up", entityType: "country" },
    { rank: 10, name: "Australia", flag: "🇦🇺", stat: "ASX +0.2%", trend: "same", entityType: "country" },
  ],
};

/* ─────────────────────────────────────────────────────────
 * DRILL-DOWN DATA — State/Province and City rankings
 * When a user clicks a country, they see states.
 * When they click a state, they see cities.
 * ───────────────────────────────────────────────────────── */

export type DrillDownData = {
  states: MockRanking[];
  cities: Record<string, MockRanking[]>;
};

/** Drill-down data keyed by "category:country" */
export const DRILL_DOWN_DATA: Record<string, DrillDownData> = {
  // USA Crime drill-down
  "crime:USA": {
    states: [
      { rank: 1, name: "Louisiana", flag: "🇺🇸", stat: "537/100k", trend: "up", entityType: "state", country: "USA" },
      { rank: 2, name: "Mississippi", flag: "🇺🇸", stat: "492/100k", trend: "same", entityType: "state", country: "USA" },
      { rank: 3, name: "Arkansas", flag: "🇺🇸", stat: "478/100k", trend: "up", entityType: "state", country: "USA" },
      { rank: 4, name: "New Mexico", flag: "🇺🇸", stat: "461/100k", trend: "down", entityType: "state", country: "USA" },
      { rank: 5, name: "Alaska", flag: "🇺🇸", stat: "445/100k", trend: "same", entityType: "state", country: "USA" },
      { rank: 6, name: "Tennessee", flag: "🇺🇸", stat: "432/100k", trend: "up", entityType: "state", country: "USA" },
      { rank: 7, name: "Illinois", flag: "🇺🇸", stat: "418/100k", trend: "up", entityType: "state", country: "USA" },
      { rank: 8, name: "Missouri", flag: "🇺🇸", stat: "405/100k", trend: "same", entityType: "state", country: "USA" },
      { rank: 9, name: "California", flag: "🇺🇸", stat: "392/100k", trend: "down", entityType: "state", country: "USA" },
      { rank: 10, name: "Texas", flag: "🇺🇸", stat: "380/100k", trend: "up", entityType: "state", country: "USA" },
    ] satisfies MockRanking[],
    cities: {
      "Louisiana": [
        { rank: 1, name: "New Orleans", flag: "🇺🇸", stat: "612/100k", trend: "up", entityType: "city", country: "USA", state: "Louisiana" },
        { rank: 2, name: "Baton Rouge", flag: "🇺🇸", stat: "548/100k", trend: "same", entityType: "city", country: "USA", state: "Louisiana" },
        { rank: 3, name: "Shreveport", flag: "🇺🇸", stat: "501/100k", trend: "up", entityType: "city", country: "USA", state: "Louisiana" },
      ],
      "Illinois": [
        { rank: 1, name: "Chicago", flag: "🇺🇸", stat: "589/100k", trend: "up", entityType: "city", country: "USA", state: "Illinois" },
        { rank: 2, name: "Rockford", flag: "🇺🇸", stat: "412/100k", trend: "same", entityType: "city", country: "USA", state: "Illinois" },
        { rank: 3, name: "Springfield", flag: "🇺🇸", stat: "378/100k", trend: "down", entityType: "city", country: "USA", state: "Illinois" },
      ],
      "California": [
        { rank: 1, name: "Oakland", flag: "🇺🇸", stat: "534/100k", trend: "up", entityType: "city", country: "USA", state: "California" },
        { rank: 2, name: "Los Angeles", flag: "🇺🇸", stat: "478/100k", trend: "same", entityType: "city", country: "USA", state: "California" },
        { rank: 3, name: "San Francisco", flag: "🇺🇸", stat: "421/100k", trend: "down", entityType: "city", country: "USA", state: "California" },
      ],
    },
  },

  // Canada Crime drill-down
  "crime:Canada": {
    states: [
      { rank: 1, name: "Manitoba", flag: "🇨🇦", stat: "298/100k", trend: "up", entityType: "state", country: "Canada" },
      { rank: 2, name: "Saskatchewan", flag: "🇨🇦", stat: "276/100k", trend: "same", entityType: "state", country: "Canada" },
      { rank: 3, name: "Alberta", flag: "🇨🇦", stat: "245/100k", trend: "up", entityType: "state", country: "Canada" },
      { rank: 4, name: "British Columbia", flag: "🇨🇦", stat: "231/100k", trend: "down", entityType: "state", country: "Canada" },
      { rank: 5, name: "Ontario", flag: "🇨🇦", stat: "198/100k", trend: "up", entityType: "state", country: "Canada" },
    ] satisfies MockRanking[],
    cities: {
      "Ontario": [
        { rank: 1, name: "Toronto", flag: "🇨🇦", stat: "245/100k", trend: "up", entityType: "city", country: "Canada", state: "Ontario" },
        { rank: 2, name: "Ottawa", flag: "🇨🇦", stat: "198/100k", trend: "same", entityType: "city", country: "Canada", state: "Ontario" },
        { rank: 3, name: "Hamilton", flag: "🇨🇦", stat: "187/100k", trend: "up", entityType: "city", country: "Canada", state: "Ontario" },
      ],
      "Alberta": [
        { rank: 1, name: "Edmonton", flag: "🇨🇦", stat: "312/100k", trend: "up", entityType: "city", country: "Canada", state: "Alberta" },
        { rank: 2, name: "Calgary", flag: "🇨🇦", stat: "267/100k", trend: "same", entityType: "city", country: "Canada", state: "Alberta" },
      ],
    },
  },

  // Nigeria Crime drill-down
  "crime:Nigeria": {
    states: [
      { rank: 1, name: "Lagos State", flag: "🇳🇬", stat: "412/100k", trend: "up", entityType: "state", country: "Nigeria" },
      { rank: 2, name: "Rivers State", flag: "🇳🇬", stat: "389/100k", trend: "same", entityType: "state", country: "Nigeria" },
      { rank: 3, name: "FCT Abuja", flag: "🇳🇬", stat: "356/100k", trend: "up", entityType: "state", country: "Nigeria" },
      { rank: 4, name: "Borno State", flag: "🇳🇬", stat: "334/100k", trend: "down", entityType: "state", country: "Nigeria" },
      { rank: 5, name: "Kaduna State", flag: "🇳🇬", stat: "312/100k", trend: "up", entityType: "state", country: "Nigeria" },
    ] satisfies MockRanking[],
    cities: {
      "Lagos State": [
        { rank: 1, name: "Lagos Island", flag: "🇳🇬", stat: "478/100k", trend: "up", entityType: "city", country: "Nigeria", state: "Lagos State" },
        { rank: 2, name: "Ikeja", flag: "🇳🇬", stat: "423/100k", trend: "same", entityType: "city", country: "Nigeria", state: "Lagos State" },
        { rank: 3, name: "Lekki", flag: "🇳🇬", stat: "387/100k", trend: "down", entityType: "city", country: "Nigeria", state: "Lagos State" },
      ],
    },
  },

  // USA Business drill-down
  "business:USA": {
    states: [
      { rank: 1, name: "California", flag: "🇺🇸", stat: "Market: 99", trend: "up", entityType: "state", country: "USA" },
      { rank: 2, name: "New York", flag: "🇺🇸", stat: "Market: 97", trend: "up", entityType: "state", country: "USA" },
      { rank: 3, name: "Texas", flag: "🇺🇸", stat: "Market: 94", trend: "same", entityType: "state", country: "USA" },
      { rank: 4, name: "Massachusetts", flag: "🇺🇸", stat: "Market: 91", trend: "up", entityType: "state", country: "USA" },
      { rank: 5, name: "Washington", flag: "🇺🇸", stat: "Market: 88", trend: "same", entityType: "state", country: "USA" },
    ] satisfies MockRanking[],
    cities: {
      "California": [
        { rank: 1, name: "San Francisco", flag: "🇺🇸", stat: "Tech: 99", trend: "up", entityType: "city", country: "USA", state: "California" },
        { rank: 2, name: "Los Angeles", flag: "🇺🇸", stat: "Tech: 94", trend: "same", entityType: "city", country: "USA", state: "California" },
        { rank: 3, name: "San Jose", flag: "🇺🇸", stat: "Tech: 92", trend: "up", entityType: "city", country: "USA", state: "California" },
      ],
      "New York": [
        { rank: 1, name: "New York City", flag: "🇺🇸", stat: "Finance: 99", trend: "up", entityType: "city", country: "USA", state: "New York" },
        { rank: 2, name: "Buffalo", flag: "🇺🇸", stat: "Finance: 72", trend: "same", entityType: "city", country: "USA", state: "New York" },
      ],
    },
  },

  // Nigeria Business drill-down
  "business:Nigeria": {
    states: [
      { rank: 1, name: "Lagos State", flag: "🇳🇬", stat: "Market: 97", trend: "up", entityType: "state", country: "Nigeria" },
      { rank: 2, name: "FCT Abuja", flag: "🇳🇬", stat: "Market: 89", trend: "same", entityType: "state", country: "Nigeria" },
      { rank: 3, name: "Rivers State", flag: "🇳🇬", stat: "Market: 82", trend: "up", entityType: "state", country: "Nigeria" },
      { rank: 4, name: "Oyo State", flag: "🇳🇬", stat: "Market: 76", trend: "up", entityType: "state", country: "Nigeria" },
      { rank: 5, name: "Kano State", flag: "🇳🇬", stat: "Market: 71", trend: "same", entityType: "state", country: "Nigeria" },
    ] satisfies MockRanking[],
    cities: {
      "Lagos State": [
        { rank: 1, name: "Victoria Island", flag: "🇳🇬", stat: "Fintech: 99", trend: "up", entityType: "city", country: "Nigeria", state: "Lagos State" },
        { rank: 2, name: "Ikeja", flag: "🇳🇬", stat: "Fintech: 91", trend: "same", entityType: "city", country: "Nigeria", state: "Lagos State" },
        { rank: 3, name: "Yaba", flag: "🇳🇬", stat: "Startups: 95", trend: "up", entityType: "city", country: "Nigeria", state: "Lagos State" },
      ],
    },
  },

  // USA Trending drill-down
  "trending:USA": {
    states: [
      { rank: 1, name: "California", flag: "🇺🇸", stat: "Trend: 99", trend: "up", entityType: "state", country: "USA" },
      { rank: 2, name: "New York", flag: "🇺🇸", stat: "Trend: 97", trend: "up", entityType: "state", country: "USA" },
      { rank: 3, name: "Texas", flag: "🇺🇸", stat: "Trend: 93", trend: "same", entityType: "state", country: "USA" },
      { rank: 4, name: "Florida", flag: "🇺🇸", stat: "Trend: 91", trend: "up", entityType: "state", country: "USA" },
      { rank: 5, name: "Illinois", flag: "🇺🇸", stat: "Trend: 88", trend: "same", entityType: "state", country: "USA" },
    ] satisfies MockRanking[],
    cities: {
      "California": [
        { rank: 1, name: "Los Angeles", flag: "🇺🇸", stat: "Trend: 99", trend: "up", entityType: "city", country: "USA", state: "California" },
        { rank: 2, name: "San Francisco", flag: "🇺🇸", stat: "Trend: 96", trend: "same", entityType: "city", country: "USA", state: "California" },
      ],
    },
  },

  // USA Entertainment drill-down
  "entertainment:USA": {
    states: [
      { rank: 1, name: "California", flag: "🇺🇸", stat: "Buzz: 99", trend: "up", entityType: "state", country: "USA" },
      { rank: 2, name: "New York", flag: "🇺🇸", stat: "Buzz: 97", trend: "up", entityType: "state", country: "USA" },
      { rank: 3, name: "Georgia", flag: "🇺🇸", stat: "Buzz: 92", trend: "up", entityType: "state", country: "USA" },
      { rank: 4, name: "Tennessee", flag: "🇺🇸", stat: "Buzz: 89", trend: "same", entityType: "state", country: "USA" },
      { rank: 5, name: "Texas", flag: "🇺🇸", stat: "Buzz: 86", trend: "up", entityType: "state", country: "USA" },
    ] satisfies MockRanking[],
    cities: {
      "California": [
        { rank: 1, name: "Los Angeles", flag: "🇺🇸", stat: "Hollywood: 99", trend: "up", entityType: "city", country: "USA", state: "California" },
        { rank: 2, name: "San Francisco", flag: "🇺🇸", stat: "Indie: 88", trend: "same", entityType: "city", country: "USA", state: "California" },
      ],
      "Georgia": [
        { rank: 1, name: "Atlanta", flag: "🇺🇸", stat: "Music: 97", trend: "up", entityType: "city", country: "USA", state: "Georgia" },
      ],
    },
  },
};

/** Helper to get drill-down data for a category + country */
export function getDrillDown(category: string, country: string): DrillDownData | null {
  return DRILL_DOWN_DATA[`${category}:${country}`] || null;
}

/** Helper to get states for a country in a category */
export function getStatesForCountry(category: string, country: string): MockRanking[] {
  const data = getDrillDown(category, country);
  if (!data) return [];
  return data.states;
}

/** Helper to get cities for a state in a country in a category */
export function getCitiesForState(category: string, country: string, state: string): MockRanking[] {
  const data = getDrillDown(category, country);
  return data?.cities?.[state] || [];
}

export function getStoriesByCategory(category: string): MockStory[] {
  return MOCK_STORIES.filter(s => s.category === category).sort((a, b) => b.heatScore - a.heatScore);
}

export function getStoriesByCountry(country: string): MockStory[] {
  return MOCK_STORIES.filter(s => s.country === country).sort((a, b) => b.heatScore - a.heatScore);
}

export function getBusinessStories(subcategory?: string): MockStory[] {
  return MOCK_STORIES.filter(s => s.category === "business" && (!subcategory || s.businessSubcategory === subcategory));
}

export function getSportsStories(subcategory?: string): MockStory[] {
  return MOCK_STORIES.filter(s => s.category === "sports" && (!subcategory || s.sportsSubcategory === subcategory));
}

export function searchMockStories(query: string): MockStory[] {
  const q = query.toLowerCase();
  return MOCK_STORIES.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.summary.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.country.toLowerCase().includes(q) ||
    (s.city?.toLowerCase().includes(q))
  );
}

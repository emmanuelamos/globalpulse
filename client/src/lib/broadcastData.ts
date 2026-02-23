/*
 * Broadcast Schedule Data
 * Default segments and timetable for the GlobalPulse Broadcasting System
 * One room, segmented schedule — like a real 24-hour news network
 */

export interface BroadcastSegmentDef {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  category: string; // "summary" | "category" | "style" | "interactive"
  durationMinutes: number;
}

export interface TimetableEntry {
  segmentSlug: string;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
}

export interface CountryBroadcaster {
  countryCode: string;
  countryName: string;
  flag: string;
  timezone: string;
  utcOffset: number; // hours from UTC
  primaryLanguage: string;
  broadcasterMale: {
    name: string;
    ethnicity: string;
  };
  broadcasterFemale: {
    name: string;
    ethnicity: string;
  };
  maxDailyCallIns: number;
  demoTranscript: DemoLine[];
}

export interface DemoLine {
  speaker: "male" | "female" | "caller" | "system";
  text: string;
  action?: string; // e.g., "laughs", "phone rings"
}

// ─── Default Broadcast Segments ──────────────────────────────────

export const DEFAULT_SEGMENTS: BroadcastSegmentDef[] = [
  {
    slug: "morning-pulse",
    name: "Morning Pulse",
    description: "Quick rundown of the top stories across all 9 categories. Your daily news briefing.",
    icon: "Sunrise",
    category: "summary",
    durationMinutes: 60,
  },
  {
    slug: "deep-dive",
    name: "The Deep Dive",
    description: "In-depth intellectual analysis of the biggest story of the day. Expert-level takes.",
    icon: "Brain",
    category: "style",
    durationMinutes: 60,
  },
  {
    slug: "sports-hour",
    name: "Sports Hour",
    description: "Live scores, standings, match analysis, and hot takes on the sports world.",
    icon: "Trophy",
    category: "category",
    durationMinutes: 60,
  },
  {
    slug: "business-markets",
    name: "Business & Markets",
    description: "Market open analysis, crypto moves, startup news, and economic trends.",
    icon: "TrendingUp",
    category: "category",
    durationMinutes: 60,
  },
  {
    slug: "the-roast",
    name: "The Roast",
    description: "Savage, no-holds-barred commentary on the day's wildest and most absurd stories.",
    icon: "Flame",
    category: "style",
    durationMinutes: 60,
  },
  {
    slug: "crime-report",
    name: "Crime Report",
    description: "Crime rankings update, breaking crime stories, safety analysis by region.",
    icon: "ShieldAlert",
    category: "category",
    durationMinutes: 60,
  },
  {
    slug: "midday-recap",
    name: "Midday Recap",
    description: "Catch-up summary for people just tuning in. All the morning highlights in 60 minutes.",
    icon: "RefreshCw",
    category: "summary",
    durationMinutes: 60,
  },
  {
    slug: "entertainment-celebrity",
    name: "Entertainment & Celebrity",
    description: "Movies, music, celebrity gossip, viral moments, and pop culture trends.",
    icon: "Star",
    category: "category",
    durationMinutes: 60,
  },
  {
    slug: "the-debate",
    name: "The Debate Hour",
    description: "For, Against, and Indifferent — structured debate on the hottest topic of the day.",
    icon: "Scale",
    category: "style",
    durationMinutes: 60,
  },
  {
    slug: "comedy-hour",
    name: "Comedy Hour",
    description: "Funny takes, meme commentary, 'Florida Man' segments, and viral absurdity.",
    icon: "Laugh",
    category: "style",
    durationMinutes: 60,
  },
  {
    slug: "weather-world",
    name: "Weather & World",
    description: "Global weather events, extreme conditions, natural disasters, and travel alerts.",
    icon: "CloudLightning",
    category: "category",
    durationMinutes: 60,
  },
  {
    slug: "evening-pulse",
    name: "Evening Pulse",
    description: "Full day wrap-up. Everything that happened today in one comprehensive summary.",
    icon: "Sunset",
    category: "summary",
    durationMinutes: 60,
  },
  {
    slug: "call-in-hour",
    name: "Call-In Hour",
    description: "Open phones — listeners call in to discuss any trending topic with our anchors.",
    icon: "Phone",
    category: "interactive",
    durationMinutes: 60,
  },
  {
    slug: "gossip-corner",
    name: "Gossip Corner",
    description: "The juiciest gossip, relationship drama, royal family updates, and social media tea.",
    icon: "MessageSquare",
    category: "category",
    durationMinutes: 60,
  },
  {
    slug: "trending-now",
    name: "Trending Now",
    description: "What's going viral right now? Real-time trending analysis across all platforms.",
    icon: "TrendingUp",
    category: "category",
    durationMinutes: 60,
  },
  {
    slug: "night-owl",
    name: "Night Owl",
    description: "Late-night relaxed segment. Lighter stories, listener messages, and tomorrow's preview.",
    icon: "Moon",
    category: "summary",
    durationMinutes: 60,
  },
];

// ─── Default Global Timetable (UTC/GMT) ──────────────────────────
// Marcus & Victoria's schedule — same every day, admin can rearrange

export const DEFAULT_GLOBAL_TIMETABLE: TimetableEntry[] = [
  { segmentSlug: "morning-pulse",          startHour: 6,  startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "deep-dive",              startHour: 7,  startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "sports-hour",            startHour: 8,  startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "business-markets",       startHour: 9,  startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "the-roast",              startHour: 10, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "crime-report",           startHour: 11, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "midday-recap",           startHour: 12, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "entertainment-celebrity", startHour: 13, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "the-debate",             startHour: 14, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "comedy-hour",            startHour: 15, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "weather-world",          startHour: 16, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "evening-pulse",          startHour: 17, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "call-in-hour",           startHour: 18, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "gossip-corner",          startHour: 19, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "trending-now",           startHour: 20, startMinute: 0, durationMinutes: 60 },
  { segmentSlug: "night-owl",              startHour: 21, startMinute: 0, durationMinutes: 60 },
  // 22:00–05:59 = Replay / Best Of (handled in UI as "Replay" mode)
];

// ─── Top 10 Country Broadcasters ─────────────────────────────────
// Culturally diverse names from different ethnic groups within each country

export const COUNTRY_BROADCASTERS: CountryBroadcaster[] = [
  {
    countryCode: "US",
    countryName: "United States",
    flag: "🇺🇸",
    timezone: "America/New_York",
    utcOffset: -5,
    primaryLanguage: "English",
    broadcasterMale: { name: "DeShawn Williams", ethnicity: "African American" },
    broadcasterFemale: { name: "Sofia Reyes", ethnicity: "Latina / Mexican American" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Good morning America! Sofia Reyes here with your GlobalPulse update." },
      { speaker: "male", text: "And I'm DeShawn Williams. Let's get right into it — the biggest story shaking the nation today." },
      { speaker: "female", text: "So DeShawn, what do you make of these new crime rankings? New York just dropped out of the top 5." },
      { speaker: "male", text: "Honestly? I'm not surprised. The data's been trending that way for months. But wait till you see who took their spot—" },
      { speaker: "female", text: "Oh, this is going to be controversial.", action: "laughs" },
      { speaker: "system", text: "", action: "phone rings" },
      { speaker: "male", text: "We've got our first caller! You're live on GlobalPulse US. What's on your mind?" },
    ],
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    timezone: "Europe/London",
    utcOffset: 0,
    primaryLanguage: "English",
    broadcasterMale: { name: "Kwame Asante", ethnicity: "Ghanaian British" },
    broadcasterFemale: { name: "Sienna Patel", ethnicity: "British Indian" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Good morning, Britain. Sienna Patel here, and you're tuned into GlobalPulse UK." },
      { speaker: "male", text: "Kwame Asante alongside. Right then, let's crack on — the Premier League rankings have shifted overnight." },
      { speaker: "female", text: "Kwame, I have to say, the weather rankings are absolutely wild this week. Scotland's topping the charts again." },
      { speaker: "male", text: "Scotland topping a weather chart? That's like saying rain is wet.", action: "laughs" },
      { speaker: "female", text: "Cheeky! But fair. Let's look at what's trending across the UK today." },
    ],
  },
  {
    countryCode: "NG",
    countryName: "Nigeria",
    flag: "🇳🇬",
    timezone: "Africa/Lagos",
    utcOffset: 1,
    primaryLanguage: "English / Pidgin",
    broadcasterMale: { name: "Adewale Ogundimu", ethnicity: "Yoruba" },
    broadcasterFemale: { name: "Amara Okafor", ethnicity: "Igbo" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Good morning Nigeria! Amara Okafor dey here for your GlobalPulse update." },
      { speaker: "male", text: "Na Adewale Ogundimu dey with you. Omo, today's news no be small o!" },
      { speaker: "female", text: "Adewale, you don see the trending rankings? Naija dey number one for entertainment buzz this week!" },
      { speaker: "male", text: "Ah ah! Na we sabi am now. Afrobeats no dey carry last!", action: "laughs" },
      { speaker: "female", text: "But wait o, the crime report go shock you. Make we look am together." },
      { speaker: "system", text: "", action: "phone rings" },
      { speaker: "male", text: "We get caller! You dey live for GlobalPulse Nigeria. Wetin dey your mind?" },
    ],
  },
  {
    countryCode: "IN",
    countryName: "India",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    utcOffset: 5.5,
    primaryLanguage: "Hindi / English",
    broadcasterMale: { name: "Arjun Sharma", ethnicity: "North Indian / Hindi Belt" },
    broadcasterFemale: { name: "Priya Nair", ethnicity: "South Indian / Keralite" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Namaste India! Priya Nair here with your GlobalPulse morning briefing." },
      { speaker: "male", text: "And I'm Arjun Sharma. Aaj ka sabse bada news — India's cricket rankings just changed everything!" },
      { speaker: "female", text: "Arjun, the business rankings are incredible too. Bangalore is now the #1 startup city in Asia!" },
      { speaker: "male", text: "That's no surprise, yaar. The tech scene there is absolutely on fire." },
      { speaker: "female", text: "Let's break down what's trending across all states today.", action: "laughs" },
    ],
  },
  {
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    timezone: "America/Toronto",
    utcOffset: -5,
    primaryLanguage: "English / French",
    broadcasterMale: { name: "Jean-Pierre Tremblay", ethnicity: "Québécois / French Canadian" },
    broadcasterFemale: { name: "Aaliya Hassan", ethnicity: "Somali Canadian" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Good morning Canada! Aaliya Hassan here, and this is GlobalPulse Canada." },
      { speaker: "male", text: "Bonjour! Jean-Pierre Tremblay avec vous. Let's see what's making waves coast to coast today." },
      { speaker: "female", text: "Jean-Pierre, the weather rankings are — well, it's Canada. We're always on the cold list." },
      { speaker: "male", text: "Oui, but this time Winnipeg beat Yellowknife! That's news!", action: "laughs" },
      { speaker: "female", text: "Only in Canada is that headline-worthy. Let's check the trending stories." },
    ],
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    flag: "🇦🇺",
    timezone: "Australia/Sydney",
    utcOffset: 11,
    primaryLanguage: "English",
    broadcasterMale: { name: "Jarrah Mununggurr", ethnicity: "Indigenous Australian / Yolŋu" },
    broadcasterFemale: { name: "Chloe Nguyen", ethnicity: "Vietnamese Australian" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "G'day Australia! Chloe Nguyen here with your GlobalPulse morning update." },
      { speaker: "male", text: "And I'm Jarrah Mununggurr. Mate, the sports rankings are absolutely bonkers today." },
      { speaker: "female", text: "Jarrah, Australia just cracked the top 3 for sports dominance globally!" },
      { speaker: "male", text: "Cricket, rugby, swimming — we're punching well above our weight, as usual." },
      { speaker: "female", text: "Love it. Let's see what else is trending down under.", action: "laughs" },
    ],
  },
  {
    countryCode: "GH",
    countryName: "Ghana",
    flag: "🇬🇭",
    timezone: "Africa/Accra",
    utcOffset: 0,
    primaryLanguage: "English / Twi",
    broadcasterMale: { name: "Kofi Mensah", ethnicity: "Akan / Ashanti" },
    broadcasterFemale: { name: "Ama Tetteh", ethnicity: "Ga-Adangbe" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Good morning Ghana! Ama Tetteh here for your GlobalPulse briefing." },
      { speaker: "male", text: "Kofi Mensah with you. Charley, today's rankings dey hot!" },
      { speaker: "female", text: "Kofi, Ghana dey climb the entertainment rankings again. Afrobeats no dey stop!" },
      { speaker: "male", text: "At all at all! Black Stars also dey trend for sports. Make we check am." },
      { speaker: "female", text: "Let's go! Ghana to the world!", action: "laughs" },
    ],
  },
  {
    countryCode: "ZA",
    countryName: "South Africa",
    flag: "🇿🇦",
    timezone: "Africa/Johannesburg",
    utcOffset: 2,
    primaryLanguage: "English / Zulu / Afrikaans",
    broadcasterMale: { name: "Thabo Molefe", ethnicity: "Zulu" },
    broadcasterFemale: { name: "Liesel van der Merwe", ethnicity: "Afrikaner" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Good morning South Africa! Liesel van der Merwe here with GlobalPulse." },
      { speaker: "male", text: "Sawubona! Thabo Molefe nami. Eish, today's crime rankings are something else." },
      { speaker: "female", text: "Thabo, Cape Town moved up three spots. The data is quite concerning." },
      { speaker: "male", text: "Ja, but let's also look at the positive — Joburg's business rankings are climbing fast!" },
      { speaker: "female", text: "That's the Rainbow Nation for you — always both sides of the story." },
    ],
  },
  {
    countryCode: "BR",
    countryName: "Brazil",
    flag: "🇧🇷",
    timezone: "America/Sao_Paulo",
    utcOffset: -3,
    primaryLanguage: "Portuguese",
    broadcasterMale: { name: "Lucas Silva", ethnicity: "Afro-Brazilian / Bahian" },
    broadcasterFemale: { name: "Isabela Yamamoto", ethnicity: "Japanese Brazilian / Nikkei" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Bom dia Brasil! Isabela Yamamoto aqui com o GlobalPulse Brasil." },
      { speaker: "male", text: "E eu sou Lucas Silva. Gente, o ranking de esportes hoje tá pegando fogo!" },
      { speaker: "female", text: "Lucas, o Brasil subiu no ranking de futebol de novo! Ninguém segura!" },
      { speaker: "male", text: "É claro! Futebol é nosso, né?", action: "laughs" },
      { speaker: "female", text: "Vamos ver o que mais está em alta no país hoje." },
    ],
  },
  {
    countryCode: "KE",
    countryName: "Kenya",
    flag: "🇰🇪",
    timezone: "Africa/Nairobi",
    utcOffset: 3,
    primaryLanguage: "English / Swahili",
    broadcasterMale: { name: "Otieno Odhiambo", ethnicity: "Luo" },
    broadcasterFemale: { name: "Wanjiku Kamau", ethnicity: "Kikuyu" },
    maxDailyCallIns: 50,
    demoTranscript: [
      { speaker: "female", text: "Habari za asubuhi Kenya! Wanjiku Kamau here with your GlobalPulse update." },
      { speaker: "male", text: "And I'm Otieno Odhiambo. Kenya, the sports rankings have some exciting news for us today!" },
      { speaker: "female", text: "Otieno, our marathon runners are keeping us at the top of the athletics rankings!" },
      { speaker: "male", text: "Sawa sawa! And the business scene in Nairobi — the Silicon Savannah is buzzing." },
      { speaker: "female", text: "Let's dive into all the trending stories across Kenya today.", action: "laughs" },
    ],
  },
];

// ─── Helper: Get current segment based on UTC time ───────────────

export function getCurrentSegment(timetable: TimetableEntry[]): TimetableEntry | null {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  for (const entry of timetable) {
    const entryStart = entry.startHour * 60 + entry.startMinute;
    const entryEnd = entryStart + entry.durationMinutes;
    if (currentTotalMinutes >= entryStart && currentTotalMinutes < entryEnd) {
      return entry;
    }
  }
  return null; // Outside scheduled hours (replay mode)
}

export function getNextSegment(timetable: TimetableEntry[]): TimetableEntry | null {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  const sorted = [...timetable].sort((a, b) => (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute));
  for (const entry of sorted) {
    const entryStart = entry.startHour * 60 + entry.startMinute;
    if (entryStart > currentTotalMinutes) {
      return entry;
    }
  }
  // Wrap around to first segment of next day
  return sorted[0] || null;
}

export function getSegmentBySlug(slug: string): BroadcastSegmentDef | undefined {
  return DEFAULT_SEGMENTS.find((s) => s.slug === slug);
}

// ─── Helper: Adjust timetable for local timezone ─────────────────

export function adjustTimetableForTimezone(
  timetable: TimetableEntry[],
  utcOffset: number
): TimetableEntry[] {
  return timetable.map((entry) => {
    let adjustedHour = entry.startHour + utcOffset;
    if (adjustedHour < 0) adjustedHour += 24;
    if (adjustedHour >= 24) adjustedHour -= 24;
    return { ...entry, startHour: Math.floor(adjustedHour), startMinute: entry.startMinute };
  }).sort((a, b) => (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute));
}

// ─── Helper: Format time ─────────────────────────────────────────

export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

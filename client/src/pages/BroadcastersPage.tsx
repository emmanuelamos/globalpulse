import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Mic, MicOff, Phone, PhoneOff, Globe, MessageCircle,
  Subtitles, Rewind, FastForward, Play, Pause, Circle, Lock,
  Clock, ChevronDown, Users, Send, Crown, Volume2, VolumeX,
  History, Languages, SkipBack, SkipForward, Calendar, Vote,
  Sunrise, Brain, Trophy, TrendingUp, Flame, ShieldAlert,
  RefreshCw, Star, Scale, Laugh, CloudLightning, Sunset,
  Moon, MessageSquare, ArrowLeft
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { COUNTRIES } from "@/lib/mockData";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import OGMeta from "@/components/OGMeta";
import CountryVoteSection from "@/components/CountryVoteSection";
import {
  DEFAULT_SEGMENTS, DEFAULT_GLOBAL_TIMETABLE, COUNTRY_BROADCASTERS,
  getCurrentSegment, getNextSegment, getSegmentBySlug, adjustTimetableForTimezone,
  formatTime, type BroadcastSegmentDef, type TimetableEntry, type CountryBroadcaster, type DemoLine
} from "@/lib/broadcastData";
import { useLanguage } from "@/contexts/LanguageContext";


// ─── Icon map for segments ───────────────────────────────────────
const SEGMENT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Sunrise, Brain, Trophy, TrendingUp, Flame, ShieldAlert,
  RefreshCw, Star, Scale, Laugh, CloudLightning, Sunset,
  Phone, MessageSquare, Moon,
};

function getSegmentIcon(iconName: string) {
  return SEGMENT_ICONS[iconName] || Radio;
}

const SEGMENT_COLORS: Record<string, string> = {
  summary: "from-neon-cyan/20 to-blue-500/20 text-neon-cyan",
  category: "from-neon-magenta/20 to-purple-500/20 text-neon-magenta",
  style: "from-neon-amber/20 to-orange-500/20 text-neon-amber",
  interactive: "from-green-500/20 to-emerald-500/20 text-green-400",
};

// Mock transcript lines for the live broadcast
const MOCK_TRANSCRIPT = [
  { time: "00:00:05", speaker: "Marcus", text: "Good morning, world. You're tuned into GlobalPulse — I'm Marcus, broadcasting live from New York." },
  { time: "00:00:12", speaker: "Victoria", text: "And I'm Victoria, coming to you from London. Brilliant stuff happening today, Marcus." },
  { time: "00:00:20", speaker: "Marcus", text: "Let's kick it off with our top story — Bitcoin just blasted past $95,000. Crypto bros are celebrating, skeptics are sweating." },
  { time: "00:00:32", speaker: "Victoria", text: "Absolutely mental. And speaking of money moves, a Nigerian fintech startup just raised $50 million. Lagos is on fire right now." },
  { time: "00:00:45", speaker: "Marcus", text: "Toronto had a wild heist go wrong — three suspects fled downtown in broad daylight. Canada's crime rankings just took a hit." },
  { time: "00:00:58", speaker: "Victoria", text: "Meanwhile, Taylor Swift added 15 new cities to her tour including Lagos and Mumbai. Tickets sold out in 8 minutes. Eight. Minutes." },
  { time: "00:01:10", speaker: "Marcus", text: "And our funny story of the day — a Florida man joined a police chase thinking it was a flash mob. You can't make this stuff up." },
  { time: "00:01:22", speaker: "Victoria", text: "Classic Florida. Now let's check the rankings — Brazil still leads in crime, Japan remains the safest. Let's take some calls!" },
  { time: "00:01:35", speaker: "Marcus", text: "We've got caller number one from Lagos, Nigeria. You're live on GlobalPulse — what's on your mind?" },
  { time: "00:01:48", speaker: "Caller", text: "Hey Marcus, Victoria! Love the show. I wanted to talk about the fintech boom here in Lagos. It's incredible what's happening." },
];

// Mock past broadcasts
const MOCK_PAST_BROADCASTS = [
  { id: 1, title: "Morning Pulse — Feb 8, 2026", date: "2026-02-08T06:00:00Z", duration: "1:24:30", viewers: 45200, status: "available" as const },
  { id: 2, title: "Evening Wrap — Feb 7, 2026", date: "2026-02-07T18:00:00Z", duration: "1:15:45", viewers: 38900, status: "available" as const },
  { id: 3, title: "Morning Pulse — Feb 7, 2026", date: "2026-02-07T06:00:00Z", duration: "1:30:00", viewers: 42100, status: "available" as const },
  { id: 4, title: "Evening Wrap — Feb 6, 2026", date: "2026-02-06T18:00:00Z", duration: "1:18:20", viewers: 36700, status: "expired" as const },
];

// Mock call-in queue
const MOCK_CALLERS = [
  { id: 1, name: "Chidi O.", country: "NG", flag: "🇳🇬", topic: "Fintech boom in Lagos", waitTime: "2m" },
  { id: 2, name: "Sarah M.", country: "US", flag: "🇺🇸", topic: "Bitcoin price prediction", waitTime: "5m" },
  { id: 3, name: "Raj P.", country: "IN", flag: "🇮🇳", topic: "Bollywood meets AI", waitTime: "8m" },
  { id: 4, name: "Emma W.", country: "GB", flag: "🇬🇧", topic: "Royal family gossip", waitTime: "12m" },
  { id: 5, name: "Yuki T.", country: "JP", flag: "🇯🇵", topic: "Japan's safety record", waitTime: "15m" },
];

// Mock chat messages
const MOCK_CHAT = [
  { id: 1, user: "CryptoKing99", message: "Bitcoin to the moon! 🚀", time: "2m ago" },
  { id: 2, user: "LagosGirl", message: "Nigeria represent! 🇳🇬", time: "2m ago" },
  { id: 3, user: "TorontoVibes", message: "That heist story is wild lol", time: "1m ago" },
  { id: 4, user: "SwiftFan4Ever", message: "TAYLOR SWIFT LAGOS!!! 😭😭", time: "1m ago" },
  { id: 5, user: "FloridaMan", message: "That was my cousin 💀", time: "30s ago" },
  { id: 6, user: "NewsJunkie", message: "Best news app ever, no cap", time: "15s ago" },
];

const SUBTITLE_LANGUAGES = [
  { code: "en", label: "English" }, { code: "es", label: "Español" },
  { code: "fr", label: "Français" }, { code: "hi", label: "हिन्दी" },
  { code: "pt", label: "Português" }, { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" }, { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" }, { code: "de", label: "Deutsch" },
  { code: "sw", label: "Kiswahili" }, { code: "yo", label: "Yorùbá" },
  { code: "ig", label: "Igbo" }, { code: "ha", label: "Hausa" },
];

// ─── Schedule Timetable Component ────────────────────────────────

function ScheduleTimetable({ timetable, timezone }: { timetable: TimetableEntry[]; timezone?: string }) {
  const currentSegment = getCurrentSegment(DEFAULT_GLOBAL_TIMETABLE);
  const nextSegment = getNextSegment(DEFAULT_GLOBAL_TIMETABLE);

  return (
    <div className="space-y-2">
      {timetable.map((entry, i) => {
        const segDef = getSegmentBySlug(entry.segmentSlug);
        if (!segDef) return null;
        const SegIcon = getSegmentIcon(segDef.icon);
        const isCurrent = currentSegment?.segmentSlug === entry.segmentSlug;
        const isNext = nextSegment?.segmentSlug === entry.segmentSlug;
        const colorClass = SEGMENT_COLORS[segDef.category] || SEGMENT_COLORS.summary;

        return (
          <motion.div
            key={entry.segmentSlug}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isCurrent
                ? "bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border-neon-cyan/40 shadow-lg shadow-neon-cyan/5"
                : isNext
                  ? "bg-card/60 border-neon-amber/30"
                  : "bg-card/30 border-border/20 hover:border-border/40"
            }`}
          >
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
              <SegIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate">{segDef.name}</span>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse border border-red-500/30">
                    LIVE NOW
                  </span>
                )}
                {isNext && (
                  <span className="px-1.5 py-0.5 rounded-full bg-neon-amber/20 text-neon-amber text-[10px] font-bold border border-neon-amber/30">
                    UP NEXT
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{segDef.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-mono font-semibold">
                {formatTime(entry.startHour, entry.startMinute)}
              </div>
              <div className="text-[10px] text-muted-foreground">{entry.durationMinutes}min</div>
            </div>
          </motion.div>
        );
      })}

      {/* Replay period */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-card/20 border border-border/10 opacity-50">
        <div className="p-2 rounded-lg bg-secondary/30">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-muted-foreground">Replay / Best Of</span>
          <p className="text-xs text-muted-foreground">Highlights from today's broadcast on repeat</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-muted-foreground">10:00 PM</div>
          <div className="text-[10px] text-muted-foreground">8hrs</div>
        </div>
      </div>
    </div>
  );
}

// ─── Country Room Demo Component ─────────────────────────────────

function CountryRoomDemo({ broadcaster }: { broadcaster: CountryBroadcaster }) {
  const [demoIndex, setDemoIndex] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoWaveform, setDemoWaveform] = useState<number[]>(Array(30).fill(0).map(() => Math.random()));

  useEffect(() => {
    if (!isPlayingDemo) return;
    const interval = setInterval(() => {
      setDemoWaveform(Array(30).fill(0).map(() => Math.random()));
      setDemoIndex((prev) => {
        if (prev >= broadcaster.demoTranscript.length - 1) {
          setIsPlayingDemo(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlayingDemo, broadcaster.demoTranscript.length]);

  const currentLine = broadcaster.demoTranscript[demoIndex];

  return (
    <div className="space-y-4">
      {/* Broadcaster avatars */}
      <div className="flex items-center justify-center gap-6 py-4">
        <div className={`text-center transition-all ${currentLine?.speaker === "male" ? "opacity-100 scale-105" : "opacity-60"}`}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white mb-1 ring-2 ring-offset-2 ring-offset-background ring-blue-500/50">
            {broadcaster.broadcasterMale.name.charAt(0)}
          </div>
          <span className="text-xs font-semibold block">{broadcaster.broadcasterMale.name.split(" ")[0]}</span>
          <span className="text-[10px] text-muted-foreground">{broadcaster.broadcasterMale.ethnicity}</span>
        </div>
        <div className={`text-center transition-all ${currentLine?.speaker === "female" ? "opacity-100 scale-105" : "opacity-60"}`}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-xl font-bold text-white mb-1 ring-2 ring-offset-2 ring-offset-background ring-pink-500/50">
            {broadcaster.broadcasterFemale.name.charAt(0)}
          </div>
          <span className="text-xs font-semibold block">{broadcaster.broadcasterFemale.name.split(" ")[0]}</span>
          <span className="text-[10px] text-muted-foreground">{broadcaster.broadcasterFemale.ethnicity}</span>
        </div>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center gap-[2px] h-10">
        {demoWaveform.map((v, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-neon-magenta to-neon-cyan"
            animate={{ height: isPlayingDemo ? `${v * 36 + 4}px` : "4px" }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>

      {/* Demo transcript display */}
      <div className="p-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 min-h-[60px]">
        {currentLine?.action && !currentLine.text && (
          <p className="text-xs text-muted-foreground italic text-center">*{currentLine.action}*</p>
        )}
        {currentLine?.text && (
          <>
            {currentLine.action && (
              <p className="text-xs text-muted-foreground italic mb-1">*{currentLine.action}*</p>
            )}
            <p className="text-sm">
              <span className={`font-bold ${
                currentLine.speaker === "male" ? "text-blue-400" :
                currentLine.speaker === "female" ? "text-pink-400" :
                currentLine.speaker === "caller" ? "text-amber-400" :
                "text-muted-foreground"
              }`}>
                {currentLine.speaker === "male" ? broadcaster.broadcasterMale.name.split(" ")[0] :
                 currentLine.speaker === "female" ? broadcaster.broadcasterFemale.name.split(" ")[0] :
                 currentLine.speaker === "caller" ? "Caller" : "System"}:
              </span>{" "}
              {currentLine.text}
            </p>
          </>
        )}
        {!currentLine && (
          <p className="text-xs text-muted-foreground text-center">Press play to hear a demo</p>
        )}
      </div>

      {/* Play demo button */}
      <button
        onClick={() => {
          if (isPlayingDemo) {
            setIsPlayingDemo(false);
          } else {
            setDemoIndex(0);
            setIsPlayingDemo(true);
          }
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-magenta to-neon-cyan text-white text-sm font-bold hover:opacity-90 transition-opacity"
      >
        {isPlayingDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isPlayingDemo ? "Pause Demo" : "Play Demo Broadcast"}
      </button>
    </div>
  );
}

// ─── Main BroadcastersPage ───────────────────────────────────────

export default function BroadcastersPage() {
  const { user, isAuthenticated } = useAuth();
  const isPremium = user?.subscriptionTier === "premium";

  const { t } = useLanguage();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(65);
  const [showCC, setShowCC] = useState(false);
  const [ccLanguage, setCcLanguage] = useState("en");
  const [showCCLangPicker, setShowCCLangPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "schedule" | "past" | "rooms">("live");
  const [activeRoom, setActiveRoom] = useState("global");
  const [selectedCountryRoom, setSelectedCountryRoom] = useState<CountryBroadcaster | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  // Simulated waveform bars
  const [waveform, setWaveform] = useState<number[]>(Array(40).fill(0).map(() => Math.random()));
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveform(Array(40).fill(0).map(() => Math.random()));
      setCurrentTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Current transcript line based on time
  const currentTranscriptIndex = useMemo(() => {
    const timeInSeconds = currentTime;
    for (let i = MOCK_TRANSCRIPT.length - 1; i >= 0; i--) {
      const parts = MOCK_TRANSCRIPT[i].time.split(":").map(Number);
      const lineSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (timeInSeconds >= lineSeconds) return i;
    }
    return 0;
  }, [currentTime]);

  const fmtTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleRewind = () => {
    if (!isPremium) { setShowPremiumGate(true); return; }
    setCurrentTime(prev => Math.max(0, prev - 30));
  };

  const handleRecord = () => {
    if (!isPremium) { setShowPremiumGate(true); return; }
    setIsRecording(!isRecording);
  };

  const handlePastBroadcast = (id: number) => {
    if (!isPremium) { setShowPremiumGate(true); return; }
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    if (!isAuthenticated) return;
    setChatMessages(prev => [...prev, {
      id: prev.length + 1,
      user: user?.name || "Anonymous",
      message: chatMessage,
      time: "Just now",
    }]);
    setChatMessage("");
  };

  return (
    <AppLayout>
      <OGMeta title="GlobalPulse — Broadcasters Room" description="Live AI-powered news broadcasts with Marcus and Victoria. Call in, listen live, and get the pulse of the world in real time." />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="p-2 rounded-xl bg-gradient-to-r from-neon-magenta to-neon-cyan">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            {/* Translated: Broadcasters Room */}
            <h1 className="text-3xl md:text-4xl font-bold font-display">
              {t("broadcast.title")}
            </h1>
            {/* Translated: LIVE */}
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse border border-red-500/30">
              {t("trendsPage.live").toUpperCase()}
            </span>
          </div>
          {/* Translated: AI-powered news anchors subtitle */}
          <p className="text-muted-foreground">
            {t("broadcast.subtitle")}
          </p>
        </motion.div>

        <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-neon-magenta/10 via-card/50 to-neon-cyan/10 border border-border/30 p-3">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {/* Translated: Today's Segments */}
            <span className="text-xs font-display font-bold text-neon-cyan uppercase tracking-wider shrink-0">
              {t("broadcast.upcoming").replace(":", "")}:
            </span>
            
            {DEFAULT_GLOBAL_TIMETABLE.map((entry) => {
              const seg = getSegmentBySlug(entry.segmentSlug);
              if (!seg) return null;
              const isCurrent = getCurrentSegment(DEFAULT_GLOBAL_TIMETABLE)?.segmentSlug === entry.segmentSlug;
              return (
                <span
                  key={entry.segmentSlug}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    isCurrent
                      ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                      : "bg-card/30 border-border/20 text-muted-foreground"
                  }`}
                >
                  {formatTime(entry.startHour, entry.startMinute)} — {seg.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {[
            { id: "live" as const, label: t("broadcast.nav.live"), icon: Radio },
            { id: "schedule" as const, label: t("broadcast.nav.schedule"), icon: Calendar },
            { id: "past" as const, label: t("broadcast.nav.past"), icon: History },
            { id: "rooms" as const, label: t("broadcast.nav.rooms"), icon: Globe },
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedCountryRoom(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-neon-magenta to-neon-cyan text-white shadow-lg"
                    : "bg-card/50 border border-border/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <TabIcon className="w-4 h-4" /> {tab.label}
                {tab.id === "past" && !isPremium && <Lock className="w-3 h-3 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* ═══════════════ LIVE TAB ═══════════════ */}
        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Broadcast Area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Broadcast Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 border border-border/30 backdrop-blur-sm"
              >
                {/* Anchor Display */}
                <div className="relative p-6 bg-gradient-to-r from-neon-magenta/10 via-transparent to-neon-cyan/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Marcus */}
                      <div className={`text-center ${MOCK_TRANSCRIPT[currentTranscriptIndex]?.speaker === "Marcus" ? "opacity-100 scale-105" : "opacity-60"} transition-all`}>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white mb-1 ring-2 ring-offset-2 ring-offset-background ring-blue-500/50">
                          M
                        </div>
                        <span className="text-xs font-semibold">Marcus</span>
                        <div className="text-[10px] text-muted-foreground">🇺🇸 NYC</div>
                      </div>
                      {/* Victoria */}
                      <div className={`text-center ${MOCK_TRANSCRIPT[currentTranscriptIndex]?.speaker === "Victoria" ? "opacity-100 scale-105" : "opacity-60"} transition-all`}>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-2xl font-bold text-white mb-1 ring-2 ring-offset-2 ring-offset-background ring-pink-500/50">
                          V
                        </div>
                        <span className="text-xs font-semibold">Victoria</span>
                        <div className="text-[10px] text-muted-foreground">🇬🇧 London</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Users className="w-3 h-3" />
                        <span className="font-mono">47,832 listening</span>
                      </div>
                      <div className="text-xs text-red-400 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        LIVE — {fmtTime(currentTime)}
                      </div>
                    </div>
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="flex items-center justify-center gap-[2px] h-16 mb-4">
                    {waveform.map((v, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 rounded-full bg-gradient-to-t from-neon-magenta to-neon-cyan"
                        animate={{ height: isPlaying ? `${v * 60 + 4}px` : "4px" }}
                        transition={{ duration: 0.15 }}
                      />
                    ))}
                  </div>

                  {/* CC/Subtitle Display */}
                  <AnimatePresence>
                    {showCC && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-4 p-3 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Subtitles className="w-3 h-3 text-neon-cyan" />
                          <span className="text-[10px] text-neon-cyan font-semibold uppercase">
                            CC — {SUBTITLE_LANGUAGES.find(l => l.code === ccLanguage)?.label}
                          </span>
                        </div>
                        <p className="text-sm text-white font-medium">
                          <span className="text-neon-cyan font-bold">{MOCK_TRANSCRIPT[currentTranscriptIndex]?.speaker}: </span>
                          {MOCK_TRANSCRIPT[currentTranscriptIndex]?.text}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRewind}
                        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                        title={isPremium ? "Rewind 30s" : "Premium only"}
                      >
                        <SkipBack className="w-5 h-5" />
                        {!isPremium && <Lock className="w-2.5 h-2.5 absolute top-0.5 right-0.5 text-amber-400" />}
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 rounded-xl bg-gradient-to-r from-neon-magenta to-neon-cyan text-white hover:opacity-90 transition-opacity"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
                        <SkipForward className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowCC(!showCC)}
                          className={`p-2 rounded-lg transition-colors ${showCC ? "bg-neon-cyan/20 text-neon-cyan" : "hover:bg-white/10 text-muted-foreground hover:text-foreground"}`}
                        >
                          <Subtitles className="w-5 h-5" />
                        </button>
                      </div>
                      {showCC && (
                        <div className="relative">
                          <button
                            onClick={() => setShowCCLangPicker(!showCCLangPicker)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-card/50 border border-border/30 text-xs font-semibold"
                          >
                            <Languages className="w-3 h-3" />
                            {SUBTITLE_LANGUAGES.find(l => l.code === ccLanguage)?.label}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <AnimatePresence>
                            {showCCLangPicker && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute bottom-full right-0 mb-2 w-48 max-h-60 overflow-y-auto rounded-xl bg-card border border-border/50 shadow-xl z-50"
                              >
                                {SUBTITLE_LANGUAGES.map(lang => (
                                  <button
                                    key={lang.code}
                                    onClick={() => { setCcLanguage(lang.code); setShowCCLangPicker(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${ccLanguage === lang.code ? "text-neon-cyan bg-neon-cyan/10" : ""}`}
                                  >
                                    {lang.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      <button
                        onClick={handleRecord}
                        className={`relative p-2 rounded-lg transition-colors ${isRecording ? "bg-red-500/20 text-red-400" : "hover:bg-white/10 text-muted-foreground hover:text-foreground"}`}
                        title={isPremium ? (isRecording ? "Stop Recording" : "Record") : "Premium only"}
                      >
                        <Circle className={`w-5 h-5 ${isRecording ? "fill-red-400 animate-pulse" : ""}`} />
                        {!isPremium && <Lock className="w-2.5 h-2.5 absolute top-0.5 right-0.5 text-amber-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Transcript */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-card/50 border border-border/30 p-4 max-h-80 overflow-y-auto"
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Live Transcript
                </h3>
                <div className="space-y-3">
                  {MOCK_TRANSCRIPT.slice(0, currentTranscriptIndex + 1).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: i === currentTranscriptIndex ? 1 : 0.6, x: 0 }}
                      className="flex gap-3"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0 pt-1">{line.time}</span>
                      <div>
                        <span className={`text-xs font-bold ${
                          line.speaker === "Marcus" ? "text-blue-400" :
                          line.speaker === "Victoria" ? "text-pink-400" :
                          "text-amber-400"
                        }`}>
                          {line.speaker}
                        </span>
                        <p className="text-sm">{line.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Call-In Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-card/50 border border-border/30 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Call-In Queue
                    <span className="text-[10px] font-mono text-neon-cyan">100 slots/day</span>
                  </h3>
                  <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-magenta to-neon-cyan text-white text-xs font-bold hover:opacity-90 transition-opacity">
                    <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Join Queue — $0.99</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {MOCK_CALLERS.map((caller, i) => (
                    <div key={caller.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${i === 0 ? "bg-green-500/10 border border-green-500/30" : "bg-card/30 border border-border/20"}`}>
                      <span className="text-lg">{caller.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{caller.name}</span>
                          {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">NEXT UP</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">{caller.topic}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{caller.waitTime}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar — Live Chat */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-card/50 border border-border/30 flex flex-col h-[600px]"
              >
                <div className="p-4 border-b border-border/30">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-neon-cyan" /> Live Chat
                    <span className="ml-auto text-xs text-muted-foreground font-mono">
                      <Users className="w-3 h-3 inline mr-1" />47,832
                    </span>
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="text-sm">
                      <span className="font-semibold text-neon-cyan">{msg.user}</span>
                      <span className="text-muted-foreground mx-1">·</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                      <p className="text-foreground/90">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border/30">
                  {isAuthenticated ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={e => setChatMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendChat()}
                        placeholder="Say something..."
                        className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border/30 text-sm focus:outline-none focus:border-neon-cyan/50"
                      />
                      <button
                        onClick={handleSendChat}
                        className="p-2 rounded-lg bg-gradient-to-r from-neon-magenta to-neon-cyan text-white hover:opacity-90"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <a href={getLoginUrl()} className="block text-center text-sm text-neon-cyan hover:underline">
                      Sign in to chat
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ═══════════════ SCHEDULE TAB ═══════════════ */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-neon-cyan" />
                <h2 className="text-xl font-display font-bold">Today's Broadcast Schedule</h2>
                <span className="text-xs text-muted-foreground font-mono">(UTC/GMT)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Marcus & Victoria broadcast live from 6:00 AM to 10:00 PM UTC. Each segment runs for 60 minutes.
                Check back tomorrow — the admin can rearrange segments based on listener feedback.
              </p>
              <ScheduleTimetable timetable={DEFAULT_GLOBAL_TIMETABLE} />
            </motion.div>
          </div>
        )}

        {/* ═══════════════ PAST BROADCASTS TAB ═══════════════ */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {!isPremium && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3"
              >
                <Crown className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-400">Premium Feature</p>
                  <p className="text-xs text-muted-foreground">Subscribe to Premium ($4/mo) to access past broadcasts, rewind live shows, and record broadcasts. Past broadcasts are available for 48 hours.</p>
                </div>
                <button className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:opacity-90">
                  Upgrade
                </button>
              </motion.div>
            )}

            {MOCK_PAST_BROADCASTS.map((broadcast, i) => (
              <motion.div
                key={broadcast.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handlePastBroadcast(broadcast.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  broadcast.status === "expired"
                    ? "bg-card/20 border-border/20 opacity-50"
                    : isPremium
                      ? "bg-card/50 border-border/30 hover:border-neon-cyan/40"
                      : "bg-card/30 border-border/20"
                }`}
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20">
                  {broadcast.status === "expired" ? (
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  ) : isPremium ? (
                    <Play className="w-6 h-6 text-neon-cyan" />
                  ) : (
                    <Lock className="w-6 h-6 text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{broadcast.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{broadcast.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{broadcast.viewers.toLocaleString()} viewers</span>
                    {broadcast.status === "expired" && <span className="text-red-400 font-semibold">Expired (48hr limit)</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ═══════════════ COUNTRY ROOMS TAB ═══════════════ */}
        {activeTab === "rooms" && !selectedCountryRoom && (
          <div className="space-y-8">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Each country has its own AI broadcasters speaking the local language, covering the top stories from that region. 50 call-in slots per country room.
              </p>

              {/* Global Room */}
              <div className="mb-6">
                <h3 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Global Room</h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setActiveTab("live")}
                  className="p-4 rounded-xl border cursor-pointer transition-all bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 border-neon-cyan/40 shadow-lg shadow-neon-cyan/10 hover:shadow-neon-cyan/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-8 h-8 text-neon-cyan" />
                    <div>
                      <h3 className="font-bold">Global Room — Marcus & Victoria</h3>
                      <p className="text-xs text-muted-foreground">English • UTC/GMT • 100 call-in slots/day</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />47,832</span>
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Active Country Rooms */}
              <h3 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Active Country Rooms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {COUNTRY_BROADCASTERS.map((cb, i) => (
                  <motion.div
                    key={cb.countryCode}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCountryRoom(cb)}
                    className="p-4 rounded-xl border cursor-pointer transition-all bg-card/50 border-border/30 hover:border-neon-cyan/30 hover:shadow-lg hover:shadow-neon-cyan/5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{cb.flag}</span>
                      <div>
                        <h3 className="font-bold">{cb.countryName}</h3>
                        <p className="text-xs text-muted-foreground">{cb.primaryLanguage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
                          {cb.broadcasterMale.name.charAt(0)}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
                          {cb.broadcasterFemale.name.charAt(0)}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {cb.broadcasterMale.name.split(" ")[0]} & {cb.broadcasterFemale.name.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{cb.maxDailyCallIns} slots</span>
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Country Vote Section */}
            <CountryVoteSection />
          </div>
        )}

        {/* ═══════════════ SELECTED COUNTRY ROOM DETAIL ═══════════════ */}
        {activeTab === "rooms" && selectedCountryRoom && (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedCountryRoom(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Country Rooms
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Room Header */}
              <div className="rounded-2xl bg-gradient-to-r from-neon-magenta/10 via-card/50 to-neon-cyan/10 border border-border/30 p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{selectedCountryRoom.flag}</span>
                  <div>
                    <h2 className="text-2xl font-display font-bold">{selectedCountryRoom.countryName} Room</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedCountryRoom.primaryLanguage} • {selectedCountryRoom.timezone} (UTC{selectedCountryRoom.utcOffset >= 0 ? "+" : ""}{selectedCountryRoom.utcOffset}) • {selectedCountryRoom.maxDailyCallIns} call-in slots/day
                    </p>
                  </div>
                </div>

                {/* Broadcaster info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-lg font-bold text-white">
                      {selectedCountryRoom.broadcasterMale.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{selectedCountryRoom.broadcasterMale.name}</div>
                      <div className="text-xs text-muted-foreground">{selectedCountryRoom.broadcasterMale.ethnicity}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-lg font-bold text-white">
                      {selectedCountryRoom.broadcasterFemale.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{selectedCountryRoom.broadcasterFemale.name}</div>
                      <div className="text-xs text-muted-foreground">{selectedCountryRoom.broadcasterFemale.ethnicity}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Broadcast */}
              <div className="rounded-2xl bg-card/50 border border-border/30 p-6 mb-6">
                <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-neon-magenta" /> Demo Broadcast
                </h3>
                <CountryRoomDemo broadcaster={selectedCountryRoom} />
              </div>

              {/* Local Schedule */}
              <div className="rounded-2xl bg-card/50 border border-border/30 p-6">
                <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-neon-cyan" /> Local Schedule
                  <span className="text-xs text-muted-foreground font-mono">({selectedCountryRoom.timezone})</span>
                </h3>
                <ScheduleTimetable
                  timetable={adjustTimetableForTimezone(DEFAULT_GLOBAL_TIMETABLE, selectedCountryRoom.utcOffset)}
                  timezone={selectedCountryRoom.timezone}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Premium Gate Modal */}
        <AnimatePresence>
          {showPremiumGate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPremiumGate(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-card border border-border/50 p-6 shadow-2xl"
              >
                {/* PREMIUM GATE MODAL */}
                <div className="w-full max-w-md rounded-2xl bg-card border border-border/50 p-6 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-amber-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">{t("broadcast.premiumGate.title")}</h2>
                    <p className="text-muted-foreground mb-6">
                      {t("broadcast.premiumGate.description")}
                    </p>

                    <ul className="text-left space-y-2 mb-6">
                      {[
                        t("broadcast.features.rewind"),
                        t("broadcast.features.record"),
                        t("broadcast.features.archive"),
                        t("broadcast.features.adFree"),
                        t("broadcast.features.priority"),
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg hover:opacity-90 transition-opacity">
                      {t("broadcast.premiumGate.subscribe")}
                    </button>
                    
                    <button
                      onClick={() => setShowPremiumGate(false)}
                      className="mt-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {t("broadcast.premiumGate.later")}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

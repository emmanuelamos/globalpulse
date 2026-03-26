"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Phone, Volume2, VolumeX, Subtitles, History, 
  Circle, Lock, MessageCircle, Users, Send, Sunrise, Brain, 
  Trophy, TrendingUp, Flame, ShieldAlert, RefreshCw, Star, 
  Scale, Laugh, CloudLightning, Sunset, Moon, MessageSquare, 
  Play, Pause, Calendar, Globe, Crown, ArrowLeft, Clock
} from "lucide-react";

// Components
import AppLayout from "@/components/AppLayout";
import OGMeta from "@/components/OGMeta";
import VoiceRecorder from "@/components/VoiceRecorder";
import CountryVoteSection from "@/components/CountryVoteSection";

// Hooks & Libs
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginUrl } from "@/const";
import { 
  DEFAULT_GLOBAL_TIMETABLE, getCurrentSegment, getNextSegment, 
  getSegmentBySlug, formatTime, type TimetableEntry, type CountryBroadcaster,
  COUNTRY_BROADCASTERS 
} from "@/lib/broadcastData";

// --- Types & Constants ---
export type AnchorName = "Marcus" | "Victoria" | "Elena" | "Jax" | "Riley";
const ANCHORS: Record<AnchorName, { role: string; color: string; ringClass: string; textClass: string; bgClass: string }> = {
  Marcus:   { role: "Main Host", color: "blue", ringClass: "ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]", textClass: "text-blue-400", bgClass: "from-blue-500 to-cyan-500" },
  Victoria: { role: "Main Host", color: "pink", ringClass: "ring-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]", textClass: "text-pink-400", bgClass: "from-pink-500 to-rose-500" },
  Elena:    { role: "Serious Analysis", color: "emerald", ringClass: "ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]", textClass: "text-emerald-400", bgClass: "from-emerald-500 to-teal-500" },
  Jax:      { role: "Roast / Comedy", color: "amber", ringClass: "ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]", textClass: "text-amber-400", bgClass: "from-amber-500 to-orange-500" },
  Riley:    { role: "Viral & Pop", color: "purple", ringClass: "ring-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]", textClass: "text-purple-400", bgClass: "from-purple-500 to-indigo-500" }
};

const MOCK_PAST_BROADCASTS: { id: number; title: string; duration: string; viewers: number; status: "available" | "expired" }[] = [
  { id: 1, title: "Morning Pulse — Feb 8, 2026", duration: "1:24:30", viewers: 45200, status: "available" },
  { id: 2, title: "Evening Wrap — Feb 7, 2026", duration: "1:15:45", viewers: 38900, status: "available" },
  { id: 3, title: "Global Late Night — Feb 6, 2026", duration: "2:00:10", viewers: 12000, status: "expired" },
];

// --- Helper Components ---

function ScheduleTimetable({ timetable }: { timetable: TimetableEntry[] }) {
  const currentSegment = getCurrentSegment(timetable);
  return (
    <div className="space-y-2">
      {timetable.map((entry, i) => {
        const segDef = getSegmentBySlug(entry.segmentSlug);
        if (!segDef) return null;
        const isCurrent = currentSegment?.segmentSlug === entry.segmentSlug;

        return (
          <motion.div
            key={entry.segmentSlug}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isCurrent ? "bg-neon-cyan/10 border-neon-cyan/40 shadow-lg" : "bg-card/30 border-border/20"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate">{segDef.name}</span>
                {isCurrent && <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">LIVE</span>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{segDef.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-mono font-semibold">{formatTime(entry.startHour, entry.startMinute)}</div>
              <div className="text-[10px] text-muted-foreground">{entry.durationMinutes}m</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function CountryRoomDemo({ broadcaster }: { broadcaster: CountryBroadcaster }) {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-6 py-4">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white mb-1`}>
            {broadcaster.broadcasterMale.name.charAt(0)}
          </div>
          <span className="text-xs font-semibold block">{broadcaster.broadcasterMale.name}</span>
        </div>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-xl font-bold text-white mb-1`}>
            {broadcaster.broadcasterFemale.name.charAt(0)}
          </div>
          <span className="text-xs font-semibold block">{broadcaster.broadcasterFemale.name}</span>
        </div>
      </div>
      <button
        onClick={() => setIsPlayingDemo(!isPlayingDemo)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-magenta to-neon-cyan text-white text-sm font-bold"
      >
        {isPlayingDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isPlayingDemo ? "Stop Sample" : "Play Sample Broadcast"}
      </button>
    </div>
  );
}

export default function BroadcastersPage() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const isPremium = user?.subscriptionTier === "premium";
  
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<"live" | "schedule" | "past" | "rooms">("live");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCC, setShowCC] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [selectedCountryRoom, setSelectedCountryRoom] = useState<CountryBroadcaster | null>(null);

  // --- CALL-IN STATE ---
  const [showRecorder, setShowRecorder] = useState(false);
  const [callTopic, setCallTopic] = useState("");
  const [isUploadingCall, setIsUploadingCall] = useState(false);

  // --- BROADCAST ENGINE STATE ---
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<AnchorName | null>(null);
  const [broadcastHistory, setBroadcastHistory] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasSyncedTrack = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- tRPC QUERIES ---
  const { data: roomState } = trpc.broadcast.getState.useQuery(
    { roomSlug: "global" },
    { refetchInterval: 2000, enabled: isListening }
  );

  const { data: callerQueue, refetch: refetchQueue } = trpc.callIns.queue.useQuery({ 
    room: "global" 
  });

  const { data: chatData, refetch: refetchChat } = trpc.broadcastChat.getRecent.useQuery(
    { roomSlug: "global", limit: 50 },
    { refetchInterval: 3000 }
  );

  const sendMessageMutation = trpc.broadcastChat.send.useMutation({
    onSuccess: () => { setChatMessage(""); refetchChat(); },
  });

  // --- PLAYLIST LOGIC ---
  useEffect(() => {
    console.log("Room State Received:", roomState);
    if (roomState?.currentAudioUrl) {
      try {
        const parsed = JSON.parse(roomState.currentAudioUrl);
        setPlaylist(Array.isArray(parsed) ? parsed : [parsed]);
        setCurrentIndex(0);
        hasSyncedTrack.current = false;
      } catch (e) {
        console.error("Failed to parse playlist", e);
        setPlaylist([{ url: roomState.currentAudioUrl, text: roomState.currentText, type: 'ai', speaker: roomState.currentSpeaker }]);
        hasSyncedTrack.current = false;
      }
    }
  }, [roomState?.currentAudioUrl]);

  const currentTrack = playlist[currentIndex];
  const currentText = currentTrack?.text || "";
  const currentSpeakerType = currentTrack?.type || 'ai';

  // --- AUDIO SYNC ---
  useEffect(() => {
    if (!isListening || !currentTrack?.url) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    // LOG 1: What did the server send?
    console.log("🔊 Playing Track:", {
      url: currentTrack.url,
      text: currentTrack.text?.substring(0, 30) + "...",
      speakerFromServer: currentTrack.speaker || roomState?.currentSpeaker,
      type: currentTrack.type
    });

    if (!audioRef.current || audioRef.current.src !== currentTrack.url) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.muted = isMuted;
      audioRef.current.onended = () => {
        if (currentIndex < playlist.length - 1) setCurrentIndex(prev => prev + 1);
      };
      audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
    }

    // --- SYNC LOGIC ---
    if (currentIndex === 0 && roomState?.elapsedSeconds !== undefined && !hasSyncedTrack.current) {
        console.log(`⏱️ Syncing Audio: Starting at ${roomState.elapsedSeconds}s`);
        audioRef.current.currentTime = roomState.elapsedSeconds;
        hasSyncedTrack.current = true;
    }

    // --- SPEAKER FIX ---
    const rawSpeaker = (currentTrack.speaker || roomState?.currentSpeaker) as string;
    if (rawSpeaker) {
      // Normalizes 'MARCUS' to 'Marcus'
      const normalized = rawSpeaker.charAt(0).toUpperCase() + rawSpeaker.slice(1).toLowerCase();
      setCurrentSpeaker(normalized as AnchorName);
    }

    setIsPlaying(true);
  }, [currentTrack, isListening, roomState?.elapsedSeconds, currentIndex]);

  // --- HANDLERS ---
  const toggleListening = () => setIsListening(!isListening);

const createCallCheckout = trpc.payments.createCallInCheckout.useMutation({
  onSuccess: (data) => {
    if (data.url) window.location.href = data.url;
  },
});

  const handleVoiceUpload = async (audioBlob: Blob) => {
    if (!callTopic.trim()) return alert("Please enter a topic first!");
    setIsUploadingCall(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("topic", callTopic);
      formData.append("userId", String(user?.id || 0));

      console.log("🚀 Starting upload...");
      const res = await fetch("/api/upload-call", { method: "POST", body: formData });
      
      if (!res.ok) throw new Error("Upload failed on server");

      const result = await res.json();
      console.log("📥 Server Response:", result); // CHECK THIS IN BROWSER CONSOLE

      if (result.callId) {
        console.log("💳 Triggering Stripe for Call ID:", result.callId);
        createCallCheckout.mutate({ 
          origin: window.location.origin,
          room: "global",
          callId: Number(result.callId) // Force to Number
        });
      } else {
        console.error("❌ No Call ID returned from server!");
      }
    } catch (err) {
      console.error("🚨 handleVoiceUpload Error:", err);
      setIsUploadingCall(false);
    }
  };

  const handleSendChat = () => {
    if (!chatMessage.trim() || !isAuthenticated) return;
    sendMessageMutation.mutate({ roomSlug: "global", message: chatMessage });
  };

  const handlePastBroadcast = (id: number) => {
    if (!isPremium) {
      setShowPremiumGate(true);
      return;
    }
    // Implement your playback logic for archived IDs here
    console.log("Loading past broadcast ID:", id);
  };

  const [waveform] = useState<number[]>(Array(40).fill(0).map(() => Math.random()));

  return (
    <AppLayout>
      <OGMeta title="GlobalPulse — Broadcasters Room" description="Live AI-powered news broadcasts with Marcus, Victoria, and the team." />
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
            <h1 className="text-3xl md:text-4xl font-bold font-display">{t("broadcast.title") || "The Live Desk"}</h1>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse border border-red-500/30">
              {t("trendsPage.live")?.toUpperCase() || "LIVE"}
            </span>
          </div>
          <p className="text-muted-foreground">{t("broadcast.subtitle") || "24/7 Global Audio Stream"}</p>
        </motion.div>

        {/* Schedule Bar */}
        <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-neon-magenta/10 via-card/50 to-neon-cyan/10 border border-border/30 p-3">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-display font-bold text-neon-cyan uppercase tracking-wider shrink-0">
              {(t("broadcast.upcoming") || "UPCOMING").replace(":", "")}:
            </span>
            {DEFAULT_GLOBAL_TIMETABLE.map((entry) => {
              const seg = getSegmentBySlug(entry.segmentSlug);
              if (!seg) return null;
              const isCurrent = getCurrentSegment(DEFAULT_GLOBAL_TIMETABLE)?.segmentSlug === entry.segmentSlug;
              return (
                <span
                  key={entry.segmentSlug}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    isCurrent ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse" : "bg-card/30 border-border/20 text-muted-foreground"
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
            { id: "live" as const, label: t("broadcast.nav.live") || "Live Stream", icon: Radio },
            { id: "schedule" as const, label: t("broadcast.nav.schedule") || "Schedule", icon: Calendar },
            { id: "past" as const, label: t("broadcast.nav.past") || "Past Shows", icon: History },
            { id: "rooms" as const, label: t("broadcast.nav.rooms") || "Country Rooms", icon: Globe },
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
            <div className="lg:col-span-2 space-y-4">
              
              {/* Broadcast Player */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 border border-border/30 backdrop-blur-sm">
                <div className="relative p-6 bg-gradient-to-r from-background/50 via-transparent to-background/50">
                  
                  {/* FULL CAST ROSTER UI */}
                  <div className="flex justify-between items-start mb-6 p-1">
                    <div className="flex gap-4 items-end overflow-x-auto p-6 scrollbar-hide">
                      {(Object.keys(ANCHORS) as AnchorName[]).map((anchor) => {
                        const isActive = currentSpeaker === anchor;
                        const data = ANCHORS[anchor];
                        return (
                          <div key={anchor} className={`flex flex-col items-center transition-all duration-500 shrink-0 ${isActive ? "opacity-100 scale-110 -translate-y-2" : "opacity-40 scale-90"}`}>
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${data.bgClass} flex items-center justify-center text-xl md:text-2xl font-bold text-white mb-2 ring-2 ring-offset-2 ring-offset-background transition-all ${isActive ? data.ringClass : "ring-transparent"}`}>
                              {anchor.charAt(0)}
                            </div>
                            <span className={`text-xs font-bold ${isActive ? data.textClass : "text-muted-foreground"}`}>{anchor}</span>
                            <span className="text-[9px] text-muted-foreground uppercase">{data.role}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className="text-xs text-red-400 font-semibold flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full bg-red-500 ${isPlaying ? "animate-pulse" : ""}`} />
                        {isPlaying ? "ON AIR" : "STANDBY"}
                      </div>
                    </div>
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="flex items-center justify-center gap-[2px] h-16 mb-4">
                    {waveform.map((v, i) => {
                      // DYNAMIC COLOR: Changes based on who is speaking
                    const speakerData = currentSpeaker ? (ANCHORS[currentSpeaker as AnchorName] || ANCHORS["Marcus"]) : null;

                    const colorClass = speakerData 
                      ? `from-${speakerData.color}-500 to-${speakerData.color}-300` 
                      : "from-zinc-700 to-zinc-500";      

                  return (
                        <motion.div
                          key={i}
                          className={`w-1.5 rounded-full bg-gradient-to-t ${colorClass}`}
                          animate={{ height: isPlaying && currentSpeaker ? `${v * 60 + 4}px` : "4px" }}
                          transition={{ duration: 0.15 }}
                        />
                      )
                    })}
                  </div>

                  {/* CC/Subtitle Display (Handles Playlists) */}
                  <AnimatePresence mode="wait">
                    {showCC && currentText && (
                      <motion.div
                        key={currentText}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10"
                      >
                        <p className="text-sm md:text-base text-white font-medium">
                          <span className="text-neon-cyan font-bold mr-2 uppercase tracking-wider">
                            {currentSpeakerType === 'caller' ? "CALLER" : currentSpeaker}: 
                          </span>
                          {currentText}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleListening}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider ${
                          isListening 
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-red-500/50' 
                            : 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-white hover:opacity-90'
                        }`}
                      >
                        {isListening ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                            Disconnect Stream
                          </>
                        ) : (
                          <>
                            <Radio className="w-5 h-5" />
                            Listen Live
                          </>
                        )}
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl transition-colors ${isMuted ? "bg-red-500/20 text-red-400" : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-white/10"}`}>
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowCC(!showCC)} className={`p-2 rounded-lg transition-colors ${showCC ? "bg-neon-cyan/20 text-neon-cyan" : "hover:bg-white/10 text-muted-foreground hover:text-foreground"}`}>
                        <Subtitles className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Broadcast Log */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-card/50 border border-border/30 p-4 max-h-80 overflow-y-auto">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" /> Broadcast Log
                </h3>
                <div className="space-y-3">
                  {broadcastHistory.map((log, i) => (
                    <div key={i} className="flex gap-3 px-2 opacity-70">
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0 pt-1">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground/80">{log.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 📞 Call-In Queue (WORKING VERSION) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-card/50 border border-border/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Active Callers
                  </h3>
                  {!showRecorder && (
                    <button 
                      onClick={() => setShowRecorder(true)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-magenta to-neon-cyan text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-neon-cyan/20"
                    >
                      Join Radio Queue for $0.99
                    </button>
                  )}
                </div>

                {/* Studio Recording UI */}
                <AnimatePresence>
                  {showRecorder && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 overflow-hidden">
                      <div className="bg-background/40 p-4 rounded-xl border border-neon-cyan/20">
                          <input 
                            type="text" 
                            placeholder="Topic (e.g. Glass Planet is cool!)" 
                            className="w-full bg-black/40 border border-border/30 rounded-lg px-3 py-2 text-sm mb-3"
                            value={callTopic}
                            onChange={e => setCallTopic(e.target.value)}
                          />
                          <VoiceRecorder onSend={handleVoiceUpload} isUploading={isUploadingCall} />
                          <button onClick={() => setShowRecorder(false)} className="w-full text-[10px] text-muted-foreground mt-2 uppercase">Cancel</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {callerQueue?.map((caller) => (
                    <div key={caller.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${caller.status === 'live' ? "bg-green-500/10 border border-green-500/30" : "bg-card/30 border border-border/20"}`}>
                      <span className="text-lg">🌍</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{caller.user?.name || "Listener"}</span>
                          {caller.status === 'live' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold uppercase animate-pulse">On the line</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">Topic: <span className="text-foreground/80">{caller.topic}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Chat (REAL TRPC VERSION) */}
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-card/50 border border-border/30 flex flex-col h-[600px]">
                <div className="p-4 border-b border-border/30">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-neon-cyan" /> Live Chat
                    <span className="ml-auto text-xs text-muted-foreground font-mono">
                      <Users className="w-3 h-3 inline mr-1" />47,832
                    </span>
                  </h3>
                </div>
                
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={chatContainerRef}>
                  {!chatData || chatData.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center italic mt-10">No messages yet. Be the first to say hi!</p>
                  ) : (
                    chatData.map(msg => (
                      <div key={msg.id} className="text-sm">
                        <span className="font-semibold text-neon-cyan">{msg.user?.name || "Anonymous"}</span>
                        <span className="text-muted-foreground mx-1">·</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <p className="text-foreground/90">{msg.message}</p>
                      </div>
                    ))
                  )}
                  {/* Invisible div to anchor our auto-scroll */}
                  {/* <div ref={chatEndRef} /> */}
                </div>
                
                {/* Chat Input Area */}
                <div className="p-3 border-t border-border/30">
                  {isAuthenticated ? (
                    // 👈 Wrapped in a form so "Enter" works natively everywhere!
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault(); // Prevents page reload
                        handleSendChat();
                      }} 
                      className="flex gap-2"
                    >
                      <input 
                        type="text" 
                        value={chatMessage} 
                        onChange={e => setChatMessage(e.target.value)} 
                        disabled={sendMessageMutation.isPending}
                        placeholder={sendMessageMutation.isPending ? "Sending..." : "Say something..."} 
                        className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border/30 text-sm focus:outline-none focus:border-neon-cyan/50 disabled:opacity-50" 
                      />
                      <button 
                        type="submit" // 👈 Changed to type="submit"
                        disabled={sendMessageMutation.isPending || !chatMessage.trim()}
                        className="p-2 rounded-lg bg-gradient-to-r from-neon-magenta to-neon-cyan text-white hover:opacity-90 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-400">Premium Feature</p>
                  <p className="text-xs text-muted-foreground">Subscribe to Premium ($4/mo) to access past broadcasts, rewind live shows, and record broadcasts.</p>
                </div>
                <button className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:opacity-90">
                  Upgrade
                </button>
              </motion.div>
            )}
            
            {MOCK_PAST_BROADCASTS.map((broadcast, i) => (
              <motion.div key={broadcast.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handlePastBroadcast(broadcast.id)} className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${broadcast.status === "expired" ? "bg-card/20 border-border/20 opacity-50" : isPremium ? "bg-card/50 border-border/30 hover:border-neon-cyan/40" : "bg-card/30 border-border/20"}`}>
                <div className="p-3 rounded-xl bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20">
                  {broadcast.status === "expired" ? <Clock className="w-6 h-6 text-muted-foreground" /> : isPremium ? <Play className="w-6 h-6 text-neon-cyan" /> : <Lock className="w-6 h-6 text-amber-400" />}
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
              <p className="text-sm text-muted-foreground mb-4">Each country has its own AI broadcasters speaking the local language. 50 call-in slots per country room.</p>
              
              <div className="mb-6">
                <h3 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Global Room</h3>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setActiveTab("live")} className="p-4 rounded-xl border cursor-pointer transition-all bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 border-neon-cyan/40 shadow-lg shadow-neon-cyan/10 hover:shadow-neon-cyan/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-8 h-8 text-neon-cyan" />
                    <div>
                      <h3 className="font-bold">Global Room — The Morning Cast</h3>
                      <p className="text-xs text-muted-foreground">English • UTC/GMT • 100 call-in slots/day</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />47,832</span>
                    <span className="text-red-400 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE</span>
                  </div>
                </motion.div>
              </div>

              <h3 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">Active Country Rooms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {COUNTRY_BROADCASTERS.map((cb, i) => (
                  <motion.div key={cb.countryCode} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedCountryRoom(cb)} className="p-4 rounded-xl border cursor-pointer transition-all bg-card/50 border-border/30 hover:border-neon-cyan/30 hover:shadow-lg hover:shadow-neon-cyan/5">
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
                      <span className="text-xs text-muted-foreground">{cb.broadcasterMale.name.split(" ")[0]} & {cb.broadcasterFemale.name.split(" ")[0]}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <CountryVoteSection />
          </div>
        )}

        {/* ═══════════════ SELECTED COUNTRY ROOM DETAIL ═══════════════ */}
        {activeTab === "rooms" && selectedCountryRoom && (
          <div className="space-y-6">
            <button onClick={() => setSelectedCountryRoom(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Country Rooms
            </button>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-2xl bg-gradient-to-r from-neon-magenta/10 via-card/50 to-neon-cyan/10 border border-border/30 p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{selectedCountryRoom.flag}</span>
                  <div>
                    <h2 className="text-2xl font-display font-bold">{selectedCountryRoom.countryName} Room</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedCountryRoom.primaryLanguage} • {selectedCountryRoom.timezone} (UTC{selectedCountryRoom.utcOffset >= 0 ? "+" : ""}{selectedCountryRoom.utcOffset}) • {selectedCountryRoom.maxDailyCallIns} slots
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-card/50 border border-border/30 p-6 mb-6">
                <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2"><Radio className="w-5 h-5 text-neon-magenta" /> Demo Broadcast</h3>
                <CountryRoomDemo broadcaster={selectedCountryRoom} />
              </div>
            </motion.div>
          </div>
        )}

        {/* Premium Gate Modal */}
        <AnimatePresence>
          {showPremiumGate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPremiumGate(false)}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-card border border-border/50 p-6 shadow-2xl">
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t("broadcast.premiumGate.title") || "Unlock Premium"}</h2>
                  <p className="text-muted-foreground mb-6">{t("broadcast.premiumGate.description") || "Upgrade to Premium to unlock full broadcast features."}</p>
                  <ul className="text-left space-y-2 mb-6">
                    {[
                      t("broadcast.features.rewind") || "Rewind live shows", 
                      t("broadcast.features.record") || "Record broadcasts", 
                      t("broadcast.features.archive") || "Access full archive", 
                      t("broadcast.features.adFree") || "Ad-free experience", 
                      t("broadcast.features.priority") || "Priority call-in queue"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg hover:opacity-90 transition-opacity">
                    {t("broadcast.premiumGate.subscribe") || "Subscribe Now"}
                  </button>
                  <button onClick={() => setShowPremiumGate(false)} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
                    {t("broadcast.premiumGate.later") || "Maybe later"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
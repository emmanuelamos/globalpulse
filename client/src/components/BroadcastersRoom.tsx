/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Broadcasters Room — Dual AI anchors (Marcus + Victoria) with real audio,
 * waveform visualizer, call-in demo, country rooms
 */
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Radio, Phone, Mic, Globe, Volume2, VolumeX, Users, Play, Pause, SkipForward } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BROADCAST_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/ZssTRmQxKAJEj5VSkQfJny/sandbox/ONZFVijnF85DwNUEwqPtFq-img-2_1770540971000_na1fn_YnJvYWRjYXN0ZXJzLXJvb20.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWnNzVFJtUXhLQUpFajVWU2tRZkpueS9zYW5kYm94L09OWkZWaWpuRjg1RHdOVUV3cVB0RnEtaW1nLTJfMTc3MDU0MDk3MTAwMF9uYTFmbl9Zbkp2WVdSallYTjBaWEp6TFhKdmIyMC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=mponbAwi4r~ruB8hI23dxs5W9YSrqIGT-0hxQ9802XM4zbMTw-JfRL2h4e8c1s8prvu~b12fdaKnji1h1MNJM7oYURiOExft9wfmoGCm7WrECb9a5Ytbz2Lovoeny1oCUVcz-jKPHajVTwiZSJ83gRQZcS1KTSnbFQcEWdhAViDuUlkjrzViLVIdPY6-HZstrMPybAXpXVwhg4dRCh8UoeTSD2vUJq0WamB0XaM48flZwIWjvwnH25WLvKEE4F0M99kIEOn2acsDh6y4~THwyy~oWFgQQJYUwGR3Z7VuS0H9mQC5kBa7zqtiIqBR~dy~wk19bBZrRifjiB-fzoS2Fg__";

const ANCHORS = [
  {
    name: "Marcus",
    accent: "American",
    avatar: "M",
    color: "from-neon-cyan to-blue-500",
    textColor: "text-neon-cyan",
    audioUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/rXIRuHSzDTRmzHlE.wav",
    transcript: `"Good morning, world. You're tuned into GlobalPulse, and I'm your host, Marcus. Tokyo holds the number one spot for safest city on the planet — for the twelfth week straight. At this point, Japan should just trademark the word 'safe.' Meanwhile, Brazil is climbing the crime charts again. Somebody tell São Paulo to take a deep breath..."`,
  },
  {
    name: "Victoria",
    accent: "British",
    avatar: "V",
    color: "from-neon-magenta to-pink-500",
    textColor: "text-neon-magenta",
    audioUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/HGfYWouMtnnnpozx.wav",
    transcript: `"Brilliant stuff, Marcus. Bollywood's biggest power couple has officially split, and the internet is absolutely losing it. Meanwhile, Taylor Swift just announced a surprise world tour extension — because apparently one hundred and fifty shows wasn't quite enough. On the gossip front — a Hollywood A-lister was spotted at a secret meeting in Dubai..."`,
  },
];

const COUNTRY_ROOMS = [
  { country: "Global", flag: "🌍", language: "English", listeners: "12.4K", status: "live" },
  { country: "India", flag: "🇮🇳", language: "Hindi", listeners: "8.7K", status: "live" },
  { country: "Canada", flag: "🇨🇦", language: "English/French", listeners: "5.2K", status: "live" },
  { country: "Nigeria", flag: "🇳🇬", language: "English/Pidgin", listeners: "4.8K", status: "live" },
  { country: "UK", flag: "🇬🇧", language: "English", listeners: "3.9K", status: "live" },
  { country: "Brazil", flag: "🇧🇷", language: "Portuguese", listeners: "3.1K", status: "scheduled" },
  { country: "Japan", flag: "🇯🇵", language: "Japanese", listeners: "2.8K", status: "scheduled" },
  { country: "Mexico", flag: "🇲🇽", language: "Spanish", listeners: "2.4K", status: "scheduled" },
];

function AudioPlayer() {
  const [activeAnchor, setActiveAnchor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barsRef = useRef<number[]>(Array.from({ length: 48 }, () => Math.random()));

  const anchor = ANCHORS[activeAnchor];

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(anchor.audioUrl);
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
        }
      });
      audioRef.current.addEventListener("ended", () => {
        setPlaying(false);
        setProgress(0);
      });
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing, anchor.audioUrl]);

  const switchAnchor = useCallback((idx: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
    setProgress(0);
    setActiveAnchor(idx);
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
    setMuted(!muted);
  }, [muted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 border border-neon-cyan/20">
      {/* Now playing header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/30">
          <span className="live-dot w-2 h-2 rounded-full bg-neon-red inline-block" />
          <span className="text-neon-red font-display text-xs font-bold">LIVE NOW</span>
        </div>
        <span className="text-sm text-foreground font-display font-bold">Morning Buzz — Global Edition</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" /> 12,431 listening
        </span>
      </div>

      {/* Anchor selector */}
      <div className="flex gap-3 mb-5">
        {ANCHORS.map((a, idx) => (
          <button
            key={a.name}
            onClick={() => switchAnchor(idx)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all flex-1 ${
              activeAnchor === idx
                ? `border-current/30 bg-current/5 ${a.textColor}`
                : "border-transparent bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-white font-display font-bold text-sm shrink-0`}>
              {a.avatar}
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-sm block">{a.name}</span>
              <span className="text-[10px] text-muted-foreground">{a.accent} Accent</span>
            </div>
            {activeAnchor === idx && (
              <span className="ml-auto live-dot w-2 h-2 rounded-full bg-neon-green inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* Waveform + controls */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
            playing
              ? "bg-neon-cyan/20 border-2 border-neon-cyan/60 hover:bg-neon-cyan/30"
              : "bg-gradient-to-br from-neon-cyan to-neon-magenta hover:shadow-[0_0_20px_oklch(0.85_0.18_195/0.4)]"
          }`}
        >
          {playing ? (
            <Pause className="w-5 h-5 text-neon-cyan" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
        <div className="flex items-end gap-[2px] h-12 flex-1">
          {barsRef.current.map((h, i) => {
            const filled = (i / barsRef.current.length) * 100 < progress;
            return (
              <motion.div
                key={i}
                className={`flex-1 rounded-full ${filled ? "bg-gradient-to-t from-neon-cyan to-neon-magenta" : "bg-muted/40"}`}
                animate={playing ? {
                  height: [`${20 + h * 30}%`, `${40 + Math.random() * 60}%`, `${20 + h * 30}%`],
                } : { height: `${20 + h * 40}%` }}
                transition={playing ? {
                  duration: 0.4 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.015,
                } : { duration: 0.3 }}
              />
            );
          })}
        </div>
        <button onClick={toggleMute} className="p-2 text-muted-foreground hover:text-neon-cyan transition-colors shrink-0">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 rounded-full bg-muted/30 mb-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Transcript preview */}
      <div className="p-4 rounded-xl bg-secondary/60 border border-neon-cyan/10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${anchor.color} flex items-center justify-center text-white text-[10px] font-bold`}>
            {anchor.avatar}
          </div>
          <span className={`text-xs font-display font-bold ${anchor.textColor}`}>{anchor.name}</span>
          <span className="text-[10px] text-muted-foreground">— {anchor.accent}</span>
        </div>
        <p className="text-sm text-foreground/80 italic leading-relaxed">
          {anchor.transcript}
        </p>
        <span className="text-[10px] text-neon-cyan font-mono mt-2 block">AI ANCHOR — PULSE FM GLOBAL</span>
      </div>

      {/* Show schedule */}
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="text-xs font-display text-muted-foreground">Upcoming:</span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan">10:00 — Crime Roundup</span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-magenta/10 text-neon-magenta">12:00 — Gossip Hour</span>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-amber/10 text-neon-amber">15:00 — Weather Wars</span>
      </div>
    </div>
  );
}

function CallInQueue() {
  const { t } = useLanguage();
  const [queuePos, setQueuePos] = useState(7);
  useEffect(() => {
    const timer = setInterval(() => {
      setQueuePos((p) => (p <= 1 ? 12 : p - 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card rounded-xl p-5 border border-neon-magenta/20">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-4 h-4 text-neon-magenta" />
        <span className="font-display font-bold text-sm text-neon-magenta">{t("broadcast.callIn")}</span>
        <span className="ml-auto text-xs font-mono text-muted-foreground">{queuePos} in line</span>
      </div>
      <div className="space-y-2 mb-4">
        {["Sarah from Toronto", "Raj from Mumbai", "Ade from Lagos"].map((caller, i) => (
          <div key={caller} className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-neon-green live-dot" : "bg-muted-foreground/30"}`} />
            <span className={i === 0 ? "text-neon-green font-bold" : "text-muted-foreground"}>{caller}</span>
            {i === 0 && <span className="ml-auto text-neon-green text-[10px] font-mono">ON AIR</span>}
          </div>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-neon-magenta to-neon-amber text-white font-display font-bold text-sm hover:shadow-[0_0_20px_oklch(0.7_0.25_350/0.4)] transition-all">
        <Mic className="w-4 h-4 inline mr-2" />
        {t("broadcast.callInPrice")}
      </button>
      <p className="text-[10px] text-muted-foreground text-center mt-2">{t("broadcast.callInDesc")}</p>
    </div>
  );
}

export default function BroadcastersRoom() {
  const { t } = useLanguage();
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={BROADCAST_IMG} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-neon-magenta font-display text-sm font-bold tracking-widest uppercase mb-3 block">
            {t("broadcast.label")}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
            {t("broadcast.title1")}{" "}
            <span className="text-neon-amber text-glow-amber">{t("broadcast.title2")}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            {t("broadcast.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main broadcast player */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <AudioPlayer />
          </motion.div>

          {/* Call-in queue + Country rooms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <CallInQueue />

            {/* Country rooms */}
            <div className="mt-6 glass-card rounded-xl p-5 border border-neon-cyan/10">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-neon-cyan" />
                <span className="font-display font-bold text-sm">{t("broadcast.countryRooms")}</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {COUNTRY_ROOMS.map((room) => (
                  <button
                    key={room.country}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neon-cyan/5 transition-colors text-left"
                  >
                    <span className="text-xl">{room.flag}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-display font-bold block">{room.country}</span>
                      <span className="text-[10px] text-muted-foreground">{room.language}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-neon-cyan block">{room.listeners}</span>
                      {room.status === "live" ? (
                        <span className="text-[10px] text-neon-red font-bold flex items-center gap-1">
                          <span className="live-dot w-1.5 h-1.5 rounded-full bg-neon-red inline-block" />
                          LIVE
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Soon</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

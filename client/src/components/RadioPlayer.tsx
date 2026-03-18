import { useEffect, useRef, useState } from "react";

interface Track {
  type: "ai" | "caller";
  url: string;
  text: string;
}

export default function RadioPlayer({ playlistJson }: { playlistJson: string }) {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Parse the playlist when it changes from the DB
  useEffect(() => {
    try {
      const parsed = JSON.parse(playlistJson);
      if (Array.isArray(parsed)) {
        setPlaylist(parsed);
        setCurrentIndex(0); // Reset to start of new segment
      }
    } catch (e) {
      // Fallback for old single-string URLs
      setPlaylist([{ type: "ai", url: playlistJson, text: "" }]);
    }
  }, [playlistJson]);

  // 2. Preload the NEXT track whenever the index changes
  useEffect(() => {
    if (playlist[currentIndex + 1]) {
      nextAudioRef.current = new Audio(playlist[currentIndex + 1].url);
      nextAudioRef.current.preload = "auto";
      nextAudioRef.current.load();
    }
  }, [currentIndex, playlist]);

  const handleEnded = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-xl border border-white/5">
      <audio
        ref={audioRef}
        src={playlist[currentIndex]?.url}
        autoPlay
        onEnded={handleEnded}
        controls
        className="w-full h-8 opacity-50 hover:opacity-100 transition-opacity"
      />
      
      {/* Visual Subtitles/Transcript */}
      <div className="mt-2">
        <span className="text-[10px] uppercase font-bold text-neon-cyan tracking-widest">
          {playlist[currentIndex]?.type === "ai" ? "LIVE ON AIR" : "CALLER ID: ACTIVE"}
        </span>
        <p className="text-sm text-gray-300 italic leading-tight">
          "{playlist[currentIndex]?.text}"
        </p>
      </div>
    </div>
  );
}
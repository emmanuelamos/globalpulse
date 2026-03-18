import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Trash2, Send, Play, Pause, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => Promise<void>;
  isUploading?: boolean;
}

export default function VoiceRecorder({ onSend, isUploading = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks to turn off the microphone light
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start Timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record a message.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const handleSend = async () => {
    if (!audioBlob) return;
    await onSend(audioBlob);
    discardRecording(); // Reset after successful send
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Format time (e.g., 01:05)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 rounded-xl bg-card/50 border border-border/30 max-w-sm w-full">
      {/* Hidden Audio Element for Playback */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)} 
          className="hidden" 
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Record / Stop Button */}
          {!audioUrl ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse" 
                  : "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
              }`}
            >
              {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
            </button>
          ) : (
            /* Play / Pause Preview Button */
            <button
              onClick={togglePlayback}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-magenta/20 text-neon-magenta hover:bg-neon-magenta/30 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
          )}

          {/* Status Text & Timer */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground/90">
              {isRecording ? "Recording..." : audioUrl ? "Review Message" : "Tap to speak"}
            </span>
            <span className={`text-xs font-mono ${isRecording ? "text-red-400" : "text-muted-foreground"}`}>
              {formatTime(recordingTime)} {isRecording && "• Live"}
            </span>
          </div>
        </div>

        {/* Actions (Discard & Send) */}
        <AnimatePresence>
          {audioUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <button 
                onClick={discardRecording}
                disabled={isUploading}
                className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <button 
                onClick={handleSend}
                disabled={isUploading}
                className="p-2.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta text-white hover:opacity-90 transition-all shadow-lg shadow-neon-cyan/20 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
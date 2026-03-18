import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Phone, Mic } from "lucide-react";
import { motion } from "framer-motion";
import VoiceRecorder from "./VoiceRecorder"; // Make sure to import it!

export default function CallInQueue() {
  const [showRecorder, setShowRecorder] = useState(false);
  
  // Fetch real queue data
  const { data: queueData, isLoading } = trpc.callIns.queue.useQuery(
    { room: "global" },
    { refetchInterval: 5000 } // Keep the queue feeling live
  );

  // Here is where the magic Next.js API route will happen
  const handleUploadAudio = async (audioBlob: Blob) => {
    // 1. You will post this Blob to your standard Next.js API Route
    // 2. The API Route uploads to Cloudflare R2 and calls OpenAI Whisper
    // 3. The API route calls the trpc join mutation (or you do it here with the results)
    console.log("Audio ready to upload to Cloudflare R2:", audioBlob);
    
    // Fake success for now to close the recorder
    setTimeout(() => setShowRecorder(false), 1000); 
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-card/50 border border-border/30 p-4">
      
      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Phone className="w-4 h-4" /> Active Callers
        </h3>
        
        {!showRecorder && (
          <button 
            onClick={() => setShowRecorder(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-magenta to-neon-cyan text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-lg shadow-neon-cyan/20"
          >
            <Mic className="w-3 h-3" /> Join Radio Queue — $0.99
          </button>
        )}
      </div>

      {/* Voice Recorder Dropdown */}
      {showRecorder && (
        <div className="mb-4 p-3 rounded-xl bg-background/50 border border-border/30">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-semibold text-neon-cyan">Record your hot take</span>
             <button onClick={() => setShowRecorder(false)} className="text-xs text-muted-foreground hover:text-white">Cancel</button>
           </div>
           {/* Topic input would go here before recording! */}
           <input type="text" placeholder="What's your topic?" className="w-full mb-3 px-3 py-1.5 text-sm bg-card border border-border/30 rounded-md focus:border-neon-cyan outline-none" />
           <VoiceRecorder onSend={handleUploadAudio} />
        </div>
      )}

      {/* Real Queue List */}
      <div className="space-y-2">
        {isLoading ? (
          <p className="text-xs text-muted-foreground text-center py-4">Loading queue...</p>
        ) : !queueData || queueData.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">Queue is empty. Be the first caller!</p>
        ) : (
          queueData.map((caller, i) => (
            <div key={caller.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${caller.status === "live" ? "bg-green-500/10 border border-green-500/30" : "bg-card/30 border border-border/20"}`}>
              <span className="text-lg">{caller.country || "🌍"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{caller.user?.name || "Anonymous"}</span>
                  {caller.status === "live" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold uppercase animate-pulse">
                      On the line
                    </span>
                  )}
                  {caller.status === "queued" && i === 0 && (
                     <span className="text-[10px] text-muted-foreground font-mono">Up next</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Topic: <span className="text-foreground/80">{caller.topic || "General Discussion"}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
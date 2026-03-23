import { eq, desc, and } from "drizzle-orm";
import { getDb } from "../db";
import { broadcastState, stories, callIns } from "../../drizzle/schema";
import { generateSpeech } from "./elevenlabs"; 
import { generateAiscript, generateReactionAndNextBlock } from "./ScriptWriter";

const VOICES = {
  MARCUS: "onwK4e9ZLuTAKqWW03F9", 
  VICTORIA: "hpp4J3VqNfWAUOO0d1Us", 
  ELENA: "pFZP5JQG7iQjIQuC4Bku",   
  JAX: "pNInz6obpgDQGcFmaJgB",     
  RILEY: "iP95p4xoKVk53GoZ742B",   
};

// Add this helper at the top of your file
const getAudioUrl = async (text: string, voiceId: string, isCaller: boolean, callerUrl?: string) => {
  if (isCaller) return callerUrl;
  // Skip ElevenLabs and return a silent/placeholder file for the AI parts
  console.log(`[Bypass] Skipping ElevenLabs for: "${text.substring(0, 30)}..."`);
  return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 
};

// export async function playNextSegment(roomSlug: string = "global"): Promise<number> {
//   const db = await getDb();
//   if (!db) return 10000;

//   // 1. GET THE CALLER (The star of the show)
//   const nextCaller = await db
//     .select()
//     .from(callIns)
//     .where(and(eq(callIns.status, "queued")))
//     .limit(1)
//     .then(r => r[0]);

//   if (!nextCaller) {
//     console.log("🕵️ No callers in queue. Skipping broadcast loop to save resources.");
//     return 10000;
//   }

//   console.log(`🔥 [TEST MODE] Processing Caller ID: ${nextCaller.id}`);
//   const personaKey = "JAX"; 
//   const playlist = [];

//   try {
//     // 2. SEND TO OPENAI (generateReactionAndNextBlock)
//     // This tests if your ScriptWriter is successfully parsing the user's transcript
//     const reactionScript = await generateReactionAndNextBlock(
//       personaKey, 
//       nextCaller.transcript || "", 
//       { title: "Live Call-In Test", category: "trending" } as any, 
//       true
//     );

//     console.log(`🤖 [GPT Reaction]: "${reactionScript}"`);

//     // 3. ASSEMBLE PLAYLIST (Using dummy URLs for AI)
//     playlist.push({ 
//       type: 'ai', 
//       url: await getAudioUrl("Intro", "", false), 
//       text: "We have a caller on the line...", 
//       speaker: personaKey 
//     });

//     playlist.push({ 
//       type: 'caller', 
//       url: nextCaller.audioUrl, // This is your REAL R2 link
//       text: nextCaller.transcript, 
//       durationSec: nextCaller.durationSec || 15,
//       speaker: 'Guest' 
//     });

//     playlist.push({ 
//       type: 'ai', 
//       url: await getAudioUrl("Reaction", "", false), 
//       text: reactionScript, 
//       speaker: personaKey 
//     });

//     // 4. UPDATE STATE
//     await db.insert(broadcastState).values({
//       roomSlug,
//       isLive: true,
//       currentAudioUrl: JSON.stringify(playlist), 
//       currentSpeaker: personaKey,
//       currentText: `Reacting to: ${nextCaller.transcript}`,
//       startedAt: new Date(),
//     }).onDuplicateKeyUpdate({
//       set: { isLive: true, currentAudioUrl: JSON.stringify(playlist), startedAt: new Date() }
//     });

//     // Mark as live so we don't loop it
//     await db.update(callIns).set({ status: "live" }).where(eq(callIns.id, nextCaller.id));

//     console.log(`✅ [TEST SUCCESS] Caller ${nextCaller.id} processed and sent to frontend.`);
//     return 30000; // Wait 30s before looking for the next call

//   } catch (err: any) {
//     console.error("🚨 [Bypass Loop Error]:", err.message);
//     return 10000;
//   }
// }

export async function playNextSegment(roomSlug: string = "global"): Promise<number> {
  const db = await getDb();
  if (!db) return 10000;

  // 1. SELECT CONTENT: Check for callers first, then stories
  const nextCaller = await db
    .select()
    .from(callIns)
    .where(and(eq(callIns.status, "queued"), eq(callIns.room, roomSlug)))
    .limit(1)
    .then(r => r[0]);

  const topStories = await db
    .select()
    .from(stories)
    .orderBy(desc(stories.heatScore))
    .limit(15);

  if (!nextCaller && topStories.length === 0) {
    console.warn("⏳ [Broadcast] No content available. Sleeping...");
    return 20000;
  }

  // 2. CHOOSE TOPIC & PERSONA
  const topStory = topStories[Math.floor(Math.random() * topStories.length)] || { title: "Global Pulse Updates", category: "trending" };
  
  let personaKey: keyof typeof VOICES = "MARCUS";
  if (nextCaller) {
    personaKey = "JAX"; // Jax handles all callers
  } else {
    if (["crime", "weather", "most_extreme"].includes(topStory.category || "")) personaKey = "ELENA";
    else if (["entertainment", "celebrity", "hottest_gossip"].includes(topStory.category || "")) personaKey = "RILEY";
    else if (["funny", "most_memes"].includes(topStory.category || "")) personaKey = "JAX";
  }

  const voiceId = VOICES[personaKey];
  const playlist = [];

  try {
    if (nextCaller) {
      // --- CALLER FLOW ---
      console.log(`🎙️ [Broadcast] Persona: ${personaKey} | Taking Caller: ${nextCaller.id}`);
      
      const introText = `Hold the phones, we've got a live one. You're on Global Pulse, what's on your mind?`;
      const introVoice = await generateSpeech(introText, voiceId);
      playlist.push({ type: 'ai', url: introVoice.url, text: introText, speaker: personaKey });

      // The raw caller audio from your R2 bucket
      playlist.push({ 
        type: 'caller', 
        url: nextCaller.audioUrl, 
        text: nextCaller.transcript, 
        durationSec: nextCaller.durationSec || 12,
        speaker: 'Guest' 
      });

      const reactionScript = await generateReactionAndNextBlock(personaKey, nextCaller.transcript || "", topStory, true);
      const reactionVoice = await generateSpeech(reactionScript, voiceId);
      playlist.push({ type: 'ai', url: reactionVoice.url, text: reactionScript, speaker: personaKey });

      // Mark as live so it doesn't replay
      await db.update(callIns).set({ status: "live" }).where(eq(callIns.id, nextCaller.id));
    } else {
      // --- NEWS STORY FLOW ---
      console.log(`🎙️ [Broadcast] Persona: ${personaKey} | Story: ${topStory.title}`);
      
      const openingScript = await generateAiscript(topStory, personaKey); 
      const openingVoice = await generateSpeech(openingScript, voiceId);
      playlist.push({ type: 'ai', url: openingVoice.url, text: openingScript, speaker: personaKey });

      const closingScript = await generateReactionAndNextBlock(personaKey, "", topStory, true);
      const closingVoice = await generateSpeech(closingScript, voiceId);
      playlist.push({ type: 'ai', url: closingVoice.url, text: closingScript, speaker: personaKey });
    }

    // 3. UPDATE GLOBAL BROADCAST STATE
    await db.insert(broadcastState)
      .values({
        roomSlug,
        isLive: true,
        currentAudioUrl: JSON.stringify(playlist), 
        currentSpeaker: personaKey,
        currentText: playlist[0]?.text || "",
        startedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          isLive: true,
          currentAudioUrl: JSON.stringify(playlist),
          currentSpeaker: personaKey,
          currentText: playlist[0]?.text || "",
          startedAt: new Date(),
        }
      });

    const totalDuration = calculateTotalDuration(playlist);
    console.log(`✅ [Broadcast] Segment Ready. Duration: ${Math.round(totalDuration/1000)}s`);
    
    // 4. CLEANUP CALLER (Optional: auto-complete after they air)
    if (nextCaller) {
      setTimeout(async () => {
        const dbCleanup = await getDb();
        // Check if dbCleanup exists before using it
        if (dbCleanup) {
          await dbCleanup.update(callIns)
            .set({ status: "completed" })
            .where(eq(callIns.id, nextCaller.id));
          console.log(`🧹 [Cleanup] Caller ${nextCaller.id} archived.`);
        } else {
          console.error("🚨 [Cleanup Error] Could not connect to DB for archiving.");
        }
      }, totalDuration);
    }

    return totalDuration;

  } catch (err: any) {
    console.error("🚨 [Broadcast Loop Error]:", err.message);
    return 15000; // Wait 15s on error before retry
  }
}

export async function startBroadcastDaemon() {
  console.log("🔥 [Broadcast Engine] Daemon started.");
  while (true) {
    try {
      const waitTimeMs = await playNextSegment("global");
      await new Promise(resolve => setTimeout(resolve, waitTimeMs));
    } catch (error) {
      console.error("🚨 [Daemon] Crash recovery initiated...");
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

function calculateTotalDuration(playlist: any[]): number {
  let totalMs = 0;
  for (const item of playlist) {
    if (item.type === 'ai') {
      const wordCount = (item.text || "").split(/\s+/).length;
      totalMs += (wordCount / 2.3) * 1000 + 2000;
    } else {
      totalMs += (item.durationSec || 10) * 1000;
    }
  }
  return totalMs + 3000;
}
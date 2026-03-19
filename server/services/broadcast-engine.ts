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

export async function playNextSegment(roomSlug: string = "global"): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.error("❌ [BROADCAST] Database connection missing.");
    return 10000;
  }

  const topStories = await db
    .select()
    .from(stories)
    .orderBy(desc(stories.heatScore))
    .limit(20);

  console.log(`🔎 [Broadcast] Found ${topStories.length} stories in DB.`);

  if (topStories.length === 0) {
    console.warn("⏳ [Broadcast] DB is empty. Waiting for Sync Service...");
    return 20000; 
  }

  const topStory = topStories[Math.floor(Math.random() * topStories.length)];
  let personaKey: "MARCUS" | "ELENA" | "JAX" | "RILEY" = "MARCUS";
  let voiceId = VOICES.MARCUS;

  if (["crime", "weather"].includes(topStory.category || "")) {
    personaKey = "ELENA"; voiceId = VOICES.ELENA;
  } else if (["funny", "trending"].includes(topStory.category || "")) {
    personaKey = "JAX"; voiceId = VOICES.JAX;
  } else if (["entertainment", "celebrity"].includes(topStory.category || "")) {
    personaKey = "RILEY"; voiceId = VOICES.RILEY;
  }

  console.log(`🎙️ [Broadcast] Persona: ${personaKey} | Story: ${topStory.title}`);

  try {
    const playlist = [];
    
    const openingScript = await generateAiscript(topStory, personaKey); 
    const openingVoice = await generateSpeech(openingScript, voiceId);
    playlist.push({ type: 'ai', url: openingVoice.url, text: openingScript, speaker: personaKey });

    const nextCaller = await db
      .select()
      .from(callIns)
      .where(and(eq(callIns.status, "queued"), eq(callIns.room, roomSlug)))
      .limit(1)
      .then(r => r[0]);

    if (nextCaller) {
      console.log(`📞 [Broadcast] Taking caller: ${nextCaller.id}`);
      const introText = `Let's go to the phones. You're live on Global Pulse!`;
      const introVoice = await generateSpeech(introText, voiceId);
      playlist.push({ type: 'ai', url: introVoice.url, text: introText, speaker: personaKey });
      
      playlist.push({ 
        type: 'caller', 
        url: nextCaller.audioUrl, 
        text: nextCaller.transcript, 
        durationSec: nextCaller.durationSec,
        speaker: 'Guest' 
      });

      const reactionScript = await generateReactionAndNextBlock(personaKey, nextCaller.transcript || "", topStory, true);
      const reactionVoice = await generateSpeech(reactionScript, voiceId);
      playlist.push({ type: 'ai', url: reactionVoice.url, text: reactionScript, speaker: personaKey });

      await db.update(callIns).set({ status: "live" }).where(eq(callIns.id, nextCaller.id));
    } else {
      const closingScript = await generateReactionAndNextBlock(personaKey, "", topStory, true);
      const closingVoice = await generateSpeech(closingScript, voiceId);
      playlist.push({ type: 'ai', url: closingVoice.url, text: closingScript, speaker: personaKey });
    }

    // UPSERT LOGIC (Postgres Compatible)
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
    console.log(`✅ [Broadcast] Segment Ready. Length: ${Math.round(totalDuration/1000)}s`);
    return totalDuration;

  } catch (err: any) {
    console.error("🚨 [Broadcast Loop Error]:", err.message);
    return 15000;
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
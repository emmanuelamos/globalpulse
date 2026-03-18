import { eq, desc, sql, and } from "drizzle-orm";
import { getDb } from "../db";
import { broadcastState, stories, callIns } from "../../drizzle/schema";
import { generateSpeech } from "./elevenlabs"; 
import { generateAiscript, generateReactionAndNextBlock } from "./ScriptWriter";

const VOICES = {
  // Daniel is literally tagged as "Steady Broadcaster". Perfect for the lead anchor.
  MARCUS: "onwK4e9ZLuTAKqWW03F9", 

  // Bella is "Professional and Bright". Great for a co-anchor.
  VICTORIA: "hpp4J3VqNfWAUOO0d1Us", 

  // Lily is "Confident and Velvety". Good for a serious/weather reporter.
  ELENA: "pFZP5JQG7iQjIQuC4Bku",   

  // Adam is "Brash, openly confident, slightly aggressive". Perfect for Jax's rants!
  JAX: "pNInz6obpgDQGcFmaJgB",     

  // Chris is "Charming, casual, down-to-earth". Great for trending/entertainment tea.
  RILEY: "iP95p4xoKVk53GoZ742B",   
};

export async function playNextSegment(roomSlug: string = "global"): Promise<number> {
  const db = await getDb();
  if (!db) return 10000;

  // 1. Fetch hottest stories
  const topStories = await db
    .select()
    .from(stories)
    .orderBy(desc(stories.heatScore))
    .limit(10);

  if (!topStories.length) return 10000;
  const topStory = topStories[Math.floor(Math.random() * topStories.length)];

  // 2. Select Persona
  let personaKey: "MARCUS" | "ELENA" | "JAX" | "RILEY" = "MARCUS";
  let voiceId = VOICES.MARCUS;

  if (topStory.category === "crime" || topStory.category === "weather") {
    personaKey = "ELENA";
    voiceId = VOICES.ELENA;
  } else if (topStory.category === "funny" || topStory.category === "trending") {
    personaKey = "JAX";
    voiceId = VOICES.JAX;
  } else if (topStory.category === "entertainment" || topStory.category === "celebrity") {
    personaKey = "RILEY";
    voiceId = VOICES.RILEY;
  }

  console.log(`✍️ [Broadcast Engine] Asking OpenAI to write a script for ${personaKey}...`);

const playlist = [];
  
  // 1. GENERATE OPENING BLOCK
  const openingScript = await generateAiscript(topStory, personaKey); 
  const openingVoice = await generateSpeech(openingScript, voiceId);
  playlist.push({ type: 'ai', url: openingVoice.url, text: openingScript });

  // 2. THE PRODUCER CHECK: Should we take a caller now?
console.log(`🔎 [Producer] Checking for queued callers in room: ${roomSlug}...`);
  
  const nextCaller = await db
    .select()
    .from(callIns)
    .where(
      and(
        eq(callIns.status, "queued"),
        eq(callIns.room, roomSlug) // 👈 Ensure this matches your DB column "room"
      )
    )
    .limit(1)
    .then(r => r[0]);

  if (nextCaller) {
    console.log(`📞 [Producer] FOUND CALLER: ${nextCaller.id}. Transcript: ${nextCaller.transcript}`);
    
    // A. Intro the caller
    const introText = `We've got a listener on the line. Welcome to the show, you're on the air!`;
    const introVoice = await generateSpeech(introText, voiceId);
    playlist.push({ type: 'ai', url: introVoice.url, text: introText, speaker: personaKey });
    
    // B. Add Caller Audio
    playlist.push({ 
      type: 'caller', 
      url: nextCaller.audioUrl, 
      text: nextCaller.transcript, 
      durationSec: nextCaller.durationSec,
      speaker: 'Guest' // 👈 Add this for the frontend highlight
    });

    // C. Reaction
    const reactionScript = await generateReactionAndNextBlock(personaKey, nextCaller.transcript || "", topStory, true);
    const reactionVoice = await generateSpeech(reactionScript, voiceId);
    playlist.push({ type: 'ai', url: reactionVoice.url, text: reactionScript, speaker: personaKey });

    // ✅ Update status so they aren't picked up again
    await db.update(callIns).set({ status: "live" }).where(eq(callIns.id, nextCaller.id));
    console.log(`✅ [Producer] Caller ${nextCaller.id} set to LIVE.`);
} else {
    // Dynamic closing instead of the hardcoded "metal rain"
    console.log("🎙️ No caller found, generating solo closing...");
    const closingScript = await generateReactionAndNextBlock(
      personaKey, 
      "", // No caller transcript
      topStory, 
      true // Sign-off
    );
    const closingVoice = await generateSpeech(closingScript, voiceId);
    playlist.push({ type: 'ai', url: closingVoice.url, text: closingScript });
  }

console.log(`📡 [Broadcast Engine] Publishing playlist to DB for ${roomSlug}...`);
  
  await db.insert(broadcastState)
    .values({
      roomSlug: roomSlug,
      isLive: true,
      currentAudioUrl: JSON.stringify(playlist), 
      currentSpeaker: personaKey,
      currentText: playlist[0]?.text || "", // Store first block as preview text
      startedAt: new Date(),
    })
    .onDuplicateKeyUpdate({ // <--- Use this for MySQL instead of onConflict
      set: {
        isLive: true,
        currentAudioUrl: JSON.stringify(playlist),
        currentSpeaker: personaKey,
        currentText: playlist[0]?.text || "",
        startedAt: new Date(),
      },
    });

  const totalDuration = calculateTotalDuration(playlist);
  console.log(`✅ [Broadcast Engine] State updated. Duration: ${Math.round(totalDuration/1000)}s`);
  
  return totalDuration;
}

// 6. The Dynamic Scheduler (Runs continuously without clipping audio)
export async function startBroadcastDaemon() {
  console.log("🔥 [Broadcast Engine] Daemon started.");
  
  while (true) {
    try {
      // playNextSegment now returns exactly how long the audio track is
      const waitTimeMs = await playNextSegment("global");
      
      console.log(`⏱️ [Broadcast Engine] Waiting ${Math.round(waitTimeMs/1000)} seconds for track to finish...`);
      
      // Pause the loop while the audio plays for the listeners
      await new Promise(resolve => setTimeout(resolve, waitTimeMs));

    } catch (error) {
      console.error("🚨 [Broadcast Engine] Fatal error in loop:", error);
      // Wait 10 seconds before retrying so we don't spam the DB or API if something breaks
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

function calculateTotalDuration(playlist: any[]): number {
  let totalMs = 0;

  for (const item of playlist) {
    if (item.type === 'ai') {
      // Average speaking rate ~2.3 words per second + 1.5s buffer for breaths/natural pauses
      const wordCount = item.text.split(/\s+/).length;
      totalMs += (wordCount / 2.3) * 1000 + 1500;
    } else if (item.type === 'caller') {
      // Use the actual duration from the call-in if available, else default to 10s
      // (Note: You might want to pass durationSec into the playlist object earlier)
      totalMs += (item.durationSec || 10) * 1000;
    }
  }

  // Add a final 2-second "buffer" to the whole segment for safety
  return totalMs + 2000;
}
import { eq, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { broadcastState, stories } from "../../drizzle/schema";
import { generateSpeech } from "./elevenlabs"; 

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
  if (!db) return 10000; // Return a 10-second default wait on error

  console.log(`📻 [Broadcast Engine] Starting next segment for ${roomSlug}...`);

  // 1. Fetch a random story from the top 10 hottest stories to prevent repeating
  const topStories = await db
    .select()
    .from(stories)
    .orderBy(desc(stories.heatScore)) // FIXED: Get the hottest stories
    .limit(10);

  if (!topStories.length) return 10000;

  // Pick a random story from the top 10
  const topStory = topStories[Math.floor(Math.random() * topStories.length)];

  // 2. The Director: Route the story to the right AI Anchor
  let anchorName: "Marcus" | "Victoria" | "Elena" | "Jax" | "Riley" = "Marcus";
  let voiceId = VOICES.MARCUS;
  let script = "";

  if (topStory.category === "crime" || topStory.category === "weather") {
    anchorName = "Elena";
    voiceId = VOICES.ELENA;
    script = `Thanks Marcus. Dr. Elena Reyes here with the breakdown. Looking at the latest data for ${topStory.title}, we are seeing... ${topStory.summary}`;
  } else if (topStory.category === "funny" || topStory.category === "trending") {
    anchorName = "Jax";
    voiceId = VOICES.JAX;
    script = `Alright, Jax taking over. You have got to be kidding me. ${topStory.title}? Let me tell you why this is absolutely ridiculous... ${topStory.summary}`;
  } else if (topStory.category === "entertainment" || topStory.category === "celebrity") {
    anchorName = "Riley";
    voiceId = VOICES.RILEY;
    script = `Riley here! O M G, did you guys see this? ${topStory.title}. Here is the tea... ${topStory.summary}`;
  } else {
    anchorName = "Marcus";
    voiceId = VOICES.MARCUS;
    script = `Moving on to our next top story... ${topStory.title}. ${topStory.summary}`;
  }

 console.log(`🎙️ [Broadcast Engine] Handing off to ${anchorName}...`);

  // 3. Generate the Audio and pull out the 'url'
  const { url } = await generateSpeech(script, voiceId);

  console.log(`🎵 [Broadcast Engine] Track ready at: ${url}`);

  // 4. Update the Database! 
  await db
    .insert(broadcastState)
    .values({
      roomSlug,
      isLive: true,
      currentAudioUrl: url, // FIXED: Now passing the actual Cloudflare URL
      currentSpeaker: anchorName,
      currentText: script,
      startedAt: new Date(),
    })
    .onDuplicateKeyUpdate({ 
      set: {
        isLive: true,
        currentAudioUrl: url, // FIXED
        currentSpeaker: anchorName,
        currentText: script,
        startedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  console.log(`📡 [Broadcast Engine] Segment LIVE! Everyone is now listening to ${anchorName}.`);

  // 5. Calculate how long this audio takes so we know exactly when to start the next one
  // Average speaking rate is ~2.5 words per second. We add 2 seconds of "padding/breath" at the end.
  const wordCount = script.split(" ").length;
  const estimatedDurationMs = (wordCount / 2.5) * 1000 + 2000;

  return estimatedDurationMs;
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
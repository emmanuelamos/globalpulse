import 'dotenv/config';
import { generateAiscript } from "./server/services/ScriptWriter";

async function testDrivePersonas() {
  const mockStory = {
    title: "Scientists Discover 'Glass' Planet Where it Rains Shards of Metal",
    summary: "Astronomers have identified an exoplanet 63 light-years away where winds reach 5,000 mph, causing horizontal rain made of molten glass and cobalt.",
    aiSummary: "The extreme conditions make it one of the most hostile environments ever recorded, though its deep blue color looks deceptively like Earth from a distance."
  };

  const personas = ["MARCUS", "ELENA", "JAX", "RILEY"] as const;

  console.log("🧪 --- STARTING PERSONA TEST DRIVE --- 🧪\n");

  for (const p of personas) {
    console.log(`🎤 TESTING: ${p}...`);
    const script = await generateAiscript(mockStory, p);
    console.log(`[${p}]: "${script}"`);
    console.log("\n------------------------------------------\n");
  }
}

testDrivePersonas();
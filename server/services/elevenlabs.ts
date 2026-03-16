import axios from "axios";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// ─── CLOUDFLARE R2 SETUP ──────────────────────────────────────────────
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_URL!;

// ─── GENERATE & UPLOAD SPEECH ─────────────────────────────────────────
export async function generateSpeech(text: string, voiceId: string): Promise<{ url: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  // 1. Create a unique fingerprint so we don't pay for the same text twice
  const hash = crypto.createHash("md5").update(`${voiceId}-${text}`).digest("hex");
  const fileName = `broadcasts/${hash}.mp3`;
  const publicUrl = `${PUBLIC_BASE_URL}/${fileName}`;

  // 2. CHECK R2: Does this audio already exist?
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: fileName }));
    console.log(`[Audio] HIT 🎯: Found existing audio in R2 for ${fileName}`);
    return { url: publicUrl }; // TypeScript is happy now!
  } catch (err: any) {
    if (err.name !== "NotFound") console.warn("[Audio] R2 check failed:", err);
  }

  console.log(`[Audio] MISS ❌: Generating new track from ElevenLabs...`);

  // 3. Generate Audio via ElevenLabs
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        text: text,
        model_id: 'eleven_turbo_v2_5', 
        voice_settings: { stability: 0.4, similarity_boost: 0.8 },
      },
      responseType: 'arraybuffer', // Get raw binary data back
    });

    const audioBuffer = Buffer.from(response.data);

    // 4. Upload raw audio directly to Cloudflare R2
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: audioBuffer,
        ContentType: "audio/mpeg",
      })
    );

    console.log(`[Audio] SAVED ☁️: Uploaded to Cloudflare R2 -> ${fileName}`);
    
    // 5. Return the short, clean R2 URL!
    return { url: publicUrl }; 

  } catch (error: any) {
    if (error.response) {
       const decoder = new TextDecoder();
       const errorMsg = decoder.decode(error.response.data);
       console.error("ElevenLabs API Error:", errorMsg);
    } else {
       console.error("Connection Error:", error.message);
    }
    throw new Error("Speech generation failed.");
  }
}
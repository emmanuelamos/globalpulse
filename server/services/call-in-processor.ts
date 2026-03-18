import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import OpenAI from "openai";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const openai = new OpenAI();
const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_URL!;

export async function processUserVoice(
  audioBuffer: Buffer, 
  userId: number
): Promise<{ url: string; transcript: string }> {
  
  // 1. Unique name for the caller's clip
  const hash = crypto.createHash("md5").update(`${userId}-${Date.now()}`).digest("hex");
  const fileName = `calls/${hash}.webm`;
  const publicUrl = `${PUBLIC_BASE_URL}/${fileName}`;

  // 2. Upload to R2
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: audioBuffer,
    ContentType: "audio/webm",
  }));

  // 3. Transcribe with Whisper
  // Note: OpenAI's SDK needs a 'File' object or a readable stream with a name
  // To work with a Buffer in Node, we use 'toFile' helper
  const transcription = await openai.audio.transcriptions.create({
    file: await OpenAI.toFile(audioBuffer, "caller-audio.webm"),
    model: "whisper-1",
  });

  return {
    url: publicUrl,
    transcript: transcription.text
  };
}
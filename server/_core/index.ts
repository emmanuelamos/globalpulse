import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import multer from "multer";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import cron from "node-cron";
import { handleStripeWebhook } from "server/stripe/webhook";
import cors from "cors";
import { performGlobalSync } from "../services/sync-service";
import { startBroadcastDaemon } from "../services/broadcast-engine";
import { processUserVoice } from "../services/call-in-processor";
import { getDb } from "../db";
import { callIns } from "../../drizzle/schema";
import { Request, Response } from "express";

// 1. PRE-FLIGHT CHECK: Stop the server if critical keys are missing
function checkEnv() {
  const required = ["DATABASE_URL", "OPENAI_API_KEY", "ELEVENLABS_API_KEY", "SERP_API_KEY"];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ FATAL: Missing Environment Variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

async function startServer() {
  checkEnv();
  const app = express();
  
  // 1. ROBUST CORS (Keep the specific headers for tRPC)
  app.use(cors({
    origin: ['http://localhost:8080', 'https://globalpulse-lime.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'trpc-batch', 'x-trpc-source'],
  }));

  app.use(cookieParser());
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  const server = createServer(app);

  // 2. HEALTH CHECK
  app.get("/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // 3. CALL-IN UPLOAD ROUTE
  const upload = multer();
  app.post("/api/upload-call", upload.single("audio"), async (req: Request, res: Response) => {
    const traceId = Math.random().toString(36).substring(7); // Helps track this specific request in messy logs
    console.log(`\n📥 [Call-In] New Request Received (Trace: ${traceId})`);

    try {
      const { userId, topic } = req.body;
      const multerReq = req as Request & { file?: Express.Multer.File };
      const audioBuffer = multerReq.file?.buffer;

      // 1. Log the incoming metadata
      console.log(`   👤 User ID: ${userId}`);
      console.log(`   🏷️  Topic: ${topic || "General"}`);

      if (!audioBuffer) {
        console.error(`   ❌ [${traceId}] Error: No audio file found in request.`);
        return res.status(400).send("No audio provided");
      }

      console.log(`   📦 Audio Size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);

      // 2. Log the AI Voice Processing
      console.log(`   🤖 [${traceId}] Processing voice with OpenAI/R2...`);
      const { url, transcript } = await processUserVoice(audioBuffer, parseInt(userId));
      
      // This is the most important log: see if Whisper actually heard anything
      console.log(`   🎙️  Transcript: "${transcript || "[Empty Transcript]"}"`);
      console.log(`   ☁️  Cloud Storage URL: ${url}`);

      // 3. Log the DB Step
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      console.log(`   💾 [${traceId}] Inserting into 'callIns' table...`);
      const [result] = await db.insert(callIns).values({
        userId: parseInt(userId),
        topic: topic || "General",
        audioUrl: url,
        transcript: transcript,
        status: "pending_payment",
        durationSec: 10,
      });

      console.log(`   ✅ [${traceId}] Success! Call-in is now queued for broadcast.\n`);
      res.json({ success: true, callId: result.insertId, transcript });

    } catch (error: any) {
      console.error(`   💥 [${traceId}] CRITICAL ERROR:`, error.message);
      res.status(500).send("Server Error");
    }
  });

  app.get("/api/admin/force-sync", (req, res) => {
    // Simple check: you can add an API key here later
    console.log("🚀 Manual Sync Requested...");
    performGlobalSync(); 
    res.json({ message: "Sync started in background" });
  });
  // 4. tRPC & STATIC ASSETS
  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 8080;

  // 5. THE BOOT SEQUENCE
  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 SERVER LIVE ON PORT ${port}`);

    // Start Daemon immediately (Background)
    // This stays alive to talk about existing data in your DB
    startBroadcastDaemon().catch(err => console.error("📻 Daemon Error:", err));

    // REMOVED: The 60s initial sync. 
    // We don't want to risk a crash every time you redeploy.
    // console.log("ℹ️ Skipping initial sync to preserve resources. Using existing DB data.");

    // NEW CRON: Run once a day at 12:00 AM (Midnight)
    // cron.schedule('0 0 * * *', () => {
    //   console.log('⏰ Daily Global Sync Triggered at Midnight');
    //   performGlobalSync().catch(err => console.error("Daily Sync Error:", err));
    // });
  });
}

startServer().catch(console.error);
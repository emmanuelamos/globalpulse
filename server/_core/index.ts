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
  
  // 2. ROBUST CORS: Specifically allowing tRPC headers
  app.use(cors({
    origin: [
      'http://localhost:8080',
      'https://globalpulse-lime.vercel.app' 
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'trpc-batch', 'x-trpc-source'],
  }));

  app.use(cookieParser());
  const server = createServer(app);

  app.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      db: !!process.env.DATABASE_URL 
    });
  });

  // Webhook and Upload routes (keep as you had them)
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const { handleStripeWebhook } = await import("../stripe/webhook");
    return handleStripeWebhook(req, res);
  });

  const upload = multer();
app.post("/api/upload-call", upload.single("audio"), async (req: Request, res: Response) => {

  try {

    const { userId, topic } = req.body;
    // Explicitly cast req as any or use the Multer type if preferred
    const multerReq = req as Request & { file?: Express.Multer.File };
    const audioBuffer = multerReq.file?.buffer;

    if (!audioBuffer) {

    return res.status(400).send("No audio provided");

    }



    // 1. Process via our new service (Now imported)

    const { url, transcript } = await processUserVoice(audioBuffer, parseInt(userId));



    // 2. Save to DB (Now imported)

    const db = await getDb();

    if (!db) throw new Error("Database connection failed");



    await db.insert(callIns).values({

    userId: parseInt(userId),

    topic: topic || "General",

    audioUrl: url,

    transcript: transcript,

    status: "queued",

    durationSec: 10,

    });



    res.json({ success: true });

  } catch (error) {

  console.error("🚨 Call upload failed:", error);

  res.status(500).send("Server Error");

}

});

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  registerOAuthRoutes(app);

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 3. RAILWAY PORT LOGIC: Always prioritize process.env.PORT
  const port = Number(process.env.PORT) || 8080;

  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server ready on port ${port}`);
    
    // 4. DAEMON START
    console.log('📻 Starting Broadcast Daemon...');
    startBroadcastDaemon().catch(err => console.error("Daemon Error:", err));

    // 5. CRON-BASED SYNC: Avoids the 429 "Double Sync" on restart
    // Runs once every hour at minute 0
    cron.schedule('0 * * * *', () => {
      console.log('⏰ Hourly Sync Triggered');
      performGlobalSync().catch(console.error);
    });

    // Run initial sync only once, 30s after boot to allow stability
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => {
        console.log('🔄 Performing initial production sync...');
        performGlobalSync().catch(console.error);
      }, 30000);
    }
  });
}

startServer().catch(console.error);
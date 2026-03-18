import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import net from "net";
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

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  app.use(cookieParser());
  app.use(cors({
    // This must match your Vercel URL exactly
    origin: [
      'http://localhost:3000',           // Vite default
      'http://localhost:8080',           // Next.js default
      'https://globalpulse-lime.vercel.app' // Production
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'trpc-batch'],
  }));
  const server = createServer(app);

  // Stripe webhook MUST be registered before express.json() for signature verification
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const { handleStripeWebhook } = await import("../stripe/webhook");
    return handleStripeWebhook(req, res);
  });

  const upload = multer(); // Store in memory

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

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "8080");
  const port = await findAvailablePort(preferredPort);
  
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server ready on port ${port}`);
    
    // 1. Start the Daemon (This is your loop)
    console.log('📻 Starting Broadcast Daemon...');
    startBroadcastDaemon().catch(err => console.error("Daemon Error:", err));

    // 2. Only run Global Sync if we aren't already rate-limited 
    // and maybe delay it by 5 seconds so the server is fully stable
    setTimeout(() => {
      console.log('🔄 Running initial global sync...');
      performGlobalSync().catch(err => {
        if (err.response?.status === 429) {
          console.warn("⚠️ Sync skipped: Rate limited by NewsAPI. Will retry later.");
        } else {
          console.error("Sync Error:", err);
        }
      });
    }, 5000);
  });
}

startServer().catch(console.error);

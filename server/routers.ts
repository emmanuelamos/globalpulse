import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { generateSpeech } from "./services/elevenlabs";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { getDb } from "./db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto"; 
import { eq, or, sql, desc, and, inArray, count, countDistinct, gt } from "drizzle-orm";
import { users, sessions, broadcastChat, comments, stories, callIns } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import crypto from "crypto";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, 
});

const globalChatMessages: {
  id: number;
  user: { name: string };
  message: string;
  createdAt: Date;
}[] = [];

export const appRouter = router({
system: systemRouter,

  // ─── Authentication ────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    // ----------------------------------------------------
    // 🛑 NEW: REGISTER MUTATION
    // ----------------------------------------------------
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().min(2, "Name must be at least 2 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      }))
      .mutation(async ({ input, ctx }) => {
        // 1. Grab the database instance using your custom getter
        const database = await db.getDb();
        if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database offline" });

        // 2. Check if email is already taken
        const [existingUser] = await database.select().from(users).where(eq(users.email, input.email)).limit(1);
        if (existingUser) {
          throw new TRPCError({ code: "CONFLICT", message: "Email is already in use" });
        }

        // 3. Hash password & generate an openId
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const openId = randomUUID(); 

        // 4. Insert new user into the database
        const [result] = await database.insert(users).values({
          openId,
          email: input.email,
          name: input.name,
          passwordHash: hashedPassword,
          loginMethod: "email",
        });

        // 5. Create a secure session token
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
        
        await database.insert(sessions).values({
          id: sessionId,
          userId: result.insertId, // MySQL returns the auto-incremented ID here
          expiresAt,
        });

        // 6. Set the browser cookie so they are instantly logged in
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionId, { ...cookieOptions, expires: expiresAt });

        return { success: true };
      }),

    // ----------------------------------------------------
    // 🛑 NEW: LOGIN MUTATION
    // ----------------------------------------------------
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // 1. Grab the database instance
        const database = await db.getDb();
        if (!database) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database offline" });

        // 2. Find the user by email
        const [user] = await database.select().from(users).where(eq(users.email, input.email)).limit(1);

        // If no user, or if they signed up with Google (no passwordHash)
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }

        // 3. Verify the password
        const isValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }

        // 4. Create a new session token
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
        
        await database.insert(sessions).values({
          id: sessionId,
          userId: user.id,
          expiresAt,
        });

        // 5. Update their lastSignedIn timestamp
        await database.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

        // 6. Set the browser cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionId, { ...cookieOptions, expires: expiresAt });

        return { success: true };
      }),

    googleCallback: publicProcedure
    .input(z.object({ 
      code: z.string(), 
      state: z.string() 
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // 1. Exchange the Google code for the actual User Data using your SDK
        const tokenResponse = await sdk.exchangeCodeForToken(input.code, input.state);
        const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB Error" });

        // 2. Upsert the User (Create them if they are new, update them if they exist)
        await db.insert(users).values({
          openId: userInfo.openId,
          email: userInfo.email ?? null,
          name: userInfo.name ?? null,
          loginMethod: "google",
          lastSignedIn: new Date(),
        }).onDuplicateKeyUpdate({
          set: { 
            openId: userInfo.openId,
            lastSignedIn: new Date(),
            name: userInfo.name ?? undefined, 
          }
        });

        // Grab the user we just inserted/updated
        const [user] = await db
          .select()
          .from(users)
          .where(
            or(
              eq(users.openId, userInfo.openId),
              eq(users.email, userInfo.email ?? "") // 👈 ADD THIS: Fallback to checking the email
            )
          )
          .limit(1);

        if (!user) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch user" });
        }

        // 3. Create the highly secure Database Session (The VIP Pass!)
        const sessionId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + ONE_YEAR_MS);

        await db.insert(sessions).values({
          id: sessionId,
          userId: user.id,
          expiresAt,
        });

        // 4. Slap the cookie on the response so the browser saves it
        const isProd = process.env.NODE_ENV === "production";
        ctx.res.cookie(COOKIE_NAME, sessionId, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
          path: "/",
          maxAge: ONE_YEAR_MS,
        });

        return { success: true, user };

      } catch (error) {
        console.error("[Google Auth Error]:", error);
        throw new TRPCError({ 
          code: "UNAUTHORIZED", 
          message: "Failed to authenticate with Google" 
        });
      }
    }),
  }),

  // ─── Stories ────────────────────────────────────────────────
  stories: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        businessSubcategory: z.string().optional(),
        country: z.string().optional(),
        limit: z.number().min(1).max(50).optional(),
        offset: z.number().min(0).optional(),
        language: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getStories(input ?? {});
      }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getStoryById(input.id);
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).optional(),
      }))
      .query(async ({ input }) => {
        return db.searchStories(input.query, input.limit);
      }),

      getSpeech: publicProcedure
      .input(z.object({ text: z.string(), voiceId: z.string() }))
      .mutation(async ({ input }) => {
        return generateSpeech(input.text, input.voiceId);
      }),
  }),

  // ─── Rankings ───────────────────────────────────────────────
  rankings: router({
    list: publicProcedure
      .input(z.object({
        type: z.string(),
        entityType: z.string().optional(),
        country: z.string().optional(),
        period: z.string().optional(),
        limit: z.number().min(1).max(50).optional(),
        language: z.string().default('en')
      }))
      .query(async ({ input }) => {
        return db.getRankings(input);
      }),
  }),

  // ─── Comments ───────────────────────────────────────────────
  comments: router({
    byStory: publicProcedure
      .input(z.object({ storyId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB Error" });

        // Grab comments AND join the users table to get the name
        const fetchedComments = await db
          .select({
            id: comments.id,
            content: comments.content,
            createdAt: comments.createdAt,
            parentId: comments.parentId,
            user: {
              id: users.id,
              name: users.name,
            }
          })
          .from(comments)
          .leftJoin(users, eq(comments.userId, users.id)) // 👈 The magic join
          .where(eq(comments.storyId, input.storyId));

        return fetchedComments;
      }),

    create: protectedProcedure
      .input(z.object({
        storyId: z.number(),
        parentId: z.number().optional(),
        content: z.string().min(1).max(2000),
      }))
      .mutation(async ({ ctx, input }) => {
         const db = await getDb();
         if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB Error" });
         
         // 1. Insert the comment into the database
         await db.insert(comments).values({
          storyId: input.storyId,
          userId: ctx.user.id,
          parentId: input.parentId ?? null,
          content: input.content,
         });

         // 2. 👈 ADD THIS: Increment the commentsCount on the story
         await db.update(stories)
           .set({ commentsCount: sql`${stories.commentsCount} + 1` })
           .where(eq(stories.id, input.storyId));

         return { success: true };
      }),
  }),

  // ─── Likes ──────────────────────────────────────────────────
  likes: router({
    toggle: protectedProcedure
      .input(z.object({
        storyId: z.number().optional(),
        commentId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.toggleLike(ctx.user.id, input.storyId, input.commentId);
      }),

    mine: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserLikes(ctx.user.id);
      }),
  }),

  // ─── Waitlist ───────────────────────────────────────────────
  waitlist: router({
    join: publicProcedure
      .input(z.object({
        email: z.string().email(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addToWaitlist(input.email, input.source);
      }),

    count: publicProcedure
      .query(async () => {
        return db.getWaitlistCount();
      }),
  }),

  // ─── Stripe Payments ────────────────────────────────────────
  payments: router({
    createPremiumCheckout: protectedProcedure
      .input(z.object({ origin: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { createPremiumCheckout } = await import("./stripe/stripe");
        return createPremiumCheckout({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || null,
          origin: input.origin,
          stripeCustomerId: ctx.user.stripeCustomerId,
        });
      }),

    createCallInCheckout: protectedProcedure
      .input(z.object({ origin: z.string(), room: z.string().optional(), callId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { createCallInCheckout } = await import("./stripe/stripe");
        return createCallInCheckout({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || null,
          room: input.room || "global",
          origin: input.origin,
          callId: input.callId,
          stripeCustomerId: ctx.user.stripeCustomerId,
        });
      }),
      createCustomerPortal: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { getStripe } = await import("./stripe/stripe");
      const stripe = getStripe();

      if (!ctx.user.stripeCustomerId) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "No active subscription found." 
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: ctx.user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8080'}/profile`,
      });

      return { url: session.url };
    }),
  }),

  // ─── Call-Ins ───────────────────────────────────────────────
  callIns: router({
    queue: publicProcedure
    .input(z.object({ room: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB Error" });

      return await db
        .select({
          id: callIns.id,
          status: callIns.status,
          topic: callIns.topic,
          country: callIns.country,
          user: {
            name: users.name,
          }
        })
        .from(callIns)
        .leftJoin(users, eq(callIns.userId, users.id))
        // ✨ FIX: Allow both 'queued' (waiting) and 'live' (currently talking)
        .where(
          and(
            eq(callIns.room, input.room ?? "global"),
            inArray(callIns.status, ["queued", "live"]) 
          )
        )
        .orderBy(desc(callIns.status), desc(callIns.createdAt)); // 'live' will float to the top
    }),

    join: protectedProcedure
      .input(z.object({
        room: z.string().optional(),
        country: z.string().optional(),
        topic: z.string().min(1),
        audioUrl: z.string().url(),
        transcript: z.string().min(1),
        durationSec: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB Error" });

        // Insert the new call-in with the Cloudflare R2 audio link and transcript
        await db.insert(callIns).values({
          userId: ctx.user.id,
          room: input.room ?? "global",
          country: input.country,
          topic: input.topic,
          audioUrl: input.audioUrl,
          transcript: input.transcript,
          durationSec: input.durationSec,
          status: "queued",
        });

        return { success: true };
      }),
  }),

  // ─── Push Notifications ────────────────────────────────────
  notifications: router({
    subscribe: publicProcedure
      .input(z.object({
        endpoint: z.string(),
        p256dh: z.string(),
        auth: z.string(),
        categories: z.array(z.string()).optional(),
        countries: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.savePushSubscription({
          userId: ctx.user?.id ?? null,
          endpoint: input.endpoint,
          p256dh: input.p256dh,
          auth: input.auth,
          categories: input.categories ?? null,
          countries: input.countries ?? null,
        });
      }),

    unsubscribe: publicProcedure
      .input(z.object({ endpoint: z.string() }))
      .mutation(async ({ input }) => {
        return db.removePushSubscription(input.endpoint);
      }),
  }),

  // ─── Contact Messages ──────────────────────────────────────
  contact: router({
    send: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(256),
        email: z.string().email(),
        subject: z.string().min(1).max(512),
        department: z.string().optional(),
        message: z.string().min(1).max(5000),
      }))
      .mutation(async ({ input }) => {
        return db.createContactMessage({
          name: input.name,
          email: input.email,
          subject: input.subject,
          department: input.department,
          message: input.message,
        });
      }),
  }),

  // ─── Feedback / Suggestions ────────────────────────────────
  feedback: router({
    submit: publicProcedure
      .input(z.object({
        feedbackType: z.enum(["bug_report", "feature_request", "segment_suggestion", "general"]),
        message: z.string().min(1).max(5000),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createFeedback({
          userId: ctx.user?.id ?? null,
          email: input.email ?? ctx.user?.email ?? null,
          feedbackType: input.feedbackType,
          message: input.message,
        });
      }),

    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return db.getFeedbackList(input?.status);
      }),
  }),

  // ─── Broadcast Schedule ────────────────────────────────────
  broadcast: router({
    segments: publicProcedure
      .query(async () => {
        return db.getBroadcastSegments();
      }),

    timetable: publicProcedure
      .input(z.object({
        roomId: z.string(),
        dayOfWeek: z.number().min(0).max(6).optional(),
      }))
      .query(async ({ input }) => {
        return db.getTimetable(input.roomId, input.dayOfWeek);
      }),

      getState: publicProcedure
      .input(z.object({ roomSlug: z.string().default("global") }))
      .query(async ({ input }) => {
        return db.getLiveRoomState(input.roomSlug);
      }),
  }),

  // ─── Broadcast Chat ─────────────────────────────────────────
  broadcastChat: router({
      getRecent: publicProcedure
        .input(z.object({ roomSlug: z.string().default("global"), limit: z.number().default(50) }))
        .query(async ({ input }) => {
          const db = await getDb();

          // 👈 ADD THIS NULL CHECK to make TypeScript happy!
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB Connection Failed" });
          
          // Grab the most recent messages AND the user's name who sent it
          const messages = await db
            .select({
              id: broadcastChat.id,
              message: broadcastChat.message,
              createdAt: broadcastChat.createdAt,
              user: { name: users.name }
            })
            .from(broadcastChat)
            .leftJoin(users, eq(broadcastChat.userId, users.id))
            .where(eq(broadcastChat.roomSlug, input.roomSlug))
            .orderBy(desc(broadcastChat.createdAt))
            .limit(input.limit);
            
          // Reverse it so the newest messages are at the bottom of the chat UI
          return messages.reverse(); 
        }),

      send: protectedProcedure
        .input(z.object({ roomSlug: z.string(), message: z.string() }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          // ADD THIS NULL CHECK to make TypeScript happy!
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB Connection Failed" });
          // Insert directly into your database
          const [result] = await db.insert(broadcastChat).values({
            roomSlug: input.roomSlug,
            userId: ctx.user.id,
            message: input.message,
          });

          // Return the formatted message so the UI can display it instantly
          return {
            id: result.insertId,
            message: input.message,
            createdAt: new Date(),
            user: { name: ctx.user.name || "Anonymous" }
          };
        }),
  }),
  
  // ─── Country Rooms ─────────────────────────────────────────
  countryRooms: router({
    list: publicProcedure
      .query(async () => {
        return db.getCountryRooms();
      }),

    byCode: publicProcedure
      .input(z.object({ countryCode: z.string() }))
      .query(async ({ input }) => {
        return db.getCountryRoomByCode(input.countryCode);
      }),
  }),

  // ─── Country Votes ─────────────────────────────────────────
  countryVotes: router({
    vote: publicProcedure
      .input(z.object({
        countryCode: z.string().min(2).max(3),
        countryName: z.string().min(1),
        email: z.string().email().optional(),
        notifyWhenLive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createCountryVote({
          countryCode: input.countryCode,
          countryName: input.countryName,
          userId: ctx.user?.id ?? null,
          email: input.email ?? ctx.user?.email ?? null,
          notifyWhenLive: input.notifyWhenLive ?? true,
        });
      }),

    counts: publicProcedure
      .query(async () => {
        return db.getCountryVoteCounts();
      }),

    hasVoted: protectedProcedure
      .input(z.object({ countryCode: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.hasUserVotedForCountry(ctx.user.id, input.countryCode);
      }),
  }),

  // ─── User Category Preferences ─────────────────────────────
  categoryPrefs: router({
    get: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserCategoryPrefs(ctx.user.id);
      }),

    update: protectedProcedure
      .input(z.object({
        categoryOrder: z.array(z.string()),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.upsertUserCategoryPrefs(ctx.user.id, input.categoryOrder);
      }),
  }),
  
  stats: router({
    getHeroStats: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { listeners: 0, countries: 0, storiesToday: 0 };

      // 1. Get total stories created in the last 24 hours
      const [storyResult] = await db
        .select({ value: count() })
        .from(stories)
        // .where(gt(stories.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

      // 2. Get distinct countries from call-ins
      const [countryResult] = await db
        .select({ value: countDistinct(callIns.country) })
        .from(callIns);

      // 3. Vibe-based Listener calculation
      const storyCount = storyResult?.value ?? 0;
      const baseListeners = 1000; 
      const liveBoost = storyCount * 12; 

      return {
        listeners: baseListeners + liveBoost,
        countries: (countryResult?.value ?? 0) + 12, // Base seed + DB results
        storiesToday: storyCount,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;

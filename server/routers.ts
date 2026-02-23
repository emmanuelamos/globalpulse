import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
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
        return db.getCommentsByStory(input.storyId);
      }),

    create: protectedProcedure
      .input(z.object({
        storyId: z.number(),
        parentId: z.number().optional(),
        content: z.string().min(1).max(2000),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createComment({
          storyId: input.storyId,
          userId: ctx.user.id,
          parentId: input.parentId ?? null,
          content: input.content,
        });
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
      .input(z.object({ origin: z.string(), room: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { createCallInCheckout } = await import("./stripe/stripe");
        return createCallInCheckout({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || null,
          room: input.room || "global",
          origin: input.origin,
          stripeCustomerId: ctx.user.stripeCustomerId,
        });
      }),
  }),

  // ─── Call-Ins ───────────────────────────────────────────────
  callIns: router({
    queue: publicProcedure
      .input(z.object({ room: z.string().optional() }))
      .query(async ({ input }) => {
        return db.getCallInQueue(input.room);
      }),

    join: protectedProcedure
      .input(z.object({
        room: z.string().optional(),
        country: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createCallIn({
          userId: ctx.user.id,
          room: input.room ?? "global",
          country: input.country,
        });
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
});

export type AppRouter = typeof appRouter;

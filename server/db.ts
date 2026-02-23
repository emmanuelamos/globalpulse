import { eq, and, desc, asc, like, sql, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  stories, InsertStory,
  rankings, InsertRanking,
  comments, InsertComment,
  likes, InsertLike,
  waitlist, InsertWaitlistEntry,
  callIns, InsertCallIn,
  pushSubscriptions, InsertPushSubscription,
  contactMessages, InsertContactMessage,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User Helpers ───────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Story Helpers ──────────────────────────────────────────────

export async function getStories(opts: {
  category?: string;
  businessSubcategory?: string;
  country?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (opts.category) conditions.push(eq(stories.category, opts.category as any));
  if (opts.businessSubcategory) conditions.push(eq(stories.businessSubcategory, opts.businessSubcategory as any));
  if (opts.country) conditions.push(eq(stories.country, opts.country));

  const query = db.select().from(stories)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(stories.heatScore), desc(stories.publishedAt))
    .limit(opts.limit ?? 20)
    .offset(opts.offset ?? 0);

  return query;
}

export async function getStoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  return result[0];
}

export async function createStory(story: InsertStory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(stories).values(story);
  return result;
}

export async function searchStories(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return db.select().from(stories)
    .where(or(
      like(stories.title, searchTerm),
      like(stories.summary, searchTerm),
      like(stories.category, searchTerm),
      like(stories.country, searchTerm),
      like(stories.city, searchTerm),
    ))
    .orderBy(desc(stories.heatScore))
    .limit(limit);
}

// ─── Rankings Helpers ───────────────────────────────────────────

export async function getRankings(opts: {
  type: string;
  entityType?: string;
  country?: string;
  period?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(rankings.type, opts.type as any)];
  if (opts.entityType) conditions.push(eq(rankings.entityType, opts.entityType as any));
  if (opts.country) conditions.push(eq(rankings.country, opts.country));
  if (opts.period) conditions.push(eq(rankings.period, opts.period as any));

  return db.select().from(rankings)
    .where(and(...conditions))
    .orderBy(asc(rankings.rank))
    .limit(opts.limit ?? 10);
}

// ─── Comment Helpers ────────────────────────────────────────────

export async function getCommentsByStory(storyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    comment: comments,
    userName: users.name,
  })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.storyId, storyId))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(comments).values(comment);
}

// ─── Like Helpers ───────────────────────────────────────────────

export async function toggleLike(userId: number, storyId?: number, commentId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [eq(likes.userId, userId)];
  if (storyId) conditions.push(eq(likes.storyId, storyId));
  if (commentId) conditions.push(eq(likes.commentId, commentId));

  const existing = await db.select().from(likes).where(and(...conditions)).limit(1);

  if (existing.length > 0) {
    await db.delete(likes).where(eq(likes.id, existing[0].id));
    // Decrement count
    if (storyId) {
      await db.update(stories).set({ likesCount: sql`${stories.likesCount} - 1` }).where(eq(stories.id, storyId));
    }
    if (commentId) {
      await db.update(comments).set({ likesCount: sql`${comments.likesCount} - 1` }).where(eq(comments.id, commentId));
    }
    return { liked: false };
  } else {
    await db.insert(likes).values({ userId, storyId, commentId });
    if (storyId) {
      await db.update(stories).set({ likesCount: sql`${stories.likesCount} + 1` }).where(eq(stories.id, storyId));
    }
    if (commentId) {
      await db.update(comments).set({ likesCount: sql`${comments.likesCount} + 1` }).where(eq(comments.id, commentId));
    }
    return { liked: true };
  }
}

export async function getUserLikes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(likes).where(eq(likes.userId, userId));
}

// ─── Waitlist Helpers ───────────────────────────────────────────

export async function addToWaitlist(email: string, source = "landing") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(waitlist).values({ email, source });
    return { success: true, message: "Added to waitlist" };
  } catch (e: any) {
    if (e?.code === "ER_DUP_ENTRY") {
      return { success: true, message: "Already on the waitlist" };
    }
    throw e;
  }
}

export async function getWaitlistCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(waitlist);
  return result[0]?.count ?? 0;
}

// ─── Call-In Helpers ────────────────────────────────────────────

export async function createCallIn(callIn: InsertCallIn) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(callIns).values(callIn);
}

export async function getCallInQueue(room = "global") {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    callIn: callIns,
    userName: users.name,
  })
    .from(callIns)
    .leftJoin(users, eq(callIns.userId, users.id))
    .where(and(
      eq(callIns.room, room),
      eq(callIns.status, "queued"),
    ))
    .orderBy(asc(callIns.createdAt))
    .limit(20);
}

// ─── Push Subscription Helpers ─────────────────────────────────

export async function savePushSubscription(sub: InsertPushSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(pushSubscriptions).values(sub);
}

export async function removePushSubscription(endpoint: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
}

export async function getPushSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pushSubscriptions);
}

// ─── Contact Message Helpers ───────────────────────────────────

export async function createContactMessage(msg: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactMessages).values(msg);
  return { success: true, message: "Message received" };
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

// ─── Feedback Helpers ─────────────────────────────────────────

import {
  feedback, InsertFeedback,
  broadcastSegments, InsertBroadcastSegment,
  broadcastTimetable, InsertBroadcastTimetableEntry,
  countryRooms, InsertCountryRoom,
  countryVotes, InsertCountryVote,
  userCategoryPrefs, InsertUserCategoryPref,
} from "../drizzle/schema";

export async function createFeedback(fb: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(feedback).values(fb);
  return { success: true, message: "Feedback submitted" };
}

export async function getFeedbackList(status?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = status ? [eq(feedback.status, status as any)] : [];
  return db.select().from(feedback)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(feedback.createdAt));
}

// ─── Broadcast Segment Helpers ────────────────────────────────

export async function getBroadcastSegments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(broadcastSegments)
    .where(eq(broadcastSegments.isActive, true))
    .orderBy(asc(broadcastSegments.name));
}

export async function createBroadcastSegment(segment: InsertBroadcastSegment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(broadcastSegments).values(segment);
}

// ─── Broadcast Timetable Helpers ──────────────────────────────

export async function getTimetable(roomId: string, dayOfWeek?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(broadcastTimetable.roomId, roomId)];
  if (dayOfWeek !== undefined) conditions.push(eq(broadcastTimetable.dayOfWeek, dayOfWeek));
  return db.select({
    entry: broadcastTimetable,
    segment: broadcastSegments,
  })
    .from(broadcastTimetable)
    .leftJoin(broadcastSegments, eq(broadcastTimetable.segmentId, broadcastSegments.id))
    .where(and(...conditions))
    .orderBy(asc(broadcastTimetable.sortOrder), asc(broadcastTimetable.startHour));
}

export async function upsertTimetableEntry(entry: InsertBroadcastTimetableEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(broadcastTimetable).values(entry);
}

export async function deleteTimetableEntry(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(broadcastTimetable).where(eq(broadcastTimetable.id, id));
}

// ─── Country Room Helpers ─────────────────────────────────────

export async function getCountryRooms(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const conditions = activeOnly ? [eq(countryRooms.isActive, true)] : [];
  return db.select().from(countryRooms)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(countryRooms.countryName));
}

export async function getCountryRoomByCode(countryCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(countryRooms)
    .where(eq(countryRooms.countryCode, countryCode))
    .limit(1);
  return result[0];
}

export async function createCountryRoom(room: InsertCountryRoom) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(countryRooms).values(room);
}

// ─── Country Vote Helpers ─────────────────────────────────────

export async function createCountryVote(vote: InsertCountryVote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(countryVotes).values(vote);
  return { success: true, message: "Vote recorded" };
}

export async function getCountryVoteCounts() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    countryCode: countryVotes.countryCode,
    countryName: countryVotes.countryName,
    voteCount: sql<number>`COUNT(*)`,
  })
    .from(countryVotes)
    .groupBy(countryVotes.countryCode, countryVotes.countryName)
    .orderBy(sql`COUNT(*) DESC`);
}

export async function hasUserVotedForCountry(userId: number, countryCode: string) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(countryVotes)
    .where(and(
      eq(countryVotes.userId, userId),
      eq(countryVotes.countryCode, countryCode),
    ))
    .limit(1);
  return result.length > 0;
}

// ─── User Category Preference Helpers ─────────────────────────

export async function getUserCategoryPrefs(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userCategoryPrefs)
    .where(eq(userCategoryPrefs.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

export async function upsertUserCategoryPrefs(userId: number, categoryOrder: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getUserCategoryPrefs(userId);
  if (existing) {
    await db.update(userCategoryPrefs)
      .set({ categoryOrder: JSON.stringify(categoryOrder) })
      .where(eq(userCategoryPrefs.userId, userId));
  } else {
    await db.insert(userCategoryPrefs).values({
      userId,
      categoryOrder: JSON.stringify(categoryOrder),
    });
  }
  return { success: true };
}

import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, bigint, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  preferredLanguage: varchar("preferredLanguage", { length: 10 }).default("en"),
  notificationPrefs: json("notificationPrefs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * News stories — aggregated from APIs, AI-summarized, categorized and ranked.
 */
export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 256 }),
  title: text("title").notNull(),
  summary: text("summary"),
  aiSummary: text("aiSummary"),
  sourceUrl: varchar("sourceUrl", { length: 768 }).unique(),
  sourceName: varchar("sourceName", { length: 256 }),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  category: mysqlEnum("category", [
    "crime", "trending", "funny", "entertainment",
    "celebrity", "gossip", "weather", "business", "sports",
  ]).notNull(),
  businessSubcategory: mysqlEnum("businessSubcategory", [
    "stocks", "crypto", "apps", "startups", "products",
  ]),
  country: varchar("country", { length: 3 }),
  region: varchar("region", { length: 128 }),
  city: varchar("city", { length: 128 }),
  heatScore: int("heatScore").default(0),
  rank: int("rank"),
  likesCount: int("likesCount").default(0),
  commentsCount: int("commentsCount").default(0),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;

/**
 * Rankings — country/city rankings across different metrics.
 */
export const rankings = mysqlTable("rankings", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", [
    "crime", "safest", "violent", "fun",
    "coldest", "hottest", "calmest", "business", "sports",'trending',
    'celebrity',
    'gossip',
    'funny'
  ]).notNull(),
  entityName: varchar("entityName", { length: 256 }).notNull(),
  entityType: mysqlEnum("entityType", ["country", "state", "city", "match", "show",'topic','person']).notNull(),
  country: varchar("country", { length: 30 }),
  parentEntity: varchar("parentEntity", { length: 256 }),
  flag: varchar("flag", { length: 16 }),
  rank: int("rank").notNull(),
  stat: varchar("stat", { length: 128 }),
  trend: mysqlEnum("trend", ["up", "down", "same"]).default("same"),
  aiExplanation: text("aiExplanation"),
  period: mysqlEnum("period", ["today", "week", "month", "year"]).default("today"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ranking = typeof rankings.$inferSelect;
export type InsertRanking = typeof rankings.$inferInsert;

/**
 * Comments on stories.
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  storyId: int("storyId").notNull(),
  userId: int("userId").notNull(),
  parentId: int("parentId"),
  content: text("content").notNull(),
  likesCount: int("likesCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Likes on stories and comments.
 */
export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  storyId: int("storyId"),
  commentId: int("commentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

/**
 * Waitlist email collection.
 */
export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  source: varchar("source", { length: 64 }).default("landing"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = typeof waitlist.$inferInsert;

/**
 * Call-in records for the Broadcasters Room.
 */
export const callIns = mysqlTable("callIns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  room: varchar("room", { length: 64 }).default("global"),
  country: varchar("country", { length: 3 }),
  status: mysqlEnum("status", ["queued", "live", "completed", "cancelled"]).default("queued"),
  durationSec: int("durationSec"),
  stripePaymentId: varchar("stripePaymentId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CallIn = typeof callIns.$inferSelect;
export type InsertCallIn = typeof callIns.$inferInsert;

/**
 * Push notification subscriptions.
 */
export const pushSubscriptions = mysqlTable("pushSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  endpoint: varchar("endpoint", { length: 2048 }).notNull(),
  p256dh: varchar("p256dh", { length: 512 }).notNull(),
  auth: varchar("auth", { length: 256 }).notNull(),
  categories: json("categories"),
  countries: json("countries"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

/**
 * Contact form messages.
 */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 512 }).notNull(),
  department: varchar("department", { length: 64 }).default("general"),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Sports subcategory on stories.
 */
export const sportsSubcategoryEnum = mysqlEnum("sportsSubcategory", [
  "football", "basketball", "american_football", "f1", "tennis", "mma", "olympics",
]);

/**
 * Feedback / suggestion submissions from FAQ page.
 */
export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }),
  feedbackType: mysqlEnum("feedbackType", ["bug_report", "feature_request", "segment_suggestion", "general"]).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "reviewed", "resolved"]).default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;

/**
 * Broadcast segments — defines the types of segments available.
 */
export const broadcastSegments = mysqlTable("broadcastSegments", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  category: varchar("category", { length: 64 }),
  durationMinutes: int("durationMinutes").default(60),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BroadcastSegment = typeof broadcastSegments.$inferSelect;
export type InsertBroadcastSegment = typeof broadcastSegments.$inferInsert;

/**
 * Broadcast timetable — schedule of segments for each room per day.
 */
export const broadcastTimetable = mysqlTable("broadcastTimetable", {
  id: int("id").autoincrement().primaryKey(),
  roomId: varchar("roomId", { length: 64 }).notNull(),
  segmentId: int("segmentId").notNull(),
  dayOfWeek: int("dayOfWeek").notNull(),
  startHour: int("startHour").notNull(),
  startMinute: int("startMinute").default(0),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BroadcastTimetableEntry = typeof broadcastTimetable.$inferSelect;
export type InsertBroadcastTimetableEntry = typeof broadcastTimetable.$inferInsert;

/**
 * Country broadcasting rooms — each country has its own room with broadcaster pair.
 */
export const countryRooms = mysqlTable("countryRooms", {
  id: int("id").autoincrement().primaryKey(),
  countryCode: varchar("countryCode", { length: 3 }).notNull().unique(),
  countryName: varchar("countryName", { length: 128 }).notNull(),
  flag: varchar("flag", { length: 16 }).notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull(),
  primaryLanguage: varchar("primaryLanguage", { length: 64 }).notNull(),
  broadcasterMaleName: varchar("broadcasterMaleName", { length: 128 }).notNull(),
  broadcasterFemaleName: varchar("broadcasterFemaleName", { length: 128 }).notNull(),
  broadcasterMaleEthnicity: varchar("broadcasterMaleEthnicity", { length: 128 }),
  broadcasterFemaleEthnicity: varchar("broadcasterFemaleEthnicity", { length: 128 }),
  maxDailyCallIns: int("maxDailyCallIns").default(50),
  isActive: boolean("isActive").default(true),
  demoTranscript: json("demoTranscript"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CountryRoom = typeof countryRooms.$inferSelect;
export type InsertCountryRoom = typeof countryRooms.$inferInsert;

/**
 * Country room votes — users vote for their country to get a broadcasting room.
 */
export const countryVotes = mysqlTable("countryVotes", {
  id: int("id").autoincrement().primaryKey(),
  countryCode: varchar("countryCode", { length: 3 }).notNull(),
  countryName: varchar("countryName", { length: 128 }).notNull(),
  userId: int("userId"),
  email: varchar("email", { length: 320 }),
  notifyWhenLive: boolean("notifyWhenLive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CountryVote = typeof countryVotes.$inferSelect;
export type InsertCountryVote = typeof countryVotes.$inferInsert;

/**
 * User category preferences — drag-and-rank order for personalized experience.
 */
export const userCategoryPrefs = mysqlTable("userCategoryPrefs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  categoryOrder: json("categoryOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserCategoryPref = typeof userCategoryPrefs.$inferSelect;
export type InsertUserCategoryPref = typeof userCategoryPrefs.$inferInsert;

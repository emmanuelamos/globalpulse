import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { eq } from "drizzle-orm"; // <-- Add this
import { COOKIE_NAME } from "@shared/const"; // <-- Add this
import { getDb } from "../db"; // <-- Adjust path to your db.ts if needed
import { users, sessions, type User } from "../../drizzle/schema"; // <-- Add this
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // 1. Read the cookie that your login mutation set
    // Note: This requires app.use(cookieParser()) in your Express setup!
    const sessionId = opts.req.cookies?.[COOKIE_NAME];

    if (sessionId) {
      const db = await getDb();
      if (db) {
        // 2. Look up the session in the database and join the user data
        const result = await db
          .select({ user: users })
          .from(sessions)
          .innerJoin(users, eq(sessions.userId, users.id))
          .where(eq(sessions.id, sessionId))
          .limit(1);

        if (result.length > 0) {
          user = result[0].user; // Found them!
        }
      }
    } else {
      // (Optional) Fallback to the old SDK method if you still need it for other things
      user = await sdk.authenticateRequest(opts.req).catch(() => null);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error("[Auth Error in Context]:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
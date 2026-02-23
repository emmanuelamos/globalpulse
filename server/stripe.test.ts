import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@globalpulse.app",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    subscriptionTier: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    preferredLanguage: "en",
    notificationPrefs: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("payments router structure", () => {
  it("has createPremiumCheckout procedure", () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(typeof caller.payments.createPremiumCheckout).toBe("function");
  });

  it("has createCallInCheckout procedure", () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(typeof caller.payments.createCallInCheckout).toBe("function");
  });

  it("rejects unauthenticated premium checkout", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.payments.createPremiumCheckout({ origin: "https://test.com" })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated call-in checkout", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.payments.createCallInCheckout({ origin: "https://test.com" })
    ).rejects.toThrow();
  });
});

describe("products configuration", () => {
  it("has correct product definitions", async () => {
    const { PRODUCTS } = await import("./stripe/products");
    expect(PRODUCTS.premium.priceMonthly).toBe(400);
    expect(PRODUCTS.premium.currency).toBe("usd");
    expect(PRODUCTS.callIn.price).toBe(99);
    expect(PRODUCTS.callIn.currency).toBe("usd");
    expect(PRODUCTS.premium.features.length).toBeGreaterThan(0);
    expect(PRODUCTS.callIn.features.length).toBeGreaterThan(0);
  });
});

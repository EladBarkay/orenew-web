import { describe, it, expect } from "vitest";
import { planMutation, isHandledEvent, WebhookError } from "@/lib/billing";
import type { LsWebhookEvent } from "@/lib/lemonsqueezy";

const env = {
  LEMONSQUEEZY_VARIANT_PRO_MONTHLY: "111",
  LEMONSQUEEZY_VARIANT_PRO_YEARLY: "222",
  LEMONSQUEEZY_VARIANT_STUDIO_MONTHLY: "333",
  LEMONSQUEEZY_VARIANT_STUDIO_YEARLY: "444",
};

const NOW = new Date("2026-06-20T00:00:00Z");

function event(overrides: {
  eventName?: string;
  userId?: string | null;
  variant?: number;
  status?: string;
  renews_at?: string | null;
  ends_at?: string | null;
  subId?: string;
}): LsWebhookEvent {
  return {
    meta: {
      event_name: overrides.eventName ?? "subscription_created",
      custom_data:
        overrides.userId === null ? undefined : { user_id: overrides.userId ?? "user-1" },
    },
    data: {
      id: overrides.subId ?? "sub-1",
      attributes: {
        store_id: 1,
        customer_id: 42,
        variant_id: overrides.variant ?? 222,
        status: overrides.status ?? "active",
        renews_at: overrides.renews_at ?? "2027-06-20T00:00:00Z",
        ends_at: overrides.ends_at ?? null,
      },
    },
  };
}

describe("isHandledEvent", () => {
  it("accepts subscription lifecycle events", () => {
    expect(isHandledEvent("subscription_created")).toBe(true);
    expect(isHandledEvent("subscription_cancelled")).toBe(true);
    expect(isHandledEvent("order_created")).toBe(false);
  });
});

describe("planMutation", () => {
  it("plans an active Pro-yearly purchase", () => {
    const plan = planMutation(event({}), { env, now: NOW });
    expect(plan.entitlement).toEqual({
      user_id: "user-1",
      tier: "pro",
      expires_at: null,
      updated_at: NOW.toISOString(),
    });
    expect(plan.subscription).toMatchObject({
      user_id: "user-1",
      ls_customer_id: "42",
      ls_subscription_id: "sub-1",
      ls_variant_id: "222",
      tier: "pro",
      status: "active",
      current_period_end: "2027-06-20",
    });
  });

  it("grants Pro with no expiry during a trial", () => {
    // on_trial: full paid access, no expires_at — LS will send the convert/cancel
    // event later to flip it. This is the 14-day-trial money path.
    const plan = planMutation(event({ variant: 111, status: "on_trial" }), { env, now: NOW });
    expect(plan.entitlement.tier).toBe("pro");
    expect(plan.entitlement.expires_at).toBeNull();
    expect(plan.subscription.status).toBe("on_trial");
  });

  it("keeps tier but sets grace expiry on cancel", () => {
    const plan = planMutation(
      event({ eventName: "subscription_cancelled", status: "cancelled", ends_at: "2026-07-01T00:00:00Z" }),
      { env, now: NOW },
    );
    expect(plan.entitlement.tier).toBe("pro");
    expect(plan.entitlement.expires_at).toBe("2026-07-01");
  });

  it("drops to free when expired", () => {
    const plan = planMutation(event({ status: "expired" }), { env, now: NOW });
    expect(plan.entitlement.tier).toBe("free");
    expect(plan.entitlement.expires_at).toBeNull();
  });

  it("uses the fallback user id when custom_data is absent", () => {
    const plan = planMutation(event({ userId: null }), {
      env,
      now: NOW,
      fallbackUserId: "recovered-user",
    });
    expect(plan.entitlement.user_id).toBe("recovered-user");
  });

  it("rejects a missing user id", () => {
    expect(() => planMutation(event({ userId: null }), { env, now: NOW })).toThrow(WebhookError);
  });

  it("rejects an unknown variant", () => {
    expect(() => planMutation(event({ variant: 999 }), { env, now: NOW })).toThrow(/unknown variant/);
  });

  it("maps studio monthly", () => {
    const plan = planMutation(event({ variant: 333 }), { env, now: NOW });
    expect(plan.subscription.tier).toBe("studio");
  });
});

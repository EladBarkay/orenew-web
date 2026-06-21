import { describe, it, expect } from "vitest";
import {
  PLANS,
  monthlyEquivalent,
  annualSavingPercent,
  variantEnvKey,
  buildVariantMap,
  tierForVariant,
  resolveEntitlementTier,
} from "@/lib/pricing";

describe("pricing model", () => {
  it("matches the published prices and seats", () => {
    expect(PLANS.pro.pricing).toEqual({ monthly: 15, yearly: 150 });
    expect(PLANS.studio.pricing).toEqual({ monthly: 45, yearly: 450 });
    expect(PLANS.pro.seats).toBe(1);
    expect(PLANS.studio.seats).toBe(5);
    expect(PLANS.free.seats).toBeNull();
  });

  it("amortizes annual to a monthly-equivalent", () => {
    expect(monthlyEquivalent(PLANS.pro.pricing!, "monthly")).toBe(15);
    expect(monthlyEquivalent(PLANS.pro.pricing!, "yearly")).toBe(12.5);
  });

  it("computes the annual saving as ~17%", () => {
    expect(annualSavingPercent(PLANS.pro.pricing!)).toBe(17);
    expect(annualSavingPercent(PLANS.studio.pricing!)).toBe(17);
  });
});

describe("variant <-> tier mapping", () => {
  const env = {
    LEMONSQUEEZY_VARIANT_PRO_MONTHLY: "111",
    LEMONSQUEEZY_VARIANT_PRO_YEARLY: "222",
    LEMONSQUEEZY_VARIANT_STUDIO_MONTHLY: "333",
    LEMONSQUEEZY_VARIANT_STUDIO_YEARLY: "444",
  };

  it("builds env keys", () => {
    expect(variantEnvKey("pro", "monthly")).toBe("LEMONSQUEEZY_VARIANT_PRO_MONTHLY");
    expect(variantEnvKey("studio", "yearly")).toBe("LEMONSQUEEZY_VARIANT_STUDIO_YEARLY");
  });

  it("maps every configured variant", () => {
    expect(buildVariantMap(env).size).toBe(4);
    expect(tierForVariant("222", env)).toEqual({ tier: "pro", period: "yearly" });
    expect(tierForVariant(333, env)).toEqual({ tier: "studio", period: "monthly" });
  });

  it("returns null for unknown variants", () => {
    expect(tierForVariant("999", env)).toBeNull();
  });

  it("skips unconfigured variants", () => {
    expect(buildVariantMap({}).size).toBe(0);
  });
});

describe("resolveEntitlementTier", () => {
  it("grants the paid tier while active or in cancel-grace", () => {
    expect(resolveEntitlementTier("active", "pro")).toBe("pro");
    expect(resolveEntitlementTier("on_trial", "studio")).toBe("studio");
    expect(resolveEntitlementTier("past_due", "pro")).toBe("pro");
    expect(resolveEntitlementTier("cancelled", "studio")).toBe("studio");
  });

  it("drops to free once expired or unpaid", () => {
    expect(resolveEntitlementTier("expired", "pro")).toBe("free");
    expect(resolveEntitlementTier("unpaid", "studio")).toBe("free");
  });
});

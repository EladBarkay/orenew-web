// Single source of truth for the pricing model and the tier ↔ Lemon Squeezy
// variant mapping. The desktop backend owns *tier delivery*; this module owns the
// *commerce-side* mapping between a chosen plan and an LS variant, and back from a
// purchased variant to the tier we must write into `entitlements`.

export type Tier = "free" | "pro" | "studio";
export type PaidTier = "pro" | "studio";
export type Period = "monthly" | "yearly";

export interface PlanPricing {
  monthly: number; // USD per month
  yearly: number; // USD per year
}

export interface Plan {
  tier: Tier;
  /** Device-seat limit. `null` = uncapped (Free). Mirrors backend SEAT_LIMITS. */
  seats: number | null;
  /** Paid plans have pricing; Free does not. */
  pricing?: PlanPricing;
  popular?: boolean;
}

// Concrete pricing from the plan. Keep in sync with the LS product variants.
export const PLANS: Record<Tier, Plan> = {
  free: { tier: "free", seats: null },
  pro: { tier: "pro", seats: 1, popular: true, pricing: { monthly: 15, yearly: 150 } },
  studio: { tier: "studio", seats: 5, pricing: { monthly: 45, yearly: 450 } },
};

export const PAID_TIERS: PaidTier[] = ["pro", "studio"];

/** Effective monthly cost for a period (annual amortized over 12 months). */
export function monthlyEquivalent(p: PlanPricing, period: Period): number {
  return period === "yearly" ? p.yearly / 12 : p.monthly;
}

/** Whole-percent saving of annual vs paying monthly for 12 months. */
export function annualSavingPercent(p: PlanPricing): number {
  const monthlyForYear = p.monthly * 12;
  if (monthlyForYear === 0) return 0;
  return Math.round((1 - p.yearly / monthlyForYear) * 100);
}

/** Env var name holding the LS variant id for a tier+period. */
export function variantEnvKey(tier: PaidTier, period: Period): string {
  const t = tier.toUpperCase();
  const p = period === "yearly" ? "YEARLY" : "MONTHLY";
  return `LEMONSQUEEZY_VARIANT_${t}_${p}`;
}

/**
 * Build the variant-id → { tier, period } lookup from environment. Used by the
 * webhook to resolve a purchased variant back to the tier we must persist.
 * Variants with no configured id are skipped (so tests can run without all four).
 */
export function buildVariantMap(
  env: Record<string, string | undefined> = process.env,
): Map<string, { tier: PaidTier; period: Period }> {
  const map = new Map<string, { tier: PaidTier; period: Period }>();
  for (const tier of PAID_TIERS) {
    for (const period of ["monthly", "yearly"] as Period[]) {
      const id = env[variantEnvKey(tier, period)];
      if (id) map.set(String(id), { tier, period });
    }
  }
  return map;
}

/** Resolve a purchased LS variant id back to its tier+period, or null. */
export function tierForVariant(
  variantId: string | number,
  env: Record<string, string | undefined> = process.env,
): { tier: PaidTier; period: Period } | null {
  return buildVariantMap(env).get(String(variantId)) ?? null;
}

/**
 * Resolve the tier to *display* from an `entitlements` row. Both `/account` and
 * `/pricing` read the same row, so they must resolve it identically — otherwise one
 * page can show Free while the other implies a paid plan. Applies the `expires_at`
 * grace: a row past its expiry reads as Free even if `tier` still says otherwise.
 */
export function effectiveTier(
  ent: { tier?: string | null; expires_at?: string | null } | null | undefined,
  now: Date = new Date(),
): Tier {
  if (!ent?.tier) return "free";
  if (ent.expires_at && new Date(ent.expires_at) < now) return "free";
  return ent.tier as Tier;
}

/** Lemon Squeezy subscription statuses that should grant the paid tier. */
const ACTIVE_STATUSES = new Set(["active", "on_trial", "past_due", "cancelled"]);

/**
 * Decide the tier to persist for a subscription event. A `cancelled` LS
 * subscription still grants access until `current_period_end`; we keep the paid
 * tier and rely on `expires_at` to gate it (matching the desktop's grace model).
 * An `expired`/`unpaid` subscription drops to free.
 */
export function resolveEntitlementTier(
  status: string,
  purchasedTier: PaidTier,
): Tier {
  return ACTIVE_STATUSES.has(status) ? purchasedTier : "free";
}

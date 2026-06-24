// Pricing *logic* and the tier ↔ Lemon Squeezy variant mapping. The plan *data*
// (plans, seats, prices) lives in `config/plans.ts`; this module owns the
// commerce-side mapping between a chosen plan and an LS variant, and back from a
// purchased variant to the tier we must write into `entitlements`.

import { PLANS, PAID_TIERS, type Tier, type PaidTier, type Period, type PlanPricing } from "@/config/plans";

// Re-export the config so existing `@/lib/pricing` imports keep working.
export { PLANS, PAID_TIERS };
export type { Tier, PaidTier, Period, PlanPricing, Plan } from "@/config/plans";

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

// The effective-tier grace (applying expires_at) now lives in the SQL view
// `account_overview` (migration 0002) — pages read its `effective_tier` column.

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

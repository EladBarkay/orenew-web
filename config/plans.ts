// Business config: the pricing model (plans, seats, prices). Separated from the
// logic in `lib/pricing.ts` so the commercial values live in one obvious place,
// not buried among functions. Keep in sync with the LS product variants and the
// desktop backend's SEAT_LIMITS.

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

export const PLANS: Record<Tier, Plan> = {
  free: { tier: "free", seats: null },
  pro: { tier: "pro", seats: 1, popular: true, pricing: { monthly: 15, yearly: 150 } },
  studio: { tier: "studio", seats: 5, pricing: { monthly: 45, yearly: 450 } },
};

export const PAID_TIERS: PaidTier[] = ["pro", "studio"];

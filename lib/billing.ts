// Pure webhook → database-mutation planning. Kept side-effect-free so the mapping
// from a Lemon Squeezy event to the rows we write is unit-testable without a
// database. The route handler executes the returned plan via the service client.

import {
  periodEndDate,
  type LsWebhookEvent,
} from "@/lib/lemonsqueezy";
import {
  resolveEntitlementTier,
  tierForVariant,
  type Tier,
} from "@/lib/pricing";

export interface EntitlementUpdate {
  user_id: string;
  tier: Tier;
  expires_at: string | null;
  updated_at: string;
}

export class WebhookError extends Error {
  constructor(public reason: string) {
    super(reason);
  }
}

const HANDLED_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
]);

export function isHandledEvent(name: string): boolean {
  return HANDLED_EVENTS.has(name);
}

/**
 * Plan the `entitlements` write for a verified subscription event.
 *
 * - Resolves the buyer's Supabase user_id from checkout custom data.
 *   // ponytail: every subscription this store creates carries user_id in custom_data
 *   // (LS persists it across all future events), so no table-based fallback is needed.
 * - Maps the purchased variant → tier; unknown variants are rejected.
 * - `cancelled` keeps the paid tier but sets expires_at = period end (grace);
 *   `expired`/`unpaid` drop to free.
 */
export function planMutation(
  event: LsWebhookEvent,
  opts: {
    env?: Record<string, string | undefined>;
    now?: Date;
  } = {},
): EntitlementUpdate {
  const env = opts.env ?? process.env;
  const now = (opts.now ?? new Date()).toISOString();

  const userId = event.meta.custom_data?.user_id ?? null;
  if (!userId) throw new WebhookError("missing user_id");

  const attrs = event.data.attributes;
  const resolved = tierForVariant(attrs.variant_id, env);
  if (!resolved) throw new WebhookError(`unknown variant ${attrs.variant_id}`);

  const status = attrs.status;
  const effectiveTier = resolveEntitlementTier(status, resolved.tier);
  const expiresAt = periodEndDate(attrs);

  return {
    user_id: userId,
    tier: effectiveTier,
    // Paid-and-active subscriptions don't expire; only cancelled/grace do.
    expires_at: effectiveTier === "free" ? null : status === "cancelled" ? expiresAt : null,
    updated_at: now,
  };
}

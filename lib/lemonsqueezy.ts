// Lemon Squeezy access (server-only). We use the official SDK
// (@lemonsqueezy/lemonsqueezy.js) for the API calls — checkout creation and
// subscription reads — and keep two pure helpers the SDK does not cover:
// `verifyWebhookSignature` (LS ships no webhook-verify helper; you must HMAC the
// raw body yourself) and `periodEndDate` (entitlement-expiry date parsing).

import crypto from "node:crypto";
import {
  createCheckout,
  lemonSqueezySetup,
  listSubscriptions,
  type ListSubscriptions,
} from "@lemonsqueezy/lemonsqueezy.js";

/** A subscription as the SDK returns it in a list (the element of `data`). */
export type LsSubscription = ListSubscriptions["data"][number];

let configured = false;
function setup() {
  if (configured) return;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  lemonSqueezySetup({ apiKey });
  configured = true;
}

function storeId(): string {
  const id = process.env.LEMONSQUEEZY_STORE_ID;
  if (!id) throw new Error("LEMONSQUEEZY_STORE_ID is not set");
  return id;
}

export interface CreateCheckoutArgs {
  variantId: string;
  /** Supabase user id — round-trips back to us in the webhook as custom data. */
  userId: string;
  email: string;
  /** Where LS sends the buyer after a successful purchase. */
  redirectUrl: string;
}

/** Create a hosted checkout and return its URL. */
export async function createCheckoutUrl(args: CreateCheckoutArgs): Promise<string> {
  setup();
  const { data, error } = await createCheckout(storeId(), args.variantId, {
    checkoutData: {
      email: args.email,
      // custom data is echoed back verbatim in webhook meta.custom_data.
      custom: { user_id: args.userId },
    },
    productOptions: {
      redirectUrl: args.redirectUrl,
      // One subscription per buyer per tier — let LS manage the rest in-portal.
      enabledVariants: [Number(args.variantId)],
    },
  });
  if (error) throw new Error(`LS create checkout failed: ${error.message}`);
  const url = data?.data.attributes.url;
  if (!url) throw new Error("LS checkout response missing url");
  return url;
}

/**
 * Most-recent subscription for an email (or null). Source of truth for /account
 * and /portal. LS already returns the list ordered by `created_at` descending.
 */
export async function getLatestSubscriptionByEmail(
  email: string,
): Promise<LsSubscription | null> {
  setup();
  const { data, error } = await listSubscriptions({
    filter: { storeId: storeId(), userEmail: email },
  });
  if (error) return null;
  return data?.data[0] ?? null;
}

/** Every subscription in the store (all statuses), following pagination. For /admin. */
export async function listStoreSubscriptions(): Promise<LsSubscription[]> {
  setup();
  const out: LsSubscription[] = [];
  let page = 1;
  for (;;) {
    const { data, error } = await listSubscriptions({
      filter: { storeId: storeId() },
      page: { number: page, size: 100 },
    });
    if (error) throw new Error(`LS list subscriptions failed: ${error.message}`);
    if (!data) break;
    out.push(...data.data);
    if (page >= data.meta.page.lastPage) break;
    page += 1;
  }
  return out;
}

/**
 * Verify a Lemon Squeezy webhook signature (HMAC-SHA256 of the raw body, hex).
 * Use a constant-time compare. `raw` must be the exact bytes received. The SDK
 * provides no webhook verification, so this stays hand-rolled.
 */
export function verifyWebhookSignature(
  raw: string,
  signature: string | null,
  secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
): boolean {
  if (!secret || !signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(digest, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ── Webhook payload shape (only the fields we consume) ──────────────────────

export interface LsWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: { user_id?: string };
  };
  data: {
    id: string; // subscription id
    attributes: {
      store_id: number;
      customer_id: number;
      variant_id: number;
      status: string; // active | cancelled | expired | past_due | unpaid | on_trial
      user_email?: string;
      renews_at?: string | null;
      ends_at?: string | null;
    };
  };
}

/**
 * Parse the renewal/end date relevant to entitlement expiry, as an ISO date.
 * Accepts any subscription-attributes shape (webhook payload or SDK object).
 */
export function periodEndDate(attrs: {
  ends_at?: string | null;
  renews_at?: string | null;
}): string | null {
  // On cancel LS sets ends_at (period end). While active, renews_at is the next
  // charge date. Prefer ends_at when present so cancellations grant grace.
  const raw = attrs.ends_at ?? attrs.renews_at ?? null;
  if (!raw) return null;
  return raw.slice(0, 10); // entitlements.expires_at is a `date`
}

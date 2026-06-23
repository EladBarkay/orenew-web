// Thin Lemon Squeezy wrapper (server-only). We hit the JSON:API directly rather
// than pull in the SDK, keeping the surface to exactly what we need: create a
// checkout that carries the buyer's Supabase user_id, fetch a subscription's
// hosted customer-portal URL, and verify webhook signatures.

import crypto from "node:crypto";

const API = "https://api.lemonsqueezy.com/v1";

function apiKey(): string {
  const k = process.env.LEMONSQUEEZY_API_KEY;
  if (!k) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  return k;
}

function headers() {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${apiKey()}`,
  };
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
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) throw new Error("LEMONSQUEEZY_STORE_ID is not set");

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email: args.email,
          // custom data is echoed back verbatim in webhook meta.custom_data.
          custom: { user_id: args.userId },
        },
        product_options: {
          redirect_url: args.redirectUrl,
          // One subscription per buyer per tier — let LS manage the rest in-portal.
          enabled_variants: [Number(args.variantId)],
        },
      },
      relationships: {
        store: { data: { type: "stores", id: String(storeId) } },
        variant: { data: { type: "variants", id: String(args.variantId) } },
      },
    },
  };

  const res = await fetch(`${API}/checkouts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`LS create checkout failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  const url = json?.data?.attributes?.url;
  if (!url) throw new Error("LS checkout response missing url");
  return url as string;
}

function storeId(): string {
  const id = process.env.LEMONSQUEEZY_STORE_ID;
  if (!id) throw new Error("LEMONSQUEEZY_STORE_ID is not set");
  return id;
}

/** A subscription as we consume it for display (normalized from the LS object). */
export interface LsSubscription {
  id: string;
  userEmail: string;
  status: string; // active | cancelled | expired | past_due | unpaid | on_trial
  periodEnd: string | null; // ends_at (on cancel) ?? renews_at, as a YYYY-MM-DD date
  createdAt: string; // ISO, used to pick the latest subscription per user
  portalUrl: string | null;
}

interface LsSubscriptionData {
  id: string;
  attributes: {
    user_email?: string;
    status: string;
    renews_at?: string | null;
    ends_at?: string | null;
    created_at?: string;
    urls?: { customer_portal?: string };
  };
}

function normalizeSubscription(d: LsSubscriptionData): LsSubscription {
  const a = d.attributes;
  return {
    id: String(d.id),
    userEmail: a.user_email ?? "",
    status: a.status,
    periodEnd: periodEndDate(a as LsWebhookEvent["data"]["attributes"]),
    createdAt: a.created_at ?? "",
    portalUrl: a.urls?.customer_portal ?? null,
  };
}

/** Most-recent subscription for an email (or null). Source of truth for /account, /portal. */
export async function getLatestSubscriptionByEmail(
  email: string,
): Promise<LsSubscription | null> {
  const params = new URLSearchParams({
    "filter[store_id]": storeId(),
    "filter[user_email]": email,
  });
  const res = await fetch(`${API}/subscriptions?${params}`, { headers: headers() });
  if (!res.ok) return null;
  const json = await res.json();
  const rows: LsSubscriptionData[] = json?.data ?? [];
  if (rows.length === 0) return null;
  return rows
    .map(normalizeSubscription)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

/** Every subscription in the store (all statuses), following pagination. For /admin. */
export async function listStoreSubscriptions(): Promise<LsSubscription[]> {
  const out: LsSubscription[] = [];
  let url: string | null =
    `${API}/subscriptions?${new URLSearchParams({ "filter[store_id]": storeId(), "page[size]": "100" })}`;
  while (url) {
    const res: Response = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error(`LS list subscriptions failed: ${res.status}`);
    const json = await res.json();
    for (const d of (json?.data ?? []) as LsSubscriptionData[]) out.push(normalizeSubscription(d));
    url = json?.links?.next ?? null;
  }
  return out;
}

/**
 * Verify a Lemon Squeezy webhook signature (HMAC-SHA256 of the raw body, hex).
 * Use a constant-time compare. `raw` must be the exact bytes received.
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

/** Parse the renewal/end date relevant to entitlement expiry, as an ISO date. */
export function periodEndDate(attrs: LsWebhookEvent["data"]["attributes"]): string | null {
  // On cancel LS sets ends_at (period end). While active, renews_at is the next
  // charge date. Prefer ends_at when present so cancellations grant grace.
  const raw = attrs.ends_at ?? attrs.renews_at ?? null;
  if (!raw) return null;
  return raw.slice(0, 10); // entitlements.expires_at is a `date`
}

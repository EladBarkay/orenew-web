import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";
import { PAID_TIERS, variantEnvKey, type PaidTier, type Period } from "@/lib/pricing";

export const runtime = "nodejs";

/**
 * POST /api/checkout  { tier: "pro"|"studio", period: "monthly"|"yearly" }
 * Authenticated. Returns { url } — a Lemon Squeezy checkout carrying the buyer's
 * Supabase user_id as custom data so the webhook can tie the purchase back.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tier = body.tier as PaidTier;
  const period = (body.period as Period) ?? "monthly";

  if (!PAID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "invalid tier" }, { status: 400 });
  }
  if (period !== "monthly" && period !== "yearly") {
    return NextResponse.json({ error: "invalid period" }, { status: 400 });
  }

  const variantId = process.env[variantEnvKey(tier, period)];
  if (!variantId) {
    return NextResponse.json(
      { error: `missing variant for ${tier}/${period}` },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  try {
    const url = await createCheckoutUrl({
      variantId,
      userId: user.id,
      email: user.email ?? "",
      redirectUrl: `${siteUrl}/account?checkout=success`,
    });
    return NextResponse.json({ url });
  } catch (e) {
    console.error("checkout error", e);
    return NextResponse.json({ error: "checkout failed" }, { status: 502 });
  }
}

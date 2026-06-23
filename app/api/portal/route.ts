import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLatestSubscriptionByEmail } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

/**
 * GET /api/portal — return the Lemon Squeezy hosted customer-portal URL for the
 * signed-in user's latest subscription (card updates, invoices, cancellation).
 * Sourced live from LS by email; we keep no local subscription table.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const sub = await getLatestSubscriptionByEmail(user.email);
  if (!sub) {
    return NextResponse.json({ error: "no subscription" }, { status: 404 });
  }
  if (!sub.portalUrl) {
    return NextResponse.json({ error: "portal unavailable" }, { status: 502 });
  }
  return NextResponse.json({ url: sub.portalUrl });
}

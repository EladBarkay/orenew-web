import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerPortalUrl } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

/**
 * GET /api/portal — return the Lemon Squeezy hosted customer-portal URL for the
 * signed-in user's active subscription (card updates, invoices, cancellation).
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // RLS lets the user read only their own subscription row.
  const { data } = await supabase
    .from("billing_subscriptions")
    .select("ls_subscription_id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.ls_subscription_id) {
    return NextResponse.json({ error: "no subscription" }, { status: 404 });
  }

  const url = await getCustomerPortalUrl(data.ls_subscription_id);
  if (!url) {
    return NextResponse.json({ error: "portal unavailable" }, { status: 502 });
  }
  return NextResponse.json({ url });
}

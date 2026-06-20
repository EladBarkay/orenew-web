import { NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  type LsWebhookEvent,
} from "@/lib/lemonsqueezy";
import { isHandledEvent, planMutation, WebhookError } from "@/lib/billing";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

/**
 * Lemon Squeezy webhook. Verifies the signature, then upserts the billing mapping
 * and writes tier + expires_at into `entitlements` via the service role — the
 * single server-owned writer of paid tier. Idempotent on ls_subscription_id.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: LsWebhookEvent;
  try {
    event = JSON.parse(raw) as LsWebhookEvent;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventName = event.meta?.event_name;
  if (!isHandledEvent(eventName)) {
    // Acknowledge unhandled events so LS doesn't retry them.
    return NextResponse.json({ ok: true, ignored: eventName });
  }

  const db = createServiceClient();

  // Later events (update/cancel) may omit custom_data; recover user_id from the
  // mapping row we wrote on subscription_created.
  let fallbackUserId: string | null = null;
  if (!event.meta.custom_data?.user_id) {
    const { data } = await db
      .from("billing_subscriptions")
      .select("user_id")
      .eq("ls_subscription_id", String(event.data.id))
      .maybeSingle();
    fallbackUserId = data?.user_id ?? null;
  }

  let plan;
  try {
    plan = planMutation(event, { fallbackUserId });
  } catch (e) {
    if (e instanceof WebhookError) {
      console.error("webhook planning rejected:", e.reason);
      // 200 so LS stops retrying a structurally-bad/unmappable event.
      return NextResponse.json({ ok: false, reason: e.reason });
    }
    throw e;
  }

  const { error: subErr } = await db
    .from("billing_subscriptions")
    .upsert(plan.subscription, { onConflict: "ls_subscription_id" });
  if (subErr) {
    console.error("billing_subscriptions upsert failed:", subErr.message);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  const { error: entErr } = await db
    .from("entitlements")
    .update({
      tier: plan.entitlement.tier,
      expires_at: plan.entitlement.expires_at,
      updated_at: plan.entitlement.updated_at,
    })
    .eq("user_id", plan.entitlement.user_id);
  if (entErr) {
    console.error("entitlements update failed:", entErr.message);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

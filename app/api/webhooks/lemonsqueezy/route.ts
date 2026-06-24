import { NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  type LsWebhookEvent,
} from "@/lib/lemonsqueezy";
import { isHandledEvent, planMutation, WebhookError } from "@/lib/billing";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

/**
 * Lemon Squeezy webhook. Verifies the signature, then writes tier + expires_at into
 * `entitlements` via the service role — the single server-owned writer of paid tier.
 * LS is the source of truth for subscription state; we keep no local mapping table.
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

  let entitlement;
  try {
    entitlement = planMutation(event);
  } catch (e) {
    if (e instanceof WebhookError) {
      console.error("webhook planning rejected:", e.reason);
      // 200 so LS stops retrying a structurally-bad/unmappable event.
      return NextResponse.json({ ok: false, reason: e.reason });
    }
    throw e;
  }

  const { error: entErr } = await db
    .from("entitlements")
    .update({
      tier: entitlement.tier,
      expires_at: entitlement.expires_at,
      updated_at: entitlement.updated_at,
    })
    .eq("user_id", entitlement.user_id);
  if (entErr) {
    console.error("entitlements update failed:", entErr.message);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

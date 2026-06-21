import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/devices/disconnect  { device_hash }
 * Proxies to the existing `disconnect-device` Edge Function using the signed-in
 * user's access token — reusing the desktop's seat-freeing flow unchanged.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const deviceHash = String(body.device_hash ?? "").trim();
  if (!deviceHash) {
    return NextResponse.json({ error: "device_hash required" }, { status: 400 });
  }

  const fnUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/disconnect-device`;
  const res = await fetch(fnUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ device_hash: deviceHash }),
  });

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}

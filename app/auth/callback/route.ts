import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * OAuth / email-confirmation callback. Exchanges the PKCE code for a session
 * cookie, then forwards to the originally requested page (default /account).
 * This is the website's own HTTPS callback — distinct from the desktop app's
 * orenew:// deep link.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirect = url.searchParams.get("redirect") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL(`/sign-in?error=oauth`, url.origin));
    }
  }

  return NextResponse.redirect(new URL(redirect, url.origin));
}

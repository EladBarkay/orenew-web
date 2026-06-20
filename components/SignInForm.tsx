"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CTAButton } from "@/components/CTAButton";
import { dictionary as t } from "@/dictionaries/en";

type Provider = "google" | "facebook";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const supabase = createClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirect);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
          },
        });
        if (error) throw error;
        setInfo(t.auth.checkEmail);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: Provider) {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="space-y-3">
        <button
          onClick={() => oauth("google")}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
        >
          {t.auth.google}
        </button>
        <button
          onClick={() => oauth("facebook")}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1877f2] text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t.auth.facebook}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-neutral-500">
        <span className="h-px flex-1 bg-white/10" />
        {t.auth.or}
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-neutral-300" htmlFor="email">
            {t.auth.email}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-300" htmlFor="password">
            {t.auth.password}
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}
        {info && <p className="text-sm text-emerald-400">{info}</p>}

        <CTAButton type="submit" className="w-full" size="lg" disabled={busy}>
          {busy ? t.auth.working : mode === "signin" ? t.auth.signIn : t.auth.signUp}
        </CTAButton>
      </form>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 w-full text-center text-sm text-neutral-400 hover:text-white"
      >
        {mode === "signin" ? t.auth.toggleToSignUp : t.auth.toggleToSignIn}
      </button>
    </div>
  );
}

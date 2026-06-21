"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CTAButton, CTALink } from "@/components/CTAButton";
import { dictionary as t } from "@/dictionaries/en";

export function ManageBillingButton({ hasSubscription }: { hasSubscription: boolean }) {
  const [busy, setBusy] = useState(false);

  async function openPortal() {
    setBusy(true);
    try {
      const res = await fetch("/api/portal");
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setBusy(false);
      }
    } catch {
      setBusy(false);
    }
  }

  if (!hasSubscription) {
    return (
      <CTALink href="/pricing" variant="primary">
        {t.account.upgrade}
      </CTALink>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <CTAButton onClick={openPortal} disabled={busy}>
        {busy ? t.auth.working : t.account.manageBilling}
      </CTAButton>
      <CTALink href="/pricing" variant="secondary">
        {t.account.changePlan}
      </CTALink>
    </div>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <CTAButton variant="ghost" onClick={signOut}>
      {t.account.signOut}
    </CTAButton>
  );
}

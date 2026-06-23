import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { ManageBillingButton, SignOutButton } from "@/components/AccountActions";
import { createClient } from "@/lib/supabase/server";
import { getLatestSubscriptionByEmail } from "@/lib/lemonsqueezy";
import { formatDate, titleCase } from "@/lib/format";
import { PLANS, effectiveTier } from "@/lib/pricing";
import { dictionary as t } from "@/dictionaries/en";

export const metadata: Metadata = { title: t.account.title };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/account");

  const [{ data: ent }, { count: deviceCount }] = await Promise.all([
    supabase.from("entitlements").select("tier, expires_at, is_admin").eq("user_id", user.id).maybeSingle(),
    supabase.from("entitlement_devices").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  // Subscription status/renewal comes live from LS. If LS is unreachable, degrade to
  // showing just the tier (from entitlements) and hide the renewal line.
  const sub = user.email ? await getLatestSubscriptionByEmail(user.email).catch(() => null) : null;

  const tier = effectiveTier(ent);
  const plan = PLANS[tier];
  const seats = plan.seats;
  const used = deviceCount ?? 0;
  const cancelled = sub?.status === "cancelled";
  const hasSubscription = !!sub && sub.status !== "expired";

  const renewalLine = (() => {
    if (tier === "free") return t.account.noSub;
    if (cancelled && sub?.periodEnd)
      return t.account.cancelsOn.replace("{date}", formatDate(sub.periodEnd));
    if (sub?.periodEnd)
      return t.account.renews.replace("{date}", formatDate(sub.periodEnd));
    return "";
  })();

  const seatsLine =
    seats === null
      ? t.account.seatsUsedUncapped.replace("{used}", String(used))
      : t.account.seatsUsed.replace("{used}", String(used)).replace("{total}", String(seats));

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t.account.title}</h1>
            <p className="mt-1 text-sm text-neutral-400">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        {/* Plan card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                {t.account.currentPlan}
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{titleCase(tier)}</p>
              {renewalLine && <p className="mt-1 text-sm text-neutral-400">{renewalLine}</p>}
            </div>
            <ManageBillingButton hasSubscription={hasSubscription} />
          </div>
        </div>

        {/* Devices card */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-white">{t.account.devicesTitle}</p>
              <p className="mt-1 text-sm text-neutral-400">{seatsLine}</p>
            </div>
            <Link
              href="/account/devices"
              className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/10"
            >
              {t.account.manageDevices}
            </Link>
          </div>
        </div>

        {ent?.is_admin && (
          <div className="mt-5">
            <Link href="/admin" className="text-sm text-accent hover:text-accent-hover">
              {t.admin.title} →
            </Link>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { formatDate, titleCase } from "@/lib/format";
import { dictionary as t } from "@/dictionaries/en";

export const metadata: Metadata = { title: t.admin.title };
export const dynamic = "force-dynamic";

interface CustomerRow {
  userId: string;
  email: string;
  tier: string;
  status: string;
  seats: number;
  renewal: string | null;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/admin");

  // Authorize against the caller's OWN entitlement row (RLS-safe read).
  const { data: me } = await supabase
    .from("entitlements")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!me?.is_admin) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-2xl font-bold text-white">{t.admin.title}</h1>
          <p className="mt-3 text-neutral-400">{t.admin.notAuthorized}</p>
        </section>
      </SiteShell>
    );
  }

  // Admin confirmed — aggregate with the service client (server-only).
  const db = createServiceClient();
  const [{ data: ents }, { data: subs }, { data: devices }, usersRes] = await Promise.all([
    db.from("entitlements").select("user_id, tier, expires_at"),
    db.from("billing_subscriptions").select("user_id, status, current_period_end, updated_at"),
    db.from("entitlement_devices").select("user_id"),
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const emailById = new Map<string, string>();
  for (const u of usersRes.data?.users ?? []) emailById.set(u.id, u.email ?? "—");

  const seatById = new Map<string, number>();
  for (const d of devices ?? []) seatById.set(d.user_id, (seatById.get(d.user_id) ?? 0) + 1);

  // Latest subscription per user.
  const subById = new Map<string, { status: string; current_period_end: string | null }>();
  for (const s of subs ?? []) {
    const prev = subById.get(s.user_id);
    if (!prev) subById.set(s.user_id, { status: s.status, current_period_end: s.current_period_end });
  }

  const rows: CustomerRow[] = (ents ?? [])
    .map((e) => {
      const sub = subById.get(e.user_id);
      return {
        userId: e.user_id,
        email: emailById.get(e.user_id) ?? "—",
        tier: e.tier,
        status: sub?.status ?? (e.tier === "free" ? "free" : "active"),
        seats: seatById.get(e.user_id) ?? 0,
        renewal: sub?.current_period_end ?? e.expires_at ?? null,
      };
    })
    .sort((a, b) => {
      const rank = (x: string) => (x === "studio" ? 0 : x === "pro" ? 1 : 2);
      return rank(a.tier) - rank(b.tier) || a.email.localeCompare(b.email);
    });

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t.admin.title}</h1>
        <p className="mt-1 text-sm text-neutral-400">{t.admin.subtitle}</p>
        <p className="mt-1 text-xs text-neutral-500">
          {t.admin.totalCustomers.replace("{count}", String(rows.length))}
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-start text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 text-start font-medium">{t.admin.colEmail}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colTier}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colStatus}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colSeats}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colRenewal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                    {t.admin.noCustomers}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.userId} className="text-neutral-200 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">
                      <TierBadge tier={r.tier} />
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{titleCase(r.status)}</td>
                    <td className="px-4 py-3 text-neutral-400">{r.seats}</td>
                    <td className="px-4 py-3 text-neutral-400">{formatDate(r.renewal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </SiteShell>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const styles: Record<string, string> = {
    studio: "bg-accent/20 text-accent ring-accent/30",
    pro: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    free: "bg-white/5 text-neutral-400 ring-white/15",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[tier] ?? styles.free}`}
    >
      {titleCase(tier)}
    </span>
  );
}

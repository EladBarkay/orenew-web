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
  subscriptions: number;
  renewal: string | null;
}

const PAGE_SIZE = 50;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
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

  // Admin confirmed. The joins, seat/subscription counts, latest subscription, email,
  // and sort key are all done by the public.admin_customers SQL view, so we fetch one
  // ordered page plus the total count in a single round trip (service client,
  // server-only — the view is revoked from anon/authenticated).
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);
  const fromRow = (page - 1) * PAGE_SIZE;

  const db = createServiceClient();
  const { data, count } = await db
    .from("admin_customers")
    .select("user_id, email, tier, status, seats, subscriptions, renewal", { count: "exact" })
    .order("tier_rank")
    .order("email")
    .range(fromRow, fromRow + PAGE_SIZE - 1);

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows: CustomerRow[] = (data ?? []).map((r) => ({
    userId: r.user_id,
    email: r.email ?? "—",
    tier: r.tier,
    status: r.status,
    seats: r.seats,
    subscriptions: r.subscriptions,
    renewal: r.renewal,
  }));

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t.admin.title}</h1>
        <p className="mt-1 text-sm text-neutral-400">{t.admin.subtitle}</p>
        <p className="mt-1 text-xs text-neutral-500">
          {t.admin.totalCustomers.replace("{count}", String(total))}
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-start text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 text-start font-medium">{t.admin.colEmail}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colTier}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colStatus}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colSeats}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colSubs}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.colRenewal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
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
                    <td className={`px-4 py-3 ${r.subscriptions > 1 ? "font-semibold text-amber-400" : "text-neutral-400"}`}>
                      {r.subscriptions}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{formatDate(r.renewal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
            <span>
              {t.admin.pageOf
                .replace("{page}", String(page))
                .replace("{pages}", String(pageCount))}
            </span>
            <div className="flex gap-2">
              <PageLink page={page - 1} disabled={page <= 1} label={t.admin.prev} />
              <PageLink page={page + 1} disabled={page >= pageCount} label={t.admin.next} />
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function PageLink({ page, disabled, label }: { page: number; disabled: boolean; label: string }) {
  if (disabled) {
    return (
      <span className="rounded-md border border-white/10 px-3 py-1.5 text-neutral-600">
        {label}
      </span>
    );
  }
  return (
    <a
      href={`/admin?page=${page}`}
      className="rounded-md border border-white/15 px-3 py-1.5 text-neutral-200 hover:bg-white/[0.04]"
    >
      {label}
    </a>
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

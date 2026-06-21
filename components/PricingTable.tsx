"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { CTAButton, CTALink } from "@/components/CTAButton";
import { BillingToggle } from "@/components/BillingToggle";
import { dictionary as t } from "@/dictionaries/en";
import {
  PLANS,
  monthlyEquivalent,
  type Period,
  type Tier,
  type PaidTier,
} from "@/lib/pricing";

const ORDER: Tier[] = ["free", "pro", "studio"];

function seatLabel(seats: number | null): string {
  if (seats === null) return t.pricing.seatsUncapped;
  if (seats === 1) return t.pricing.seatsOne;
  return t.pricing.seatsOther.replace("{count}", String(seats));
}

export function PricingTable({ currentTier }: { currentTier?: Tier }) {
  const [period, setPeriod] = useState<Period>("yearly");
  const [busy, setBusy] = useState<Tier | null>(null);
  const router = useRouter();

  async function buy(tier: PaidTier) {
    setBusy(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, period }),
      });
      if (res.status === 401) {
        router.push(`/sign-in?redirect=/pricing`);
        return;
      }
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setBusy(null);
      }
    } catch {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <BillingToggle period={period} onChange={setPeriod} />
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
        {ORDER.map((tier) => {
          const plan = PLANS[tier];
          const copy = t.pricing.tiers[tier];
          const isCurrent = currentTier === tier;
          const featured = plan.popular;

          return (
            <div
              key={tier}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6",
                isCurrent
                  ? "border-emerald-400/70 bg-emerald-400/[0.06] ring-1 ring-emerald-400/40"
                  : featured
                    ? "border-accent/60 bg-accent/[0.06] shadow-glow"
                    : "border-white/10 bg-white/[0.02]",
              )}
            >
              {isCurrent ? (
                <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-emerald-950">
                  {t.pricing.yourPlan}
                </span>
              ) : (
                featured && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg">
                    {t.pricing.mostPopular}
                  </span>
                )
              )}

              <h3 className="text-lg font-semibold text-white">{copy.name}</h3>
              <p className="mt-1 min-h-10 text-sm text-neutral-400">{copy.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1">
                {plan.pricing ? (
                  <>
                    <span className="text-4xl font-bold tracking-tight text-white">
                      ${Math.round(monthlyEquivalent(plan.pricing, period))}
                    </span>
                    <span className="text-sm text-neutral-400">{t.pricing.perMonth}</span>
                  </>
                ) : (
                  <span className="text-4xl font-bold tracking-tight text-white">$0</span>
                )}
              </div>
              <div className="mt-1 h-4 text-xs text-neutral-500">
                {plan.pricing && period === "yearly"
                  ? `$${plan.pricing.yearly} ${t.pricing.billedYearly}`
                  : ""}
              </div>

              <div className="mt-5">
                {tier === "free" ? (
                  <CTALink href="/download" variant="secondary" className="w-full">
                    {copy.cta}
                  </CTALink>
                ) : isCurrent ? (
                  <CTAButton variant="secondary" className="w-full" disabled>
                    {t.pricing.current}
                  </CTAButton>
                ) : (
                  <CTAButton
                    variant={featured ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => buy(tier as PaidTier)}
                    disabled={busy === tier}
                  >
                    {busy === tier ? t.auth.working : copy.cta}
                  </CTAButton>
                )}
              </div>

              <p className="mt-4 text-sm font-medium text-neutral-300">{seatLabel(plan.seats)}</p>
              <ul className="mt-3 space-y-2.5">
                {copy.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                    <Check />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 flex-none text-accent"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

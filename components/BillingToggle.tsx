"use client";

import { cn } from "@/lib/cn";
import { dictionary as t } from "@/dictionaries/en";
import type { Period } from "@/lib/pricing";

export function BillingToggle({
  period,
  onChange,
}: {
  period: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        {(["monthly", "yearly"] as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={period === p}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              period === p ? "bg-accent text-accent-fg" : "text-neutral-300 hover:text-white",
            )}
          >
            {p === "monthly" ? t.pricing.monthly : t.pricing.yearly}
          </button>
        ))}
      </div>
      <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
        {t.pricing.yearlyBadge}
      </span>
    </div>
  );
}

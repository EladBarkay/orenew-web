import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PricingTable } from "@/components/PricingTable";
import { FAQ } from "@/components/FAQ";
import { createClient } from "@/lib/supabase/server";
import { dictionary as t } from "@/dictionaries/en";
import { type Tier } from "@/lib/pricing";

export const metadata: Metadata = { title: t.nav.pricing };

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentTier: Tier | undefined;
  if (user) {
    const { data } = await supabase
      .from("account_overview")
      .select("effective_tier")
      .eq("user_id", user.id)
      .maybeSingle();
    currentTier = (data?.effective_tier ?? "free") as Tier;
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {t.pricing.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-400">{t.pricing.subtitle}</p>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <PricingTable currentTier={currentTier} />
      </section>
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-white">
            {t.faq.title}
          </h2>
          <FAQ />
        </div>
      </section>
    </SiteShell>
  );
}

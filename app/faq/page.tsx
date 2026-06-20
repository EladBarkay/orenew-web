import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { FAQ } from "@/components/FAQ";
import { dictionary as t } from "@/dictionaries/en";

export const metadata: Metadata = { title: t.nav.faq };

export default function FaqPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{t.faq.title}</h1>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <FAQ />
      </section>
    </SiteShell>
  );
}

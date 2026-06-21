import { SiteShell } from "@/components/SiteShell";
import { CTALink } from "@/components/CTAButton";
import { FeatureCard } from "@/components/FeatureCard";
import { Screenshot } from "@/components/Screenshot";
import { GalleryMockup, LightboxMockup, ExportMockup } from "@/components/AppMockup";
import { BeforeAfter } from "@/components/BeforeAfter";
import { PricingTable } from "@/components/PricingTable";
import { FAQ } from "@/components/FAQ";
import { dictionary as t } from "@/dictionaries/en";

export default function HomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-aurora absolute inset-0 -z-10" />
        <div className="bg-grid absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-5 pt-20 pb-16 text-center sm:pt-28">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
            {t.hero.eyebrow}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-neutral-300">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTALink href="/download" size="lg">
              {t.hero.ctaPrimary}
            </CTALink>
            <CTALink href="/pricing" variant="secondary" size="lg">
              {t.hero.ctaSecondary}
            </CTALink>
          </div>
          <p className="mt-4 text-sm text-neutral-500">{t.hero.note}</p>

          <div className="mx-auto mt-16 max-w-5xl">
            <Screenshot title="Orenew — Spring Gala 2026">
              <GalleryMockup />
            </Screenshot>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.features.title}
          </h2>
          <p className="mt-4 text-neutral-400">{t.features.subtitle}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((f) => (
            <FeatureCard key={f.title} title={f.title} body={f.body} icon={f.icon} />
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="border-y border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.showcase.title}
            </h2>
            <p className="mt-4 text-neutral-400">{t.showcase.subtitle}</p>
          </div>
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-2">
            <Screenshot title={t.showcase.lightbox} className="lg:col-span-2">
              <LightboxMockup />
            </Screenshot>
            <Screenshot title={t.showcase.export} className="lg:col-span-2">
              <ExportMockup />
            </Screenshot>
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.beforeAfter.title}
          </h2>
          <p className="mt-4 text-neutral-400">{t.beforeAfter.subtitle}</p>
        </div>
        <div className="mt-10">
          <BeforeAfter />
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.pricing.title}
            </h2>
            <p className="mt-4 text-neutral-400">{t.pricing.subtitle}</p>
          </div>
          <div className="mt-12">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.faq.title}
            </h2>
          </div>
          <div className="mt-10">
            <FAQ />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

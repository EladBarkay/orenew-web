import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { DownloadClient, type ReleaseAsset } from "@/components/DownloadClient";
import { dictionary as t } from "@/dictionaries/en";

export const metadata: Metadata = { title: t.nav.download };

// Re-fetch releases at most hourly; downloads don't change often.
export const revalidate = 3600;

const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "EladBarkay/orenew";

async function getReleaseAssets(): Promise<ReleaseAsset[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.assets ?? []).map((a: ReleaseAsset) => ({
      name: a.name,
      browser_download_url: a.browser_download_url,
    }));
  } catch {
    return [];
  }
}

export default async function DownloadPage() {
  const assets = await getReleaseAssets();
  const releasesUrl = `https://github.com/${REPO}/releases`;

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {t.download.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-400">{t.download.subtitle}</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <DownloadClient assets={assets} releasesUrl={releasesUrl} />
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-24">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-base font-semibold text-white">{t.download.requirementsTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-400">
            {t.download.requirements.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-2 h-1 w-1 flex-none rounded-full bg-accent" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}

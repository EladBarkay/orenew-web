"use client";

import { useEffect, useState } from "react";
import { CTALink } from "@/components/CTAButton";
import { detectOS, pickAssetUrl, type OS } from "@/lib/os-detect";
import { dictionary as t } from "@/dictionaries/en";

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

const OS_LABEL: Record<OS, string> = {
  windows: t.download.os.windows,
  macos: t.download.os.macos,
  linux: t.download.os.linux,
  unknown: t.download.os.unknown,
};

export function DownloadClient({
  assets,
  releasesUrl,
}: {
  assets: ReleaseAsset[];
  releasesUrl: string;
}) {
  const [os, setOS] = useState<OS>("unknown");

  useEffect(() => {
    setOS(detectOS(navigator.userAgent));
  }, []);

  const primaryUrl = pickAssetUrl(os, assets) ?? releasesUrl;
  const detected = os !== "unknown";

  const platforms: OS[] = ["windows", "macos", "linux"];

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center text-sm text-neutral-400">
        {detected
          ? t.download.detected.replace("{os}", OS_LABEL[os])
          : t.download.detectFailed}
      </p>

      {detected && (
        <div className="mt-5 flex justify-center">
          <CTALink href={primaryUrl} size="lg" className="min-w-64">
            {t.download.primaryFor.replace("{os}", OS_LABEL[os])}
          </CTALink>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {platforms.map((p) => {
          const url = pickAssetUrl(p, assets) ?? releasesUrl;
          return (
            <CTALink
              key={p}
              href={url}
              variant={p === os ? "primary" : "secondary"}
              className="w-full"
            >
              {OS_LABEL[p]}
            </CTALink>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <a
          href={releasesUrl}
          className="text-sm text-accent hover:text-accent-hover"
          target="_blank"
          rel="noreferrer"
        >
          {t.download.allReleases} →
        </a>
      </div>
    </div>
  );
}

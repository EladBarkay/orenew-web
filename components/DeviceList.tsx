"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CTAButton } from "@/components/CTAButton";
import { formatDate } from "@/lib/format";
import { dictionary as t } from "@/dictionaries/en";

export interface Device {
  device_hash: string;
  device_label: string;
  last_seen: string;
}

export function DeviceList({ devices }: { devices: Device[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function disconnect(hash: string) {
    setBusy(hash);
    setError(null);
    try {
      const res = await fetch("/api/devices/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_hash: hash }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? t.common.error);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.error);
    } finally {
      setBusy(null);
    }
  }

  if (devices.length === 0) {
    return <p className="text-sm text-neutral-400">{t.account.noDevices}</p>;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-400">{t.account.devicesSubtitle}</p>
      {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}
      <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
        {devices.map((d) => (
          <li key={d.device_hash} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {d.device_label || d.device_hash.slice(0, 12)}
              </p>
              <p className="text-xs text-neutral-500">
                {t.account.lastSeen.replace("{date}", formatDate(d.last_seen))}
              </p>
            </div>
            <CTAButton
              variant="secondary"
              onClick={() => disconnect(d.device_hash)}
              disabled={busy === d.device_hash}
            >
              {busy === d.device_hash ? t.account.disconnecting : t.account.disconnect}
            </CTAButton>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-neutral-500">{t.account.thisCannotBeUndone}</p>
    </div>
  );
}

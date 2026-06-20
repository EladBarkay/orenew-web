import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { DeviceList, type Device } from "@/components/DeviceList";
import { createClient } from "@/lib/supabase/server";
import { dictionary as t } from "@/dictionaries/en";

export const metadata: Metadata = { title: t.account.devicesTitle };

export default async function DevicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/account/devices");

  const { data } = await supabase
    .from("entitlement_devices")
    .select("device_hash, device_label, last_seen")
    .eq("user_id", user.id)
    .order("last_seen", { ascending: false });

  const devices = (data ?? []) as Device[];

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <Link href="/account" className="text-sm text-neutral-400 hover:text-white">
          ← {t.account.back}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
          {t.account.devicesTitle}
        </h1>
        <div className="mt-8">
          <DeviceList devices={devices} />
        </div>
      </section>
    </SiteShell>
  );
}

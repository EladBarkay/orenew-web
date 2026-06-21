import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { LegalContent } from "@/components/LegalContent";
import { dictionary as t } from "@/dictionaries/en";

export const metadata: Metadata = { title: t.legal.privacy.title };

export default function PrivacyPage() {
  return (
    <SiteShell>
      <LegalContent {...t.legal.privacy} />
    </SiteShell>
  );
}

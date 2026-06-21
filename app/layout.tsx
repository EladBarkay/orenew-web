import type { Metadata } from "next";
import "./globals.css";
import { dictionary as t } from "@/dictionaries/en";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${t.brand.name} — ${t.brand.tagline}`,
    template: `%s · ${t.brand.name}`,
  },
  description: t.hero.subtitle,
  applicationName: t.brand.name,
  icons: { icon: "/orenew.svg" },
  openGraph: {
    type: "website",
    title: `${t.brand.name} — ${t.brand.tagline}`,
    description: t.hero.subtitle,
    siteName: t.brand.name,
    images: [{ url: "/orenew-detailed.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${t.brand.name} — ${t.brand.tagline}`,
    description: t.hero.subtitle,
    images: ["/orenew-detailed.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

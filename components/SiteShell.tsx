import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IconSprite } from "@/components/IconSprite";

/** Standard page chrome: sticky header + footer around the page body. */
export async function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <IconSprite />
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}

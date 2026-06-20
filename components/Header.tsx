import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CTALink } from "@/components/CTAButton";
import { createClient } from "@/lib/supabase/server";
import { dictionary as t } from "@/dictionaries/en";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const links = [
    { href: "/#features", label: t.nav.features },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/download", label: t.nav.download },
    { href: "/faq", label: t.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-base/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <CTALink href="/account" variant="secondary">
              {t.nav.account}
            </CTALink>
          ) : (
            <CTALink href="/sign-in" variant="ghost">
              {t.nav.signIn}
            </CTALink>
          )}
          <CTALink href="/download" variant="primary" className="hidden sm:inline-flex">
            {t.hero.ctaPrimary}
          </CTALink>
        </div>
      </div>
    </header>
  );
}

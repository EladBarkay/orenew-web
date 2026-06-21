import Link from "next/link";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { dictionary as t } from "@/dictionaries/en";

export async function Footer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cols = [
    {
      title: t.footer.product,
      links: [
        { href: "/#features", label: t.nav.features },
        { href: "/pricing", label: t.nav.pricing },
        { href: "/download", label: t.nav.download },
        { href: "/faq", label: t.nav.faq },
      ],
    },
    {
      title: t.footer.company,
      // Signed-in users reach their account via the account link; only show the
      // sign-in entry to signed-out visitors.
      links: user
        ? [{ href: "/account", label: t.nav.account }]
        : [
            { href: "/account", label: t.nav.account },
            { href: "/sign-in", label: t.nav.signIn },
          ],
    },
    {
      title: t.footer.legal,
      links: [
        { href: "/privacy", label: t.footer.privacy },
        { href: "/terms", label: t.footer.terms },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-base">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-neutral-400">{t.footer.blurb}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold text-white">{c.title}</h3>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} {t.brand.name}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}

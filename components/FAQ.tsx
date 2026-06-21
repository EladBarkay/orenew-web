import { dictionary as t } from "@/dictionaries/en";

export function FAQ({ items = t.faq.items }: { items?: typeof t.faq.items }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/10">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start">
            <span className="text-base font-medium text-white">{item.q}</span>
            <span className="flex-none text-neutral-400 transition-transform group-open:rotate-45">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 pe-8 text-sm leading-relaxed text-neutral-400">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

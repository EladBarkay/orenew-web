// Renders a legal document (privacy / terms) from a dictionary entry. Shared by both
// legal pages so their layout stays identical.
type Section = { heading: string; body: string | readonly string[] };

export function LegalContent({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: readonly Section[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{lastUpdated}</p>
      <p className="mt-6 text-neutral-300">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-semibold text-white">{s.heading}</h2>
            {Array.isArray(s.body) ? (
              <ul className="mt-2 space-y-2 text-neutral-400">
                {s.body.map((p) => (
                  <li key={p} className="leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 leading-relaxed text-neutral-400">{s.body as string}</p>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}

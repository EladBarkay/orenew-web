export function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40 hover:bg-white/[0.04]">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
        <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{body}</p>
    </div>
  );
}

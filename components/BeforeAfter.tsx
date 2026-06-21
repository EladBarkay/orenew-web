import { dictionary as t } from "@/dictionaries/en";

/**
 * Static side-by-side before/after. (A draggable slider can replace this later;
 * static keeps it server-rendered and dependency-free.) Uses CSS art until a real
 * source/framed photo pair is supplied.
 */
export function BeforeAfter() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <figure className="overflow-hidden rounded-xl border border-white/10">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-200/30 to-rose-300/20">
          <span className="absolute start-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
            {t.beforeAfter.before}
          </span>
        </div>
      </figure>
      <figure className="overflow-hidden rounded-xl border border-accent/40 ring-1 ring-accent/30">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-200/30 to-rose-300/20">
          <div className="absolute inset-[6%] rounded border-[6px] border-white shadow-inner" />
          <span className="absolute start-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-fg">
            {t.beforeAfter.after}
          </span>
        </div>
      </figure>
    </div>
  );
}

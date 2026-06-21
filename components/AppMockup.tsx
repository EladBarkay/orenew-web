import { cn } from "@/lib/cn";

// CSS stand-ins for the desktop app, used until real screenshots are dropped in.
// They mirror the actual layout described in the orenew repo: a toolbar, batch
// tabs, a virtualized gallery grid, and a sticky action bar.

const PHOTO_TONES = [
  "from-amber-200/30 to-rose-300/20",
  "from-sky-200/30 to-indigo-300/20",
  "from-emerald-200/30 to-teal-300/20",
  "from-fuchsia-200/30 to-violet-300/20",
  "from-orange-200/30 to-amber-300/20",
  "from-cyan-200/30 to-blue-300/20",
];

function PhotoTile({ i, framed = true }: { i: number; framed?: boolean }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-800">
      <div className={cn("absolute inset-0 bg-gradient-to-br", PHOTO_TONES[i % PHOTO_TONES.length])} />
      {framed && <div className="absolute inset-[6%] rounded-sm border-2 border-white/60" />}
      <div className="absolute bottom-1 end-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">
        ×{(i % 3) + 1}
      </div>
    </div>
  );
}

export function GalleryMockup() {
  return (
    <div className="flex flex-col">
      {/* batch tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 px-3 py-2">
        <div className="rounded-md bg-accent/20 px-3 py-1 text-[10px] font-medium text-accent">Card 1</div>
        <div className="rounded-md px-3 py-1 text-[10px] text-neutral-400">Card 2</div>
        <div className="rounded-md px-3 py-1 text-[10px] text-neutral-400">Card 3</div>
        <div className="ms-auto h-2 w-16 rounded-full bg-white/10" />
      </div>
      {/* gallery grid */}
      <div className="grid grid-cols-4 gap-2.5 p-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <PhotoTile key={i} i={i} />
        ))}
      </div>
      {/* action bar */}
      <div className="flex items-center justify-between border-t border-white/10 px-3 py-2.5">
        <div className="text-[10px] text-neutral-400">18 queued · 6 photos</div>
        <div className="rounded-md bg-accent px-3 py-1.5 text-[10px] font-semibold text-accent-fg">Export</div>
      </div>
    </div>
  );
}

export function LightboxMockup() {
  return (
    <div className="flex gap-3 p-4">
      <div className="relative flex-1 overflow-hidden rounded-md bg-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 to-rose-300/20" />
        <div className="absolute inset-[8%] rounded border-[3px] border-white/70" />
      </div>
      <div className="w-28 space-y-2">
        <div className="h-2 w-20 rounded-full bg-white/15" />
        <div className="rounded-md border border-white/10 p-2">
          <div className="mb-1 h-1.5 w-12 rounded-full bg-white/10" />
          <div className="flex items-center justify-between">
            <div className="h-5 w-5 rounded bg-white/10" />
            <div className="text-[11px] font-semibold text-white">2</div>
            <div className="h-5 w-5 rounded bg-accent/40" />
          </div>
        </div>
        <div className="h-7 rounded-md bg-accent/20" />
        <div className="h-7 rounded-md bg-white/5" />
      </div>
    </div>
  );
}

export function ExportMockup() {
  return (
    <div className="p-4">
      <div className="mb-3 h-2 w-24 rounded-full bg-white/15" />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-accent/50 bg-accent/10 p-3">
          <div className="mb-2 h-1.5 w-16 rounded-full bg-accent/50" />
          <div className="h-12 rounded bg-white/5" />
        </div>
        <div className="rounded-md border border-white/10 p-3">
          <div className="mb-2 h-1.5 w-16 rounded-full bg-white/10" />
          <div className="h-12 rounded bg-white/5" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md border border-white/10 p-3">
        <div className="space-y-1">
          <div className="h-1.5 w-20 rounded-full bg-white/10" />
          <div className="h-1.5 w-28 rounded-full bg-white/5" />
        </div>
        <div className="rounded-md bg-accent px-3 py-1.5 text-[10px] font-semibold text-accent-fg">Save</div>
      </div>
    </div>
  );
}

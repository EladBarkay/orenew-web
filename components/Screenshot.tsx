import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A macOS-style window chrome wrapper around marketing visuals. Pass real desktop
 * screenshots as children when they're available; until then the AppMockup
 * components render a faithful CSS stand-in. Keeps a single "app window" frame so
 * the whole site stays visually consistent.
 */
export function Screenshot({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl ring-1 ring-black/40",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-2 border-b border-white/10 bg-neutral-850 px-4">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        {title && (
          <span className="ms-2 truncate text-xs font-medium text-neutral-400">{title}</span>
        )}
      </div>
      <div className="bg-neutral-950">{children}</div>
    </div>
  );
}

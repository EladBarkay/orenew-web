// Per-feature line icons (Feather/Lucide, MIT), inlined so there's no icon-library
// dependency. Stroke-based, currentColor, 24px grid — matches the site's existing
// icon style and recolors with the accent chip in FeatureCard.
import type { ReactNode } from "react";

export type FeatureIconName =
  | "orientation"
  | "copies"
  | "remembered"
  | "batches"
  | "fast"
  | "watch";

const PATHS: Record<FeatureIconName, ReactNode> = {
  // scan frame — automatic detection
  orientation: (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="8" width="10" height="8" rx="1" />
    </>
  ),
  // stacked copies, not duplicate files
  copies: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  // clipboard-check — remembers what was exported
  remembered: (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  // layers — many batches at once
  batches: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
  // zap — fast exports
  fast: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  // eye — real-time watching
  watch: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

export function FeatureIcon({ name, className }: { name: FeatureIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}

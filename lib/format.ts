/** Format an ISO date (or date-only) string as a friendly date, or em-dash. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

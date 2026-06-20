// OS detection for the Download page. Kept pure (takes a UA string) so it is
// trivially unit-testable and can run on the server (from request headers) or the
// client (navigator.userAgent).

export type OS = "windows" | "macos" | "linux" | "unknown";

export function detectOS(userAgent: string | null | undefined): OS {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows") || ua.includes("win64") || ua.includes("win32")) {
    return "windows";
  }
  // iOS/iPadOS report "mac" too, but Orenew is desktop-only; treat any Apple as macOS.
  if (ua.includes("macintosh") || ua.includes("mac os x") || ua.includes("iphone") || ua.includes("ipad")) {
    return "macos";
  }
  if (ua.includes("linux") || ua.includes("x11")) return "linux";
  return "unknown";
}

/** Substring matched against a GitHub release asset name for the given OS. */
const ASSET_HINTS: Record<Exclude<OS, "unknown">, string[]> = {
  windows: [".msi", ".exe", "windows", "win"],
  macos: [".dmg", ".app.tar.gz", "darwin", "macos", "mac", "universal"],
  linux: [".appimage", ".deb", ".rpm", "linux"],
};

/** Pick the best-matching asset download URL for an OS from a release's assets. */
export function pickAssetUrl(
  os: OS,
  assets: { name: string; browser_download_url: string }[],
): string | null {
  if (os === "unknown" || assets.length === 0) return null;
  const hints = ASSET_HINTS[os];
  for (const hint of hints) {
    const match = assets.find((a) => a.name.toLowerCase().includes(hint));
    if (match) return match.browser_download_url;
  }
  return null;
}

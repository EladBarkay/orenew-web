import { describe, it, expect } from "vitest";
import { detectOS, pickAssetUrl } from "@/lib/os-detect";

describe("detectOS", () => {
  it("detects Windows", () => {
    expect(detectOS("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("windows");
  });
  it("detects macOS", () => {
    expect(detectOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("macos");
  });
  it("detects Linux", () => {
    expect(detectOS("Mozilla/5.0 (X11; Linux x86_64)")).toBe("linux");
  });
  it("falls back to unknown", () => {
    expect(detectOS("")).toBe("unknown");
    expect(detectOS(null)).toBe("unknown");
    expect(detectOS("SomeBot/1.0")).toBe("unknown");
  });
});

describe("pickAssetUrl", () => {
  const assets = [
    { name: "Orenew_0.1.0_x64.msi", browser_download_url: "https://x/win.msi" },
    { name: "Orenew_0.1.0_universal.dmg", browser_download_url: "https://x/mac.dmg" },
    { name: "orenew_0.1.0_amd64.AppImage", browser_download_url: "https://x/linux.AppImage" },
  ];

  it("picks the right asset per OS", () => {
    expect(pickAssetUrl("windows", assets)).toBe("https://x/win.msi");
    expect(pickAssetUrl("macos", assets)).toBe("https://x/mac.dmg");
    expect(pickAssetUrl("linux", assets)).toBe("https://x/linux.AppImage");
  });

  it("returns null when nothing matches or OS is unknown", () => {
    expect(pickAssetUrl("unknown", assets)).toBeNull();
    expect(pickAssetUrl("windows", [])).toBeNull();
    expect(pickAssetUrl("linux", [assets[0]])).toBeNull();
  });
});

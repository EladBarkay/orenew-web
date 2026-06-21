# Automating Orenew product screenshots

The marketing site currently leans on CSS-art mockups and a redundant demo video.
Hand-grabbed screenshots don't scale: the UI drifts, window chrome and DPI vary shot
to shot, and every release needs a fresh manual pass. This doc recommends a method to
produce **consistent, repeatable, release-able screenshots automatically** so the site
looks and feels professional without a human re-shooting by hand.

> Scope note: the Orenew **desktop app lives in a separate repo**. The capture harness
> belongs there (it needs the app build). This doc is the spec for building it; the
> output (optimized images) gets committed into this site repo under `public/shots/`.

## Recommended method: Playwright driving the Electron build

The desktop app is an Electron app, and Playwright can launch and drive Electron
directly via `_electron.launch()`. This gives a real, running app — real fonts, real
rendering — captured deterministically, with no manual window wrangling.

Why this over the alternatives:

- **vs. manual screenshots** — deterministic window size + device scale factor, no
  stray cursor/chrome, re-runnable on every release in CI.
- **vs. OS-level scripting** (e.g. `screencapture`, `scrot`, AutoHotkey) — cross-
  platform, no fighting window managers, and you address UI by selector instead of
  pixel coordinates. Keep OS scripting only as a fallback (see below).
- **vs. rebuilding the UI as web mockups** — what you ship is the *actual* product, so
  shots never lie or go stale relative to the app.

### The pieces

1. **A seeded demo dataset.** Commit a small, fixed set of royalty-free / consented
   demo photos to the desktop repo (e.g. `fixtures/demo-event/`) — a deliberate mix of
   landscape + portrait, varied face counts (to show the copy-suggestion feature), and
   a sample frame PNG. Determinism starts with fixed input: the same photos every run
   means the same gallery, the same previews, the same export dialog.

2. **A demo launch mode.** Add a flag/env the app honors, e.g.
   `ORENEW_DEMO=1` / `--demo-dataset <path>`, that boots straight into the seeded
   event with a clean, signed-in-looking (Pro, no watermark) state. This removes
   onboarding, empty states, and auth from the captures.

3. **The Playwright capture script** (`screenshots/capture.ts` in the desktop repo):

   ```ts
   import { _electron as electron } from "playwright";

   const VIEWPORT = { width: 1440, height: 900 };
   const SCALE = 2; // retina-crisp output

   const app = await electron.launch({
     args: ["."],
     env: { ...process.env, ORENEW_DEMO: "1" },
   });
   const page = await app.firstWindow();
   await page.setViewportSize(VIEWPORT);

   // One entry per marketing shot. Drive the real UI to each state, then capture.
   const shots = [
     { name: "gallery",     setup: async () => { /* open seeded event */ } },
     { name: "lightbox",    setup: async () => { await page.click("[data-testid=photo-0]"); } },
     { name: "orientation", setup: async () => { /* show auto L/P split + override */ } },
     { name: "copies",      setup: async () => { /* show per-photo copies + face suggestion */ } },
     { name: "batches",     setup: async () => { /* show multiple events open */ } },
     { name: "export",      setup: async () => { await page.click("[data-testid=export]"); } },
   ];

   for (const s of shots) {
     await s.setup();
     await page.waitForTimeout(150); // let animations settle
     await page.screenshot({ path: `out/${s.name}@2x.png` });
   }
   await app.close();
   ```

   Add stable `data-testid` hooks in the app for anything the script clicks — selectors
   are the contract that keeps captures working as the UI evolves.

4. **Post-process + commit.** Downscale/optimize to web (`sharp` → WebP + a PNG
   fallback, ~1440px wide), strip metadata, and drop the results into this repo's
   `public/shots/`. Then swap the CSS-art mockups in `app/page.tsx` for `<Image>`
   tags pointing at those files (the `AppMockup` / `Screenshot` components already
   define the frame; just replace their children).

### Determinism checklist

- Fixed `viewport` + `deviceScaleFactor` — never resize by hand.
- Fixed demo dataset, fixed demo state (Pro, no watermark, no modals).
- Disable/settle animations before capture (`waitForTimeout`, or a reduced-motion flag).
- Pin OS theme + locale for the run (capture an English set and, if desired, a Hebrew/
  RTL set by toggling app locale) so output is reproducible.

### Wire it into release

Run the capture script as a step in the desktop app's release workflow (after build,
before publish). Output images can be uploaded as a build artifact or pushed to this
repo via PR, so every release ships current screenshots with zero manual effort.

## Fallback: OS-level scripted capture

If Electron proves awkward to drive under Playwright, fall back to scripting the OS
screenshot tool against a scripted UI walkthrough:

- macOS: `screencapture -l <windowid>` (per-window, no desktop background).
- Linux: `scrot`/`grim` with a fixed window geometry via the WM.
- Windows: PowerShell + `Graphics.CopyFromScreen`, or AutoHotkey.

Pair it with the same seeded demo dataset and a fixed window size. It's more brittle
(pixel/geometry-bound, per-OS) — prefer the Playwright path and keep this for platforms
where the Electron driver misbehaves.

## TL;DR

Seed a fixed demo dataset → add a demo launch mode → drive the real app with Playwright
at a fixed viewport/scale → capture per-view → optimize → commit to `public/shots/` and
replace the CSS mockups. Deterministic, re-runnable every release, and always the real
product.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `README.md` for the product narrative; this file is the operational map.

## What this is

The **Orenew** website: marketing + store + license/device management for a desktop
app that batch-applies decorative frames to event photos. Three jobs: advertise,
sell subscriptions (Lemon Squeezy), manage licenses/seats/devices.

Separate repo from the desktop app but talks to the **same Supabase project** — it
*extends* that schema, never forks it. **Tier is owned by the desktop backend.** This
site's only write of paid tier is the Lemon Squeezy webhook, via the service role.

## Stack

Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4. Supabase
(`@supabase/ssr` + `@supabase/supabase-js`) for auth/session. Lemon Squeezy as
merchant-of-record. Vitest for unit tests. `@/*` path alias → repo root. Deploy: Vercel.

## Commands

```bash
npm run dev        # next dev → localhost:3000
npm run build      # production build
npm run test       # vitest run (tests/**/*.test.ts)
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

Tests are pure-logic only (node env, no DB). Run `typecheck` + `test` before claiming done.

## Architecture

**Logic lives in `lib/`, pure and side-effect-free; route handlers in `app/api/` just
execute it.** The split exists so the money path is unit-testable without a DB. Keep it.

- `lib/pricing.ts` — single source of truth for plans, seat limits, and the
  tier↔LS-variant mapping. `PLANS`, `tierForVariant`, `resolveEntitlementTier`.
- `lib/billing.ts` — pure `planMutation(event)` → the rows to write. No DB calls.
- `lib/lemonsqueezy.ts` — LS access via the official SDK (`@lemonsqueezy/lemonsqueezy.js`):
  create checkout, read subscriptions. Plus two helpers the SDK lacks:
  `verifyWebhookSignature` (HMAC-SHA256, constant-time) and `periodEndDate`.
- `lib/os-detect.ts` — pure UA→OS + GitHub-release asset picker for /download.
- `lib/supabase/` — `client` (browser), `server` (RLS, request cookies), `middleware`
  (session refresh + route gating), `service` (**service-role, bypasses RLS, server-only**).
- `dictionaries/en.ts` — all UI copy. English-only now; structured for later i18n.
  Don't hardcode user-facing strings in components.

### Supabase client rules

- Reads → `server.ts` (anon key, RLS-enforced). Use in Server Components / routes.
- Privileged writes → `service.ts`. **Only** inside webhook/admin handlers, never
  imported into client-shipped code. It is the sole writer of paid tier.
- Auth checks use `getUser()` (validates the token), **not** `getSession()`, except
  where you need the raw access token to call an Edge Function (see disconnect route).

## Tier propagation contract (don't break this)

1. Buyer signs in → `POST /api/checkout` builds an LS checkout carrying their Supabase
   `user_id` as `custom_data`.
2. LS webhook → verify signature → map variant→tier → write `entitlements.tier` +
   `expires_at` via service role. LS is the source of truth for subscription state; we
   keep no local mapping table. `user_id` rides in `custom_data` on every event.
3. Desktop refresh loop re-mints its device-bound token from the updated row. No
   license keys, no desktop code change.
4. Cancel → `expires_at` = period end (grace); tier holds until then, then drops to Free.

Webhook returns 200 even on unmappable/bad events (so LS stops retrying); only DB
failures return 5xx.

## Routes

Marketing: `/`, `/pricing`, `/download`, `/faq`. Auth: `/sign-in`, `/auth/callback`.
Gated (`/account`, `/admin` — enforced in `lib/supabase/middleware.ts`): `/account`,
`/account/devices`, `/admin`. API: `/api/checkout`, `/api/portal`,
`/api/devices/disconnect` (proxies the desktop's `disconnect-device` Edge Function),
`/api/webhooks/lemonsqueezy`. All API handlers are `runtime = "nodejs"`.

## Database

`supabase/migrations/0001_billing_and_admin.sql` runs against the shared project. It
added `entitlements.is_admin` + admin read RLS, and originally a
`public.billing_subscriptions` mapping table. **That table is being decommissioned** —
LS is now the source of truth for subscription state (`/account`, `/portal`, `/admin` read
the LS API live via `lib/lemonsqueezy.ts`; the webhook no longer writes it). The table is
left in place (no longer read or written) until it's confirmed dead, then dropped manually.
Reuses existing `entitlements` / `entitlement_devices` (defined in the desktop repo). Grant
admin via service role: `update public.entitlements set is_admin = true where user_id = '<uuid>';`

## Conventions

- Brand: indigo `#5b5bd6` accent on near-black; tokens in `app/globals.css` `@theme`
  (`bg-accent`, `bg-aurora`, `bg-grid`, etc.). Reused from the desktop app.
- Pricing seats: Free uncapped/watermarked, **Pro 1 seat**, Studio 5. Pro was 2 —
  existing 2-device Pro users are grandfathered (backend only blocks *new* registration).
- New env vars → document in `.env.example`. `NEXT_PUBLIC_*` is browser-exposed;
  `SUPABASE_SERVICE_ROLE_KEY` and `LEMONSQUEEZY_*` are server-only — never leak them.

## Git workflow

Branch first (`<type>/<desc>`), commit per logical step, push + PR via `gh`. Never
commit to main. (Global rule — applies here too.)

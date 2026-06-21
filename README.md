# Orenew — marketing, store & license management

The public website for **Orenew**, the desktop app that lets event photographers
batch-apply decorative frames to photos for print/magnet production. This site
does three jobs: **advertise**, **sell subscriptions** (via Lemon Squeezy), and
**manage licenses/subscriptions & devices**.

It is a **separate repo** from the desktop app but talks to the **same Supabase
project** — it extends the existing data model, it does not fork it. Tier is owned
by the existing backend; this site's commerce job is to drive Lemon Squeezy
checkout and let its webhook write the paid tier into the existing `entitlements`
table. The desktop refresh loop then picks it up.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS v4**, deployed on **Vercel**.
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`) for auth/session.
- **Lemon Squeezy** as merchant-of-record for global tax/VAT.
- Brand tokens (indigo `#5b5bd6` accent over a near-black base) reused from the
  desktop app's `src/index.css` via Tailwind's `@theme`.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Lemon Squeezy values
npm run dev                  # http://localhost:3000
npm run test                 # vitest unit/logic tests
npm run typecheck            # tsc --noEmit
npm run build                # production build
```

## Environment

See [`.env.example`](.env.example). Highlights:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — **same project**
  as the desktop app. Anon key is public.
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**. Used exclusively inside the
  webhook/admin route handlers; never shipped to the browser. The webhook is the
  **only** writer of paid tier into `entitlements`, preserving the desktop contract.
- `LEMONSQUEEZY_*` — API key, store id, webhook secret, and the four variant IDs
  (Pro/Studio × monthly/yearly).

## Routes

| Path | Purpose |
|---|---|
| `/` | Marketing home — hero, features, showcase, before/after, pricing, FAQ |
| `/pricing` | Full pricing table + monthly/annual toggle |
| `/download` | OS auto-detect → GitHub Releases assets, system requirements |
| `/faq` | Full FAQ |
| `/sign-in` | Supabase auth (email/password, Google, Facebook) |
| `/account` | Current plan, renewal, seat usage, billing portal handoff |
| `/account/devices` | List + disconnect registered devices (seats) |
| `/admin` | Vendor dashboard (read-only), gated by `is_admin` |
| `/api/checkout` | Authenticated — returns a Lemon Squeezy checkout URL |
| `/api/webhooks/lemonsqueezy` | LS webhook → `entitlements` + `billing_subscriptions` |
| `/api/portal` | Returns the LS hosted customer-portal URL |
| `/api/devices/disconnect` | Proxies the existing `disconnect-device` Edge Function |
| `/auth/callback` | OAuth / email-confirm PKCE code exchange |

## Pricing

| Tier | Monthly | Yearly | Seats |
|---|---|---|---|
| Free | $0 | — | Unlimited (watermarked) |
| Pro | $15 | $150 | **1** |
| Studio | $45 | $450 | 5 |

> **Seat change:** Pro is now **1 seat** (was 2). The backend enforcement lives in
> the desktop repo at `supabase/functions/_shared/auth.ts` (`SEAT_LIMITS.pro`),
> updated as part of this work. Existing Pro users with two registered devices keep
> both until one is disconnected — `issue-entitlement` only blocks registering a
> *new* device once over the limit, so they are grandfathered naturally rather than
> force-disconnected.

## Database

This repo extends the shared Supabase schema. Run
[`supabase/migrations/0001_billing_and_admin.sql`](supabase/migrations/0001_billing_and_admin.sql)
against the same project the desktop app uses. It adds:

- `public.billing_subscriptions` — Lemon Squeezy ↔ Supabase mapping (user reads
  own; only service role writes; idempotent on `ls_subscription_id`).
- `entitlements.is_admin` + admin read RLS policies for the vendor dashboard.

It **reuses** the existing `public.entitlements` and `public.entitlement_devices`
(defined in the desktop repo's `docs/supabase/entitlements.sql`).

## Tier propagation contract

1. Buyer signs in → `/api/checkout` builds an LS checkout carrying their Supabase
   `user_id` as custom data.
2. On purchase, LS fires a webhook → we verify the signature, map the variant to a
   tier, upsert `billing_subscriptions`, and write `entitlements.tier` +
   `expires_at` via the service role.
3. The desktop app's refresh loop re-mints its device-bound entitlement token from
   the updated `entitlements` row — no license keys, no desktop code change.
4. On cancel, `expires_at` is set to the period end (grace); tier stays until then,
   then drops to Free.

## i18n

English-only for now, but all copy lives in `dictionaries/en.ts` so a Hebrew/RTL
dictionary can be added later (mirrors the desktop's `src/locales`).

-- Orenew website schema deltas. Runs against the SAME Supabase project as the
-- desktop app. This EXTENDS the existing schema (public.entitlements,
-- public.entitlement_devices from docs/supabase/entitlements.sql in the orenew
-- repo) — it does not redefine those tables.
--
-- Tier remains writable ONLY by the service role (our Lemon Squeezy webhook).
-- This migration adds: (1) a billing-subscription mapping table, (2) an admin
-- flag + admin read policies for the vendor dashboard.

-- ── 1. Billing subscription mapping (Lemon Squeezy ↔ Supabase) ──────────────
create table if not exists public.billing_subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  ls_customer_id      text not null,
  ls_subscription_id  text not null unique,        -- idempotency key for webhooks
  ls_variant_id       text not null,
  tier                text not null check (tier in ('pro','studio')),
  status              text not null,               -- active|cancelled|expired|past_due|unpaid|on_trial
  current_period_end  date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists billing_subscriptions_user_id_idx
  on public.billing_subscriptions(user_id);

alter table public.billing_subscriptions enable row level security;

-- Users may READ only their own subscription row (for the account portal). There
-- is intentionally no insert/update/delete policy — only the service role (our
-- webhook) writes here.
drop policy if exists "read own subscription" on public.billing_subscriptions;
create policy "read own subscription" on public.billing_subscriptions
  for select using (auth.uid() = user_id);

-- ── 2. Admin flag + admin read policies ─────────────────────────────────────
alter table public.entitlements
  add column if not exists is_admin boolean not null default false;

-- Helper: is the current user an admin? SECURITY DEFINER avoids the recursive RLS
-- evaluation that a self-referential policy on entitlements would otherwise hit.
create or replace function public.is_admin()
  returns boolean
  language sql
  security definer
  set search_path = public
as $$
  select coalesce(
    (select e.is_admin from public.entitlements e where e.user_id = auth.uid()),
    false
  );
$$;

-- Admins can read every customer's entitlement, subscription, and device rows.
drop policy if exists "admins read all entitlements" on public.entitlements;
create policy "admins read all entitlements" on public.entitlements
  for select using (public.is_admin());

drop policy if exists "admins read all subscriptions" on public.billing_subscriptions;
create policy "admins read all subscriptions" on public.billing_subscriptions
  for select using (public.is_admin());

drop policy if exists "admins read all devices" on public.entitlement_devices;
create policy "admins read all devices" on public.entitlement_devices
  for select using (public.is_admin());

-- To grant admin to a user (run as service role):
--   update public.entitlements set is_admin = true where user_id = '<uuid>';

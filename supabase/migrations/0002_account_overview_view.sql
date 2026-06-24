-- Account overview view. Masks the effective-tier grace logic (expires_at) in SQL
-- so the app reads one column instead of recomputing it per page. Runs against the
-- SAME Supabase project as the desktop app; reads only public.entitlements.
--
-- security_invoker = on (PG15+) makes the view evaluate with the *caller's*
-- permissions, so existing RLS on entitlements carries through: an anon/RLS user
-- sees only their own row; the service role (admin) still sees all rows.

create or replace view public.account_overview
  with (security_invoker = on) as
select
  e.user_id,
  e.tier,
  e.is_admin,
  e.expires_at,
  case
    when e.tier is null then 'free'
    when e.expires_at is not null and e.expires_at < current_date then 'free'
    else e.tier
  end as effective_tier
from public.entitlements e;

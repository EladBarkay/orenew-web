-- Admin dashboard customer view. Moves the per-customer joins and aggregates that
-- app/admin/page.tsx previously did in JavaScript (email lookup, device-seat count,
-- lifetime subscription count, latest subscription) into one SQL view, so the page
-- fetches one bounded, ordered page instead of scanning three whole tables plus a
-- 1000-row-capped auth.admin.listUsers call.
--
-- Server-only: queried with the service role AFTER app/admin/page.tsx authorizes the
-- caller as admin. The view exposes email (PII), so it is revoked from anon/authenticated
-- and never reachable through the Data API.

create or replace view public.admin_customers
  with (security_invoker = true) as
select
  e.user_id,
  u.email,
  e.tier,
  -- studio first, then pro, then free (matches the previous JS sort)
  case e.tier when 'studio' then 0 when 'pro' then 1 else 2 end as tier_rank,
  coalesce(latest.status, case when e.tier = 'free' then 'free' else 'active' end) as status,
  coalesce(dev.seat_count, 0) as seats,
  coalesce(subc.sub_count, 0) as subscriptions,
  coalesce(latest.current_period_end, e.expires_at) as renewal
from public.entitlements e
left join auth.users u on u.id = e.user_id
left join lateral (
  select bs.status, bs.current_period_end
  from public.billing_subscriptions bs
  where bs.user_id = e.user_id
  order by bs.updated_at desc
  limit 1
) latest on true
left join (
  select user_id, count(*) as seat_count
  from public.entitlement_devices
  group by user_id
) dev on dev.user_id = e.user_id
left join (
  select user_id, count(*) as sub_count
  from public.billing_subscriptions
  group by user_id
) subc on subc.user_id = e.user_id;

revoke all on public.admin_customers from anon, authenticated;
grant select on public.admin_customers to service_role;

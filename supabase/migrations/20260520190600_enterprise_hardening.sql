-- =============================================================================
-- Enterprise hardening: audit admin visibility + optional account access model
-- Apply after 20260520190500_security_hardening.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles.role — admin | user (default user)
-- -----------------------------------------------------------------------------
update public.profiles set role = coalesce(role, 'user') where role is null;

-- -----------------------------------------------------------------------------
-- audit_logs: administrators only for SELECT; authenticated INSERT retained
-- -----------------------------------------------------------------------------
drop policy if exists "auth_select_audit_logs" on public.audit_logs;

create policy "admin_select_audit_logs"
  on public.audit_logs for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- -----------------------------------------------------------------------------
-- OPTIONAL (disabled): account-level isolation via memberships
-- Uncomment when account_memberships is populated for all users.
-- -----------------------------------------------------------------------------
-- create table if not exists public.account_memberships (
--   account_id uuid not null references public.accounts (id) on delete cascade,
--   user_id uuid not null references auth.users (id) on delete cascade,
--   role text not null default 'member' check (role in ('owner', 'member', 'viewer')),
--   created_at timestamptz not null default now(),
--   primary key (account_id, user_id)
-- );
-- alter table public.account_memberships enable row level security;
-- create policy "members_read_own" on public.account_memberships
--   for select to authenticated using (auth.uid() = user_id);
--
-- Example accounts policy (replace broad authenticated access):
-- create policy "account_member_select" on public.accounts for select to authenticated
--   using (
--     exists (
--       select 1 from public.account_memberships m
--       where m.account_id = accounts.id and m.user_id = auth.uid()
--     )
--   );

-- -----------------------------------------------------------------------------
-- Database audit trigger (hybrid with app-layer logger)
-- -----------------------------------------------------------------------------
create or replace function public.audit_log_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid;
  diff jsonb;
begin
  actor := auth.uid();
  if tg_op = 'INSERT' then
    diff := jsonb_build_object('after', to_jsonb(new));
    insert into public.audit_logs (user_id, action, table_name, record_id, changes)
    values (actor, 'CREATE', tg_table_name, new.id::text, diff);
    return new;
  elsif tg_op = 'UPDATE' then
    diff := jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new));
    insert into public.audit_logs (user_id, action, table_name, record_id, changes)
    values (actor, 'UPDATE', tg_table_name, new.id::text, diff);
    return new;
  elsif tg_op = 'DELETE' then
    diff := jsonb_build_object('before', to_jsonb(old));
    insert into public.audit_logs (user_id, action, table_name, record_id, changes)
    values (actor, 'DELETE', tg_table_name, old.id::text, diff);
    return old;
  end if;
  return null;
end;
$$;

-- Attach to high-value tables (idempotent drop/create)
do $$
declare
  t text;
begin
  foreach t in array array[
    'accounts',
    'sales_activities',
    'products',
    'quotes',
    'follow_up_items'
  ]
  loop
    execute format('drop trigger if exists audit_%I on public.%I', t, t);
    execute format(
      'create trigger audit_%I after insert or update or delete on public.%I
       for each row execute function public.audit_log_trigger()',
      t, t
    );
  end loop;
end $$;

-- =============================================================================
-- Security validation queries — run in Supabase SQL Editor after migrations
-- =============================================================================

-- 1) Tables without RLS enabled (should return zero rows)
select
  n.nspname as schema_name,
  c.relname as table_name
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relrowsecurity = false
order by c.relname;

-- 2) All public tables and RLS status
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;

-- 3) All RLS policies (check roles — should be {authenticated}, not {anon})
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd as operation,
  qual as using_expression,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4) Policies granted to anon (should return zero rows for application hardening)
select
  tablename,
  policyname,
  roles
from pg_policies
where schemaname = 'public'
  and roles::text ilike '%anon%'
order by tablename;

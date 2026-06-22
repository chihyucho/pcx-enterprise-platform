-- =============================================================================
-- Security hardening (pre-production)
-- - Enable RLS on all public tables
-- - Authenticated-only access policies (no anon policies)
-- - audit_logs table for accountability
-- =============================================================================

grant usage on schema public to authenticated;

-- -----------------------------------------------------------------------------
-- accounts (CRUD — was missing explicit RLS in tracked migrations)
-- -----------------------------------------------------------------------------
alter table public.accounts enable row level security;

drop policy if exists "auth_select_accounts" on public.accounts;
drop policy if exists "auth_insert_accounts" on public.accounts;
drop policy if exists "auth_update_accounts" on public.accounts;
drop policy if exists "auth_delete_accounts" on public.accounts;

create policy "auth_select_accounts"
  on public.accounts for select to authenticated
  using (true);

create policy "auth_insert_accounts"
  on public.accounts for insert to authenticated
  with check (true);

create policy "auth_update_accounts"
  on public.accounts for update to authenticated
  using (true)
  with check (true);

create policy "auth_delete_accounts"
  on public.accounts for delete to authenticated
  using (true);

grant select, insert, update, delete on public.accounts to authenticated;

-- -----------------------------------------------------------------------------
-- business_categories (read-only reference data)
-- -----------------------------------------------------------------------------
alter table public.business_categories enable row level security;

drop policy if exists "auth_select_business_categories" on public.business_categories;

create policy "auth_select_business_categories"
  on public.business_categories for select to authenticated
  using (true);

grant select on public.business_categories to authenticated;

-- -----------------------------------------------------------------------------
-- stages (read-only reference data)
-- -----------------------------------------------------------------------------
alter table public.stages enable row level security;

drop policy if exists "auth_select_stages" on public.stages;

create policy "auth_select_stages"
  on public.stages for select to authenticated
  using (true);

grant select on public.stages to authenticated;

-- -----------------------------------------------------------------------------
-- Account tab tables (idempotent — ensures policies exist if only RLS was enabled)
-- -----------------------------------------------------------------------------
alter table public.account_projects enable row level security;
drop policy if exists "auth_select_account_projects" on public.account_projects;
drop policy if exists "auth_insert_account_projects" on public.account_projects;
drop policy if exists "auth_update_account_projects" on public.account_projects;
drop policy if exists "auth_delete_account_projects" on public.account_projects;
create policy "auth_select_account_projects" on public.account_projects for select to authenticated using (true);
create policy "auth_insert_account_projects" on public.account_projects for insert to authenticated with check (true);
create policy "auth_update_account_projects" on public.account_projects for update to authenticated using (true) with check (true);
create policy "auth_delete_account_projects" on public.account_projects for delete to authenticated using (true);
grant select, insert, update, delete on public.account_projects to authenticated;

alter table public.brand_overview enable row level security;
drop policy if exists "auth_select_brand_overview" on public.brand_overview;
drop policy if exists "auth_insert_brand_overview" on public.brand_overview;
drop policy if exists "auth_update_brand_overview" on public.brand_overview;
drop policy if exists "auth_delete_brand_overview" on public.brand_overview;
create policy "auth_select_brand_overview" on public.brand_overview for select to authenticated using (true);
create policy "auth_insert_brand_overview" on public.brand_overview for insert to authenticated with check (true);
create policy "auth_update_brand_overview" on public.brand_overview for update to authenticated using (true) with check (true);
create policy "auth_delete_brand_overview" on public.brand_overview for delete to authenticated using (true);
grant select, insert, update, delete on public.brand_overview to authenticated;

alter table public.contact_persons enable row level security;
drop policy if exists "auth_select_contact_persons" on public.contact_persons;
drop policy if exists "auth_insert_contact_persons" on public.contact_persons;
drop policy if exists "auth_update_contact_persons" on public.contact_persons;
drop policy if exists "auth_delete_contact_persons" on public.contact_persons;
create policy "auth_select_contact_persons" on public.contact_persons for select to authenticated using (true);
create policy "auth_insert_contact_persons" on public.contact_persons for insert to authenticated with check (true);
create policy "auth_update_contact_persons" on public.contact_persons for update to authenticated using (true) with check (true);
create policy "auth_delete_contact_persons" on public.contact_persons for delete to authenticated using (true);
grant select, insert, update, delete on public.contact_persons to authenticated;

alter table public.products enable row level security;
drop policy if exists "auth_select_products" on public.products;
drop policy if exists "auth_insert_products" on public.products;
drop policy if exists "auth_update_products" on public.products;
drop policy if exists "auth_delete_products" on public.products;
create policy "auth_select_products" on public.products for select to authenticated using (true);
create policy "auth_insert_products" on public.products for insert to authenticated with check (true);
create policy "auth_update_products" on public.products for update to authenticated using (true) with check (true);
create policy "auth_delete_products" on public.products for delete to authenticated using (true);
grant select, insert, update, delete on public.products to authenticated;

alter table public.quotes enable row level security;
drop policy if exists "auth_select_quotes" on public.quotes;
drop policy if exists "auth_insert_quotes" on public.quotes;
drop policy if exists "auth_update_quotes" on public.quotes;
drop policy if exists "auth_delete_quotes" on public.quotes;
create policy "auth_select_quotes" on public.quotes for select to authenticated using (true);
create policy "auth_insert_quotes" on public.quotes for insert to authenticated with check (true);
create policy "auth_update_quotes" on public.quotes for update to authenticated using (true) with check (true);
create policy "auth_delete_quotes" on public.quotes for delete to authenticated using (true);
grant select, insert, update, delete on public.quotes to authenticated;

alter table public.marketing_materials enable row level security;
drop policy if exists "auth_select_marketing_materials" on public.marketing_materials;
drop policy if exists "auth_insert_marketing_materials" on public.marketing_materials;
drop policy if exists "auth_update_marketing_materials" on public.marketing_materials;
drop policy if exists "auth_delete_marketing_materials" on public.marketing_materials;
create policy "auth_select_marketing_materials" on public.marketing_materials for select to authenticated using (true);
create policy "auth_insert_marketing_materials" on public.marketing_materials for insert to authenticated with check (true);
create policy "auth_update_marketing_materials" on public.marketing_materials for update to authenticated using (true) with check (true);
create policy "auth_delete_marketing_materials" on public.marketing_materials for delete to authenticated using (true);
grant select, insert, update, delete on public.marketing_materials to authenticated;

alter table public.supply_chain enable row level security;
drop policy if exists "auth_select_supply_chain" on public.supply_chain;
drop policy if exists "auth_insert_supply_chain" on public.supply_chain;
drop policy if exists "auth_update_supply_chain" on public.supply_chain;
drop policy if exists "auth_delete_supply_chain" on public.supply_chain;
create policy "auth_select_supply_chain" on public.supply_chain for select to authenticated using (true);
create policy "auth_insert_supply_chain" on public.supply_chain for insert to authenticated with check (true);
create policy "auth_update_supply_chain" on public.supply_chain for update to authenticated using (true) with check (true);
create policy "auth_delete_supply_chain" on public.supply_chain for delete to authenticated using (true);
grant select, insert, update, delete on public.supply_chain to authenticated;

alter table public.sales_activities enable row level security;
drop policy if exists "auth_select_sales_activities" on public.sales_activities;
drop policy if exists "auth_insert_sales_activities" on public.sales_activities;
drop policy if exists "auth_update_sales_activities" on public.sales_activities;
drop policy if exists "auth_delete_sales_activities" on public.sales_activities;
create policy "auth_select_sales_activities" on public.sales_activities for select to authenticated using (true);
create policy "auth_insert_sales_activities" on public.sales_activities for insert to authenticated with check (true);
create policy "auth_update_sales_activities" on public.sales_activities for update to authenticated using (true) with check (true);
create policy "auth_delete_sales_activities" on public.sales_activities for delete to authenticated using (true);
grant select, insert, update, delete on public.sales_activities to authenticated;

-- -----------------------------------------------------------------------------
-- Ensure RLS enabled on remaining tables (policies from earlier migrations)
-- -----------------------------------------------------------------------------
alter table public.user_dashboard_reads enable row level security;
alter table public.follow_up_items enable row level security;
alter table public.profiles enable row level security;

-- -----------------------------------------------------------------------------
-- audit_logs
-- -----------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  table_name text not null,
  record_id text not null,
  changes jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists audit_logs_table_record_idx
  on public.audit_logs (table_name, record_id);

alter table public.audit_logs enable row level security;

drop policy if exists "auth_select_audit_logs" on public.audit_logs;
drop policy if exists "auth_insert_audit_logs" on public.audit_logs;

create policy "auth_select_audit_logs"
  on public.audit_logs for select to authenticated
  using (true);

create policy "auth_insert_audit_logs"
  on public.audit_logs for insert to authenticated
  with check (user_id is null or auth.uid() = user_id);

grant select, insert on public.audit_logs to authenticated;

-- No UPDATE/DELETE policies — audit log rows are append-only.

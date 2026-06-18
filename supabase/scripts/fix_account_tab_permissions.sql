-- =============================================================================
-- ONE-TIME FIX: Account detail CRUD (SELECT / INSERT / UPDATE / DELETE)
-- Run this entire file in Supabase → SQL Editor if edits fail with
-- "Update was not applied" or permission errors.
-- =============================================================================

grant usage on schema public to authenticated;
grant usage on schema public to anon;

-- Optional columns (safe if already applied)
alter table public.quotes add column if not exists notes text;
alter table public.marketing_materials add column if not exists channel text;
alter table public.marketing_materials add column if not exists description text;
alter table public.marketing_materials add column if not exists approved_at timestamptz;
alter table public.sales_activities add column if not exists follow_up_completed boolean not null default false;
alter table public.quotes add column if not exists created_at timestamptz default now();
alter table public.account_projects add column if not exists project_name text;

alter table public.sales_activities add column if not exists project_id uuid references public.account_projects (id) on delete set null;
alter table public.products add column if not exists project_id uuid references public.account_projects (id) on delete set null;
alter table public.quotes add column if not exists project_id uuid references public.account_projects (id) on delete set null;
alter table public.marketing_materials add column if not exists project_id uuid references public.account_projects (id) on delete set null;
alter table public.supply_chain add column if not exists project_id uuid references public.account_projects (id) on delete set null;

-- Helper: policies + grants for one table
-- (Run each block; names are unique per table)

-- account_projects
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

-- sales_activities
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

-- contact_persons
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

-- products
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

-- quotes
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

-- marketing_materials
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

-- supply_chain
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

-- brand_overview
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

-- dashboard read tracking (per user)
create table if not exists public.user_dashboard_reads (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('sales_activity', 'quote', 'product', 'marketing')),
  item_id uuid not null,
  read_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);
alter table public.user_dashboard_reads enable row level security;
drop policy if exists "users_select_own_dashboard_reads" on public.user_dashboard_reads;
drop policy if exists "users_insert_own_dashboard_reads" on public.user_dashboard_reads;
drop policy if exists "users_update_own_dashboard_reads" on public.user_dashboard_reads;
drop policy if exists "users_delete_own_dashboard_reads" on public.user_dashboard_reads;
create policy "users_select_own_dashboard_reads" on public.user_dashboard_reads for select to authenticated using (auth.uid() = user_id);
create policy "users_insert_own_dashboard_reads" on public.user_dashboard_reads for insert to authenticated with check (auth.uid() = user_id);
create policy "users_update_own_dashboard_reads" on public.user_dashboard_reads for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users_delete_own_dashboard_reads" on public.user_dashboard_reads for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.user_dashboard_reads to authenticated;

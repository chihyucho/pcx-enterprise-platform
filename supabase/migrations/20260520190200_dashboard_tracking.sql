-- Dashboard: follow-up completion, per-user read tracking, quotes.created_at

alter table public.sales_activities
  add column if not exists follow_up_completed boolean not null default false;

alter table public.quotes
  add column if not exists created_at timestamptz default now();

create table if not exists public.user_dashboard_reads (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('sales_activity', 'quote')),
  item_id uuid not null,
  read_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

alter table public.user_dashboard_reads enable row level security;

drop policy if exists "users_select_own_dashboard_reads" on public.user_dashboard_reads;
drop policy if exists "users_insert_own_dashboard_reads" on public.user_dashboard_reads;
drop policy if exists "users_update_own_dashboard_reads" on public.user_dashboard_reads;
drop policy if exists "users_delete_own_dashboard_reads" on public.user_dashboard_reads;

create policy "users_select_own_dashboard_reads"
  on public.user_dashboard_reads for select to authenticated
  using (auth.uid() = user_id);

create policy "users_insert_own_dashboard_reads"
  on public.user_dashboard_reads for insert to authenticated
  with check (auth.uid() = user_id);

create policy "users_update_own_dashboard_reads"
  on public.user_dashboard_reads for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_delete_own_dashboard_reads"
  on public.user_dashboard_reads for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_dashboard_reads to authenticated;

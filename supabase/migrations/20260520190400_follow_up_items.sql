-- Follow-up items: multiple assignable follow-ups per sales activity

create table if not exists public.follow_up_items (
  id uuid primary key default gen_random_uuid(),
  sales_activity_id uuid not null references public.sales_activities (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  assigned_user_id uuid not null references auth.users (id) on delete restrict,
  due_date date not null,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create index if not exists follow_up_items_assigned_user_due_idx
  on public.follow_up_items (assigned_user_id, due_date)
  where completed_at is null;

create index if not exists follow_up_items_sales_activity_idx
  on public.follow_up_items (sales_activity_id);

-- Backfill from legacy sales_activities follow-up fields
insert into public.follow_up_items (
  sales_activity_id,
  account_id,
  assigned_user_id,
  due_date,
  completed_at,
  created_by
)
select
  sa.id,
  sa.account_id,
  coalesce(
    sa.created_by,
    (select p.id from public.profiles p order by p.created_at nulls last limit 1)
  ),
  sa.next_follow_up::date,
  case when sa.follow_up_completed then now() else null end,
  sa.created_by
from public.sales_activities sa
where sa.next_follow_up is not null
  and sa.account_id is not null
  and coalesce(
    sa.created_by,
    (select p.id from public.profiles p order by p.created_at nulls last limit 1)
  ) is not null
  and not exists (
    select 1
    from public.follow_up_items fi
    where fi.sales_activity_id = sa.id
      and fi.due_date = sa.next_follow_up::date
  );

alter table public.follow_up_items enable row level security;

drop policy if exists "Authenticated users can select follow_up_items" on public.follow_up_items;
drop policy if exists "Authenticated users can insert follow_up_items" on public.follow_up_items;
drop policy if exists "Authenticated users can update follow_up_items" on public.follow_up_items;
drop policy if exists "Authenticated users can delete follow_up_items" on public.follow_up_items;

create policy "Authenticated users can select follow_up_items"
  on public.follow_up_items for select to authenticated
  using (true);

create policy "Authenticated users can insert follow_up_items"
  on public.follow_up_items for insert to authenticated
  with check (true);

create policy "Authenticated users can update follow_up_items"
  on public.follow_up_items for update to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete follow_up_items"
  on public.follow_up_items for delete to authenticated
  using (true);

grant select, insert, update, delete on public.follow_up_items to authenticated;

-- Profiles: allow reading all users for assignee dropdowns; users update own row
alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Authenticated users can read profiles"
  on public.profiles for select to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;

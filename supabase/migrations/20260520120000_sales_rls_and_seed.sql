-- RLS: allow authenticated users to use sales lookup tables and accounts.
-- Lookup data (stages, business_categories) is managed in Supabase — no seed data here.
-- Run via Supabase SQL Editor or: supabase db push

-- ---------------------------------------------------------------------------
-- business_categories
-- ---------------------------------------------------------------------------
alter table public.business_categories enable row level security;

drop policy if exists "Authenticated users can read business_categories" on public.business_categories;
create policy "Authenticated users can read business_categories"
  on public.business_categories
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert business_categories" on public.business_categories;
create policy "Authenticated users can insert business_categories"
  on public.business_categories
  for insert
  to authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- stages
-- ---------------------------------------------------------------------------
alter table public.stages enable row level security;

drop policy if exists "Authenticated users can read stages" on public.stages;
create policy "Authenticated users can read stages"
  on public.stages
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert stages" on public.stages;
create policy "Authenticated users can insert stages"
  on public.stages
  for insert
  to authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- accounts
-- ---------------------------------------------------------------------------
alter table public.accounts enable row level security;

drop policy if exists "Authenticated users can read accounts" on public.accounts;
create policy "Authenticated users can read accounts"
  on public.accounts
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert accounts" on public.accounts;
create policy "Authenticated users can insert accounts"
  on public.accounts
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update accounts" on public.accounts;
create policy "Authenticated users can update accounts"
  on public.accounts
  for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- profiles (needed for created_by FK and user menu)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

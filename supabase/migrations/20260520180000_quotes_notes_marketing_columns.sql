-- Quotes note + marketing channel/description. Run in Supabase SQL Editor or: supabase db push

alter table public.quotes
  add column if not exists notes text;

alter table public.marketing_materials
  add column if not exists channel text;

alter table public.marketing_materials
  add column if not exists description text;

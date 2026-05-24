-- Marketing tab: align status CHECK with app dropdown + add approved_at.
-- Inspect current rule:
--   SELECT pg_get_constraintdef(oid) FROM pg_constraint
--   WHERE conname = 'marketing_materials_status_check';

alter table public.marketing_materials
  add column if not exists approved_at timestamptz;

alter table public.marketing_materials
  drop constraint if exists marketing_materials_status_check;

alter table public.marketing_materials
  add constraint marketing_materials_status_check
  check (
    status is null
    or status in (
      'pending',
      'in_review',
      'approved',
      'rejected',
      'on_hold'
    )
  );

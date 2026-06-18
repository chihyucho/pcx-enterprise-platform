-- Align products.approval_status CHECK with app dropdown values.
-- The constraint is defined on the database (not in the Next.js app).
-- To see the current rule in Supabase SQL Editor:
--   SELECT pg_get_constraintdef(oid)
--   FROM pg_constraint
--   WHERE conname = 'products_approval_status_check';

alter table public.products
  drop constraint if exists products_approval_status_check;

alter table public.products
  add constraint products_approval_status_check
  check (
    approval_status is null
    or approval_status in (
      'pending',
      'in_review',
      'approved',
      'rejected',
      'on_hold'
    )
  );

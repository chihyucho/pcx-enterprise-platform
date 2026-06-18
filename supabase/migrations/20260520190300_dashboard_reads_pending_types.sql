-- Allow pending-approval dismissals in user_dashboard_reads.

alter table public.user_dashboard_reads
  drop constraint if exists user_dashboard_reads_item_type_check;

alter table public.user_dashboard_reads
  add constraint user_dashboard_reads_item_type_check
  check (
    item_type in ('sales_activity', 'quote', 'product', 'marketing')
  );

-- Allow authenticated users to delete account tab rows.

drop policy if exists "Authenticated users can delete sales_activities" on public.sales_activities;
create policy "Authenticated users can delete sales_activities"
  on public.sales_activities for delete to authenticated using (true);

drop policy if exists "Authenticated users can delete contact_persons" on public.contact_persons;
create policy "Authenticated users can delete contact_persons"
  on public.contact_persons for delete to authenticated using (true);

drop policy if exists "Authenticated users can delete products" on public.products;
create policy "Authenticated users can delete products"
  on public.products for delete to authenticated using (true);

drop policy if exists "Authenticated users can delete quotes" on public.quotes;
create policy "Authenticated users can delete quotes"
  on public.quotes for delete to authenticated using (true);

drop policy if exists "Authenticated users can delete marketing_materials" on public.marketing_materials;
create policy "Authenticated users can delete marketing_materials"
  on public.marketing_materials for delete to authenticated using (true);

drop policy if exists "Authenticated users can delete supply_chain" on public.supply_chain;
create policy "Authenticated users can delete supply_chain"
  on public.supply_chain for delete to authenticated using (true);

grant delete on public.sales_activities to authenticated;
grant delete on public.contact_persons to authenticated;
grant delete on public.products to authenticated;
grant delete on public.quotes to authenticated;
grant delete on public.marketing_materials to authenticated;
grant delete on public.supply_chain to authenticated;

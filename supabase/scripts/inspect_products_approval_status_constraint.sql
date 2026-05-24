-- Run in Supabase SQL Editor to see CHECK constraints on products / marketing_materials.

select
  rel.relname as table_name,
  con.conname as constraint_name,
  pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class rel on rel.oid = con.conrelid
join pg_namespace nsp on nsp.oid = rel.relnamespace
where nsp.nspname = 'public'
  and rel.relname in ('products', 'marketing_materials')
  and con.contype = 'c'
order by rel.relname, con.conname;

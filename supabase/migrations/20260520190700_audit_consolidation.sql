-- =============================================================================
-- Audit consolidation: database triggers are the sole audit write path.
-- Apply after 20260520190600_enterprise_hardening.sql
-- =============================================================================

drop policy if exists "auth_insert_audit_logs" on public.audit_logs;

-- Triggers run as security definer and bypass RLS for inserts.

comment on function public.audit_log_trigger() is
  'Sole audit write path for CREATE/UPDATE/DELETE on audited tables.';

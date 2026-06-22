# Supabase security configuration (pre-production)

This document describes security rules for the PCX Enterprise Platform **before production deployment**.

## Row Level Security (RLS)

All tables in the `public` schema must have RLS enabled. Policies grant access to the **`authenticated`** role only. There are **no policies for `anon`** on application tables — unauthenticated requests cannot read or write data.

Migration: `supabase/migrations/20260520190500_security_hardening.sql`

### Tables

| Table | RLS | Policies |
|-------|-----|----------|
| `accounts` | Yes | SELECT, INSERT, UPDATE, DELETE → authenticated |
| `account_projects` | Yes | Full CRUD → authenticated |
| `brand_overview` | Yes | Full CRUD → authenticated |
| `business_categories` | Yes | SELECT → authenticated |
| `contact_persons` | Yes | Full CRUD → authenticated |
| `follow_up_items` | Yes | Full CRUD → authenticated |
| `marketing_materials` | Yes | Full CRUD → authenticated |
| `products` | Yes | Full CRUD → authenticated |
| `profiles` | Yes | SELECT all; INSERT/UPDATE own row |
| `quotes` | Yes | Full CRUD → authenticated |
| `sales_activities` | Yes | Full CRUD → authenticated |
| `stages` | Yes | SELECT → authenticated |
| `supply_chain` | Yes | Full CRUD → authenticated |
| `user_dashboard_reads` | Yes | CRUD own rows only (`auth.uid() = user_id`) |
| `audit_logs` | Yes | SELECT + INSERT → authenticated (append-only) |

Earlier migrations and `supabase/scripts/fix_account_tab_permissions.sql` define overlapping policies for several tables. The hardening migration adds missing tables (`accounts`, `business_categories`, `stages`, `audit_logs`) without removing existing working policies.

## Authentication — disable public signup

**Production (required):** Supabase Dashboard → **Authentication** → **Providers** → **Email** → disable **Enable sign up**.

**Local CLI:** `supabase/config.toml` sets `auth.enable_signup = false`.

Users must be created by an administrator (Dashboard → Authentication → Users → Add user) or via an invite flow.

## Environment variables

| Variable | Where | Rule |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Public project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server | Only key exposed to the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | API routes & Server Actions only; **never** in client code |

See `.env.example` for a template.

### Code audit (current)

- `src/lib/supabase/client.ts` — anon key only ✓
- `src/lib/supabase/server.ts` — anon key only ✓
- No `SUPABASE_SERVICE_ROLE_KEY` usage in the codebase ✓

## Storage

Supabase Storage is **not used** in this application. No buckets are configured. If storage is added later:

- Create buckets as **private** (not public)
- Add RLS-style policies so only `authenticated` users can read/write objects
- Do not expose public URLs without signed URLs or auth checks

## Audit logs

Table `public.audit_logs` stores accountability records:

- `id`, `user_id`, `action`, `table_name`, `record_id`, `changes` (jsonb), `created_at`
- Append-only (no UPDATE/DELETE policies)
- Application wiring to write audit rows is optional future work; the table is ready for use

## Validation

After applying migrations, run the checks in `supabase/SECURITY-VALIDATION-REPORT.md` and the SQL in `supabase/scripts/security_validation.sql`.

# Security validation report

**Project:** PCX Enterprise Platform  
**Status:** Pre-production hardening  
**Date:** 2026-05-20  

Run this checklist after `supabase db push` or applying migrations in the SQL Editor.

---

## 1. RLS enabled on all public tables

Run `supabase/scripts/security_validation.sql` in the SQL Editor.

**Expected:** Every row in `public` schema shows `rowsecurity = true`.

| Table | RLS enabled |
|-------|-------------|
| accounts | ☐ |
| account_projects | ☐ |
| audit_logs | ☐ |
| brand_overview | ☐ |
| business_categories | ☐ |
| contact_persons | ☐ |
| follow_up_items | ☐ |
| marketing_materials | ☐ |
| products | ☐ |
| profiles | ☐ |
| quotes | ☐ |
| sales_activities | ☐ |
| stages | ☐ |
| supply_chain | ☐ |
| user_dashboard_reads | ☐ |

---

## 2. Policies created

Run in SQL Editor:

```sql
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

**Expected:**

- Every application table has at least one policy for `authenticated`
- No policies with role `{public}` or `{anon}` on application tables
- `user_dashboard_reads` policies restrict to `auth.uid() = user_id`
- `audit_logs` has SELECT + INSERT only (no UPDATE/DELETE)

---

## 3. No public (anon) data access

**Expected:**

- No `CREATE POLICY ... TO anon` on `public` tables
- Unauthenticated API calls with anon key return empty/error (RLS deny-by-default)
- App routes except `/login` require authentication via `src/proxy.ts`

**Manual test:**

1. Open `/login` in a private window (not signed in)
2. Confirm `/portal` and `/sales-system/dashboard` redirect to login
3. Optional: call REST API with anon key only (no JWT) → no rows from `accounts`

---

## 4. Signup disabled or restricted

**Dashboard check:**

- Authentication → Providers → Email → **Enable sign up** = OFF

**Local CLI:**

- `supabase/config.toml` → `[auth] enable_signup = false`

**Manual test:**

- Attempt self-registration via Auth API or UI → should fail when signup is disabled

---

## 5. Service role key server-only

**Code audit:**

```bash
rg "SERVICE_ROLE|service_role" --glob '!node_modules'
```

**Expected:** No matches in application source (only `.env.example` comments).

**Expected usage when introduced:**

- `src/app/api/**` route handlers
- `src/lib/**/actions.ts` server actions (with `"use server"`)
- Never in `src/components/**` with `"use client"`

---

## 6. Storage protected

**Current status:** Not applicable — no Supabase Storage buckets in use.

If buckets are added before launch, re-run this section:

- Bucket public = false
- Policies require `authenticated` role
- No anonymous read access

---

## 7. Application smoke test (post-migration)

After hardening, verify existing features still work while signed in:

- ☐ Login / logout
- ☐ Portal and sales system navigation
- ☐ Accounts list, create, edit
- ☐ Account tabs (activities, products, quotes, marketing, etc.)
- ☐ Dashboard (new activities, quotes, pending approval)
- ☐ Follow-ups page (open + completed)
- ☐ Profile page (name / email / password)

---

## Sign-off

| Check | Result | Notes |
|-------|--------|-------|
| All tables RLS enabled | | |
| Authenticated-only policies | | |
| No anon policies on app tables | | |
| Signup disabled in Dashboard | | |
| service_role not in client code | | |
| Storage N/A or private | | |
| Smoke tests passed | | |

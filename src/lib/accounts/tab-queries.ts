import { createClient } from "@/lib/supabase/server";
import { formatAccountDate, formatSourceLabel } from "@/lib/accounts/format";
import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type {
  AccountTabData,
  AccountTabRowMap,
  BrandOverviewData,
  BrandOverviewResult,
} from "@/types/account-detail";
import {
  accountByIdQuery,
  type AccountWithRelationsSingle,
} from "@/types/supabase";
import type { TypedSupabaseClient } from "@/lib/supabase/database";

function unwrapRelation<T>(value: T | T[] | null): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getBrandOverview(
  accountId: string
): Promise<BrandOverviewResult> {
  const supabase = await createClient();
  const { data, error } = await accountByIdQuery(supabase, accountId);

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: "Account not found" };
  }

  const row = data as AccountWithRelationsSingle;
  const category = unwrapRelation(row.business_categories);
  const stage = unwrapRelation(row.stages);

  const overview: BrandOverviewData = {
    brand_name: row.brand_name,
    category_name: category?.category_name ?? "—",
    stage_name: stage?.stage_name ?? "—",
    source: row.source ? formatSourceLabel(row.source) : null,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  return { data: overview, error: null };
}

async function fetchTabRows(
  client: TypedSupabaseClient,
  table: AccountTabTableName,
  accountId: string,
  orderColumn: string
): Promise<{ data: unknown[] | null; error: string | null }> {
  switch (table) {
    case "account_projects": {
      const { data, error } = await client
        .from("account_projects")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      if (error) return { data: null, error: error.message };
      return { data: data ?? [], error: null };
    }
    case "sales_activities": {
      const { data, error } = await client
        .from("sales_activities")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      if (error) return { data: null, error: error.message };
      return { data: data ?? [], error: null };
    }
    case "contacts": {
      const { data, error } = await client
        .from("contacts")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      if (error) return { data: null, error: error.message };
      return { data: data ?? [], error: null };
    }
    case "products": {
      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      if (error) return { data: null, error: error.message };
      return { data: data ?? [], error: null };
    }
    case "quotes": {
      const { data, error } = await client
        .from("quotes")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      if (error) return { data: null, error: error.message };
      return { data: data ?? [], error: null };
    }
    case "marketing_materials": {
      const { data, error } = await client
        .from("marketing_materials")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      if (error) return { data: null, error: error.message };
      return { data: data ?? [], error: null };
    }
    case "supply_chain": {
      const { data, error } = await client
        .from("supply_chain")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      if (error) return { data: null, error: error.message };
      return { data: data ?? [], error: null };
    }
    default: {
      const _exhaustive: never = table;
      return { data: null, error: `Unknown table: ${_exhaustive}` };
    }
  }
}

const TABLE_ORDER: Record<AccountTabTableName, string> = {
  account_projects: "created_at",
  sales_activities: "activity_date",
  contacts: "created_at",
  products: "created_at",
  quotes: "quote_date",
  marketing_materials: "created_at",
  supply_chain: "created_at",
};

export async function getAccountTabData<T extends AccountTabTableName>(
  table: T,
  accountId: string
): Promise<AccountTabData<T>> {
  const supabase = await createClient();
  const result = await fetchTabRows(
    supabase,
    table,
    accountId,
    TABLE_ORDER[table]
  );

  if (result.error) {
    return { data: null, error: result.error };
  }

  return {
    data: (result.data ?? []) as AccountTabRowMap[T][],
    error: null,
  };
}

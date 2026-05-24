import { createClient } from "@/lib/supabase/server";
import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type { AccountTabData, AccountTabRowMap } from "@/types/account-detail";
import type { TypedSupabaseClient } from "@/lib/supabase/database";

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
        .order(orderColumn, { ascending: true, nullsFirst: false });
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
    case "contact_persons": {
      const { data, error } = await client
        .from("contact_persons")
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
  contact_persons: "created_at",
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

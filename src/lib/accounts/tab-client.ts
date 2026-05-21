import { createClient } from "@/lib/supabase/client";
import type {
  AccountCrudInsert,
  AccountCrudRow,
  AccountCrudTableName,
  TabFetchResult,
  TabInsertResult,
} from "@/types/tab-crud";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";

const TABLE_ORDER: Record<AccountCrudTableName, string> = {
  sales_activities: "activity_date",
  contacts: "created_at",
  contact_persons: "created_at",
  products: "created_at",
  quotes: "quote_date",
  marketing_materials: "created_at",
  supply_chain: "created_at",
  account_projects: "created_at",
};

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseFieldValue(
  field: TabFormFieldDef,
  raw: string
): string | number | boolean | null {
  if (field.type === "boolean") {
    return raw === "true";
  }
  if (field.type === "number") {
    const num = Number(raw);
    return Number.isNaN(num) ? null : num;
  }
  return emptyToNull(raw);
}

function buildInsertPayload<T extends AccountCrudTableName>(
  table: T,
  accountId: string,
  values: Record<string, string>,
  fields: TabFormFieldDef[],
  userId: string | undefined
): AccountCrudInsert<T> {
  const payload: Record<string, unknown> = { account_id: accountId };

  for (const field of fields) {
    payload[field.name] = parseFieldValue(field, values[field.name] ?? "");
  }

  if ((table === "sales_activities" || table === "quotes") && userId) {
    payload.created_by = userId;
  }

  return payload as AccountCrudInsert<T>;
}

async function fetchRowsForTable(
  table: AccountCrudTableName,
  accountId: string,
  orderColumn: string
): Promise<{ data: unknown[] | null; error: string | null }> {
  const supabase = createClient();

  switch (table) {
    case "account_projects": {
      const { data, error } = await supabase
        .from("account_projects")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    case "sales_activities": {
      const { data, error } = await supabase
        .from("sales_activities")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    case "contacts": {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    case "contact_persons": {
      const { data, error } = await supabase
        .from("contact_persons")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    case "products": {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    case "quotes": {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    case "marketing_materials": {
      const { data, error } = await supabase
        .from("marketing_materials")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    case "supply_chain": {
      const { data, error } = await supabase
        .from("supply_chain")
        .select("*")
        .eq("account_id", accountId)
        .order(orderColumn, { ascending: false, nullsFirst: false });
      return { data, error: error?.message ?? null };
    }
    default: {
      const _exhaustive: never = table;
      return { data: null, error: `Unknown table: ${_exhaustive}` };
    }
  }
}

async function insertRowForTable<T extends AccountCrudTableName>(
  table: T,
  payload: AccountCrudInsert<T>
): Promise<string | null> {
  const supabase = createClient();

  switch (table) {
    case "account_projects": {
      const { error } = await supabase.from("account_projects").insert(payload as AccountCrudInsert<"account_projects">);
      return error?.message ?? null;
    }
    case "sales_activities": {
      const { error } = await supabase.from("sales_activities").insert(payload as AccountCrudInsert<"sales_activities">);
      return error?.message ?? null;
    }
    case "contacts": {
      const { error } = await supabase.from("contacts").insert(payload as AccountCrudInsert<"contacts">);
      return error?.message ?? null;
    }
    case "contact_persons": {
      const { error } = await supabase.from("contact_persons").insert(payload as AccountCrudInsert<"contact_persons">);
      return error?.message ?? null;
    }
    case "products": {
      const { error } = await supabase.from("products").insert(payload as AccountCrudInsert<"products">);
      return error?.message ?? null;
    }
    case "quotes": {
      const { error } = await supabase.from("quotes").insert(payload as AccountCrudInsert<"quotes">);
      return error?.message ?? null;
    }
    case "marketing_materials": {
      const { error } = await supabase.from("marketing_materials").insert(payload as AccountCrudInsert<"marketing_materials">);
      return error?.message ?? null;
    }
    case "supply_chain": {
      const { error } = await supabase.from("supply_chain").insert(payload as AccountCrudInsert<"supply_chain">);
      return error?.message ?? null;
    }
    default: {
      const _exhaustive: never = table;
      return `Unknown table: ${_exhaustive}`;
    }
  }
}

export async function fetchAccountTabRows<T extends AccountCrudTableName>(
  table: T,
  accountId: string
): Promise<TabFetchResult<T>> {
  const result = await fetchRowsForTable(table, accountId, TABLE_ORDER[table]);

  if (result.error) {
    return { data: null, error: result.error };
  }

  return {
    data: (result.data ?? []) as AccountCrudRow<T>[],
    error: null,
  };
}

export async function insertAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  accountId: string,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return { success: false, error: authError.message };
  }

  if (!user) {
    return { success: false, error: "You must be signed in to create records." };
  }

  const payload = buildInsertPayload(table, accountId, values, fields, user.id);
  const insertError = await insertRowForTable(table, payload);

  if (insertError) {
    return { success: false, error: insertError };
  }

  return { success: true, error: null };
}

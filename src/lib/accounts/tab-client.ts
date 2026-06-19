import { createClient } from "@/lib/supabase/client";
import type {
  AccountCrudInsert,
  AccountCrudRow,
  AccountCrudTableName,
  TabFetchResult,
  TabInsertResult,
} from "@/types/tab-crud";
import type { BrandOverviewResult } from "@/types/account-detail";
import { isProjectScopedTable } from "@/lib/accounts/project-utils";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";
import type { Tables } from "@/types/database.types";
import type { TablesUpdate } from "@/types/database.types";

export type AccountProjectsFetchResult =
  | { data: Tables<"account_projects">[]; error: null }
  | { data: null; error: string };

const TABLE_ORDER: Record<AccountCrudTableName, string> = {
  sales_activities: "activity_date",
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

  if (isProjectScopedTable(table) && values.project_id !== undefined) {
    payload.project_id = emptyToNull(values.project_id);
  }

  return payload as AccountCrudInsert<T>;
}

function buildUpdatePayload<T extends AccountCrudTableName>(
  table: T,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): TablesUpdate<T> {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    payload[field.name] = parseFieldValue(field, values[field.name] ?? "");
  }

  if (isProjectScopedTable(table) && values.project_id !== undefined) {
    payload.project_id = emptyToNull(values.project_id);
  }

  return payload as TablesUpdate<T>;
}

const RLS_FIX_HINT =
  " Run supabase/scripts/fix_account_tab_permissions.sql in the Supabase SQL Editor.";

const UPDATE_BLOCKED_MESSAGE =
  "Update was blocked. Your user may not be signed in, or Supabase needs UPDATE permission (RLS + GRANT)." +
  RLS_FIX_HINT;

const DELETE_BLOCKED_MESSAGE =
  "Delete was blocked. Your user may not be signed in, or Supabase needs DELETE permission (RLS + GRANT)." +
  RLS_FIX_HINT;

function formatDbError(error: { message: string; details?: string; hint?: string }): string {
  const parts = [error.message];
  if (error.details) parts.push(error.details);
  if (error.hint) parts.push(error.hint);
  return parts.join(" ");
}

async function confirmMutation(
  data: { id: string }[] | null,
  error: { message: string; details?: string; hint?: string } | null,
  blockedMessage: string
): Promise<string | null> {
  if (error) {
    return formatDbError(error);
  }
  if (!data?.length) {
    return blockedMessage;
  }
  return null;
}

function confirmDelete(
  data: { id: string }[] | null,
  error: { message: string; details?: string; hint?: string } | null
) {
  return confirmMutation(data, error, DELETE_BLOCKED_MESSAGE);
}

type PublicTableName =
  | "account_projects"
  | "sales_activities"
  | "contact_persons"
  | "products"
  | "quotes"
  | "marketing_materials"
  | "supply_chain"
  | "brand_overview";

async function confirmUpdateForTable(
  table: PublicTableName,
  recordId: string,
  data: { id: string }[] | null,
  error: { message: string; details?: string; hint?: string } | null
): Promise<string | null> {
  if (error) {
    return formatDbError(error);
  }
  if (data?.length) {
    return null;
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return authError.message;
  }
  if (!user) {
    return "You must be signed in to save changes. Please log in and try again.";
  }

  const { data: existing, error: readError } = await supabase
    .from(table)
    .select("id")
    .eq("id", recordId)
    .maybeSingle();

  if (readError) {
    return formatDbError(readError);
  }
  if (!existing) {
    return "Record not found. It may have been deleted.";
  }

  return UPDATE_BLOCKED_MESSAGE;
}

async function updateRowForTable<T extends AccountCrudTableName>(
  table: T,
  id: string,
  payload: TablesUpdate<T>
): Promise<string | null> {
  if (!id?.trim()) {
    return "Invalid record id.";
  }

  const supabase = createClient();

  switch (table) {
    case "account_projects": {
      const { data, error } = await supabase
        .from("account_projects")
        .update(payload as TablesUpdate<"account_projects">)
        .eq("id", id)
        .select("id");
      return confirmUpdateForTable("account_projects", id, data, error);
    }
    case "sales_activities": {
      const { data, error } = await supabase
        .from("sales_activities")
        .update(payload as TablesUpdate<"sales_activities">)
        .eq("id", id)
        .select("id");
      return confirmUpdateForTable("sales_activities", id, data, error);
    }
    case "contact_persons": {
      const { data, error } = await supabase
        .from("contact_persons")
        .update(payload as TablesUpdate<"contact_persons">)
        .eq("id", id)
        .select("id");
      return confirmUpdateForTable("contact_persons", id, data, error);
    }
    case "products": {
      const { data, error } = await supabase
        .from("products")
        .update(payload as TablesUpdate<"products">)
        .eq("id", id)
        .select("id");
      return confirmUpdateForTable("products", id, data, error);
    }
    case "quotes": {
      const { data, error } = await supabase
        .from("quotes")
        .update(payload as TablesUpdate<"quotes">)
        .eq("id", id)
        .select("id");
      return confirmUpdateForTable("quotes", id, data, error);
    }
    case "marketing_materials": {
      const { data, error } = await supabase
        .from("marketing_materials")
        .update(payload as TablesUpdate<"marketing_materials">)
        .eq("id", id)
        .select("id");
      return confirmUpdateForTable("marketing_materials", id, data, error);
    }
    case "supply_chain": {
      const { data, error } = await supabase
        .from("supply_chain")
        .update(payload as TablesUpdate<"supply_chain">)
        .eq("id", id)
        .select("id");
      return confirmUpdateForTable("supply_chain", id, data, error);
    }
    default: {
      const _exhaustive: never = table;
      return `Unknown table: ${_exhaustive}`;
    }
  }
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
        .order(orderColumn, { ascending: true, nullsFirst: false });
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
): Promise<{ error: string | null; id?: string }> {
  const supabase = createClient();

  switch (table) {
    case "account_projects": {
      const { data, error } = await supabase
        .from("account_projects")
        .insert(payload as AccountCrudInsert<"account_projects">)
        .select("id")
        .single();
      return { error: error?.message ?? null, id: data?.id };
    }
    case "sales_activities": {
      const { data, error } = await supabase
        .from("sales_activities")
        .insert(payload as AccountCrudInsert<"sales_activities">)
        .select("id")
        .single();
      return { error: error?.message ?? null, id: data?.id };
    }
    case "contact_persons": {
      const { data, error } = await supabase
        .from("contact_persons")
        .insert(payload as AccountCrudInsert<"contact_persons">)
        .select("id")
        .single();
      return { error: error?.message ?? null, id: data?.id };
    }
    case "products": {
      const { data, error } = await supabase
        .from("products")
        .insert(payload as AccountCrudInsert<"products">)
        .select("id")
        .single();
      return { error: error?.message ?? null, id: data?.id };
    }
    case "quotes": {
      const { data, error } = await supabase
        .from("quotes")
        .insert(payload as AccountCrudInsert<"quotes">)
        .select("id")
        .single();
      return { error: error?.message ?? null, id: data?.id };
    }
    case "marketing_materials": {
      const { data, error } = await supabase
        .from("marketing_materials")
        .insert(payload as AccountCrudInsert<"marketing_materials">)
        .select("id")
        .single();
      return { error: error?.message ?? null, id: data?.id };
    }
    case "supply_chain": {
      const { data, error } = await supabase
        .from("supply_chain")
        .insert(payload as AccountCrudInsert<"supply_chain">)
        .select("id")
        .single();
      return { error: error?.message ?? null, id: data?.id };
    }
    default: {
      const _exhaustive: never = table;
      return { error: `Unknown table: ${_exhaustive}` };
    }
  }
}

function buildBrandOverviewPayload(
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): TablesUpdate<"brand_overview"> {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    payload[field.name] = parseFieldValue(field, values[field.name] ?? "");
  }
  return payload as TablesUpdate<"brand_overview">;
}

export async function updateBrandOverview(
  id: string,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  const supabase = createClient();
  const payload = buildBrandOverviewPayload(values, fields);
  const { data, error } = await supabase
    .from("brand_overview")
    .update(payload)
    .eq("id", id)
    .select("id");

  if (error) {
    return { success: false, error: formatDbError(error) };
  }

  if (!data?.length) {
    const blocked = await confirmUpdateForTable("brand_overview", id, data, error);
    return { success: false, error: blocked ?? UPDATE_BLOCKED_MESSAGE };
  }

  return { success: true, error: null };
}

export async function insertBrandOverview(
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
    return { success: false, error: "You must be signed in to save brand overview." };
  }

  const payload = {
    account_id: accountId,
    ...buildBrandOverviewPayload(values, fields),
  };

  const { data, error } = await supabase
    .from("brand_overview")
    .insert(payload)
    .select("id");

  if (error) {
    return { success: false, error: formatDbError(error) };
  }

  if (!data?.length) {
    return {
      success: false,
      error: "Insert was not applied. Check permissions or try again.",
    };
  }

  return { success: true, error: null };
}

export async function saveBrandOverview(
  accountId: string,
  recordId: string | null,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  if (recordId) {
    return updateBrandOverview(recordId, values, fields);
  }
  return insertBrandOverview(accountId, values, fields);
}

export async function updateAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  id: string,
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
    return {
      success: false,
      error: "You must be signed in to save changes. Please log in and try again.",
    };
  }

  const payload = buildUpdatePayload<T>(table, values, fields);
  const updateError = await updateRowForTable(table, id, payload);

  if (updateError) {
    return { success: false, error: updateError };
  }

  return { success: true, error: null };
}

export async function patchAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  id: string,
  patch: TablesUpdate<T>
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
    return {
      success: false,
      error: "You must be signed in to save changes. Please log in and try again.",
    };
  }

  const updateError = await updateRowForTable(table, id, patch);
  if (updateError) {
    return { success: false, error: updateError };
  }

  return { success: true, error: null };
}

async function deleteRowForTable<T extends AccountCrudTableName>(
  table: T,
  id: string
): Promise<string | null> {
  const supabase = createClient();

  switch (table) {
    case "account_projects": {
      const { data, error } = await supabase
        .from("account_projects")
        .delete()
        .eq("id", id)
        .select("id");
      return confirmDelete(data, error);
    }
    case "sales_activities": {
      const { data, error } = await supabase
        .from("sales_activities")
        .delete()
        .eq("id", id)
        .select("id");
      return confirmDelete(data, error);
    }
    case "contact_persons": {
      const { data, error } = await supabase
        .from("contact_persons")
        .delete()
        .eq("id", id)
        .select("id");
      return confirmDelete(data, error);
    }
    case "products": {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select("id");
      return confirmDelete(data, error);
    }
    case "quotes": {
      const { data, error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", id)
        .select("id");
      return confirmDelete(data, error);
    }
    case "marketing_materials": {
      const { data, error } = await supabase
        .from("marketing_materials")
        .delete()
        .eq("id", id)
        .select("id");
      return confirmDelete(data, error);
    }
    case "supply_chain": {
      const { data, error } = await supabase
        .from("supply_chain")
        .delete()
        .eq("id", id)
        .select("id");
      return confirmDelete(data, error);
    }
    default: {
      const _exhaustive: never = table;
      return `Unknown table: ${_exhaustive}`;
    }
  }
}

export async function deleteAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  id: string
): Promise<TabInsertResult> {
  const deleteError = await deleteRowForTable(table, id);
  if (deleteError) {
    return { success: false, error: deleteError };
  }
  return { success: true, error: null };
}

export async function fetchAccountProjects(
  accountId: string
): Promise<AccountProjectsFetchResult> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("account_projects")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: true, nullsFirst: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data ?? [], error: null };
}

export async function fetchBrandOverview(
  accountId: string
): Promise<BrandOverviewResult> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brand_overview")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(1);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data?.[0] ?? null, error: null };
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

export async function fetchAccountTabRowById<T extends AccountCrudTableName>(
  table: T,
  id: string
): Promise<{ data: AccountCrudRow<T> | null; error: string | null }> {
  const supabase = createClient();
  let data: unknown = null;
  let error: { message: string } | null = null;

  switch (table) {
    case "account_projects": {
      const result = await supabase
        .from("account_projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      data = result.data;
      error = result.error;
      break;
    }
    case "sales_activities": {
      const result = await supabase
        .from("sales_activities")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      data = result.data;
      error = result.error;
      break;
    }
    case "contact_persons": {
      const result = await supabase
        .from("contact_persons")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      data = result.data;
      error = result.error;
      break;
    }
    case "products": {
      const result = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      data = result.data;
      error = result.error;
      break;
    }
    case "quotes": {
      const result = await supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      data = result.data;
      error = result.error;
      break;
    }
    case "marketing_materials": {
      const result = await supabase
        .from("marketing_materials")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      data = result.data;
      error = result.error;
      break;
    }
    case "supply_chain": {
      const result = await supabase
        .from("supply_chain")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      data = result.data;
      error = result.error;
      break;
    }
    default: {
      const _exhaustive: never = table;
      return { data: null, error: `Unknown table: ${_exhaustive}` };
    }
  }

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: (data as AccountCrudRow<T> | null) ?? null,
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
  const insertResult = await insertRowForTable(table, payload);

  if (insertResult.error) {
    return { success: false, error: insertResult.error };
  }

  return { success: true, error: null, id: insertResult.id };
}

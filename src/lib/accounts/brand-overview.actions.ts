"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRecordValues } from "@/lib/sanitize";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";
import type { TabInsertResult } from "@/types/tab-crud";
import type { TablesUpdate } from "@/types/database.types";

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

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return { supabase, user: null, error: error?.message ?? "You must be signed in." };
  }
  return { supabase, user, error: null };
}

export async function updateBrandOverviewAction(
  id: string,
  accountId: string,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  const auth = await requireUser();
  if (!auth.user) {
    return { success: false, error: auth.error };
  }

  const payload = buildBrandOverviewPayload(sanitizeRecordValues(values), fields);
  const { data, error } = await auth.supabase
    .from("brand_overview")
    .update(payload)
    .eq("id", id)
    .select("id");

  if (error) {
    return { success: false, error: error.message };
  }
  if (!data?.length) {
    return { success: false, error: "Update was not applied." };
  }

  revalidatePath(`/sales-system/accounts/${accountId}`);
  return { success: true, error: null };
}

export async function insertBrandOverviewAction(
  accountId: string,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  const auth = await requireUser();
  if (!auth.user) {
    return { success: false, error: auth.error };
  }

  const payload = {
    account_id: accountId,
    ...buildBrandOverviewPayload(sanitizeRecordValues(values), fields),
  };

  const { data, error } = await auth.supabase
    .from("brand_overview")
    .insert(payload)
    .select("id");

  if (error) {
    return { success: false, error: error.message };
  }
  if (!data?.length) {
    return { success: false, error: "Insert was not applied." };
  }

  revalidatePath(`/sales-system/accounts/${accountId}`);
  return { success: true, error: null };
}

export async function saveBrandOverviewAction(
  accountId: string,
  recordId: string | null,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  if (recordId) {
    return updateBrandOverviewAction(recordId, accountId, values, fields);
  }
  return insertBrandOverviewAction(accountId, values, fields);
}

export async function fetchBrandOverviewAction(accountId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brand_overview")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

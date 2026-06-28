"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mapTabWriteToPayload } from "@/lib/accounts/tab-payload";
import { sanitizeRecordValues } from "@/lib/sanitize";
import { validateTabWrite } from "@/schemas/tab.schemas";
import type { AccountCrudTableName, TabInsertResult } from "@/types/tab-crud";
import type { TablesUpdate } from "@/types/database.types";

const RLS_HINT =
  " Run supabase/scripts/fix_account_tab_permissions.sql in the Supabase SQL Editor.";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

function tableDb(supabase: SupabaseServer, table: AccountCrudTableName) {
  return supabase.from(table) as ReturnType<SupabaseServer["from"]>;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return { supabase, user: null, error: error.message };
  if (!user) {
    return {
      supabase,
      user: null,
      error: "You must be signed in to save changes.",
    };
  }
  return { supabase, user, error: null };
}

async function fetchRowSnapshot(
  table: AccountCrudTableName,
  id: string
): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  return data as Record<string, unknown> | null;
}

export async function insertAccountTabRowAction<T extends AccountCrudTableName>(
  table: T,
  accountId: string,
  values: Record<string, string>
): Promise<TabInsertResult> {
  const sanitized = sanitizeRecordValues(values);
  const validated = validateTabWrite(table, sanitized);
  if (!validated.success) {
    return { success: false, error: validated.error };
  }

  const auth = await requireUser();
  if (!auth.user) {
    return { success: false, error: auth.error };
  }

  const payload = mapTabWriteToPayload(table, validated.data, {
    accountId,
    userId: auth.user.id,
  });

  const { data, error } = await tableDb(auth.supabase, table)
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message + RLS_HINT };
  }

  const inserted = data as unknown as { id: string } | null;

  if (!inserted?.id) {
    return { success: false, error: "Insert was not applied." + RLS_HINT };
  }

  revalidatePath(`/sales-system/accounts/${accountId}`);
  return { success: true, error: null, id: inserted.id };
}

export async function updateAccountTabRowAction<T extends AccountCrudTableName>(
  table: T,
  id: string,
  accountId: string,
  values: Record<string, string>
): Promise<TabInsertResult> {
  const sanitized = sanitizeRecordValues(values);
  const validated = validateTabWrite(table, sanitized);
  if (!validated.success) {
    return { success: false, error: validated.error };
  }

  const auth = await requireUser();
  if (!auth.user) {
    return { success: false, error: auth.error };
  }

  const beforeRow = await fetchRowSnapshot(table, id);
  const payload = mapTabWriteToPayload(table, validated.data);

  const { data, error } = await tableDb(auth.supabase, table)
    .update(payload)
    .eq("id", id)
    .select("id");

  if (error) {
    return { success: false, error: error.message + RLS_HINT };
  }
  if (!data?.length) {
    return { success: false, error: "Update was not applied." + RLS_HINT };
  }

  revalidatePath(
    `/sales-system/accounts/${String(beforeRow?.account_id ?? accountId)}`
  );
  return { success: true, error: null };
}

export async function deleteAccountTabRowAction<T extends AccountCrudTableName>(
  table: T,
  id: string,
  accountId: string
): Promise<TabInsertResult> {
  const auth = await requireUser();
  if (!auth.user) {
    return { success: false, error: auth.error };
  }

  const beforeRow = await fetchRowSnapshot(table, id);

  const { data, error } = await tableDb(auth.supabase, table)
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return { success: false, error: error.message + RLS_HINT };
  }
  if (!data?.length) {
    return { success: false, error: "Delete was not applied." + RLS_HINT };
  }

  revalidatePath(
    `/sales-system/accounts/${String(beforeRow?.account_id ?? accountId)}`
  );
  return { success: true, error: null };
}

export async function patchAccountTabRowAction<T extends AccountCrudTableName>(
  table: T,
  id: string,
  accountId: string,
  patch: TablesUpdate<T>
): Promise<TabInsertResult> {
  const auth = await requireUser();
  if (!auth.user) {
    return { success: false, error: auth.error };
  }

  const beforeRow = await fetchRowSnapshot(table, id);
  const { data, error } = await tableDb(auth.supabase, table)
    .update(patch)
    .eq("id", id)
    .select("id");

  if (error) {
    return { success: false, error: error.message + RLS_HINT };
  }
  if (!data?.length) {
    return { success: false, error: "Update was not applied." + RLS_HINT };
  }

  revalidatePath(
    `/sales-system/accounts/${String(beforeRow?.account_id ?? accountId)}`
  );
  return { success: true, error: null };
}

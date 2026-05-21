"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createAccountSchema,
  type CreateAccountFormValues,
} from "@/lib/validations/account";
import type { TablesInsert } from "@/types/database.types";

export type CreateAccountActionResult =
  | { success: true; accountId: string }
  | { success: false; error: string };

export async function createAccount(
  values: CreateAccountFormValues
): Promise<CreateAccountActionResult> {
  const parsed = createAccountSchema.safeParse(values);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid form data";
    return { success: false, error: message };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be signed in to create an account." };
  }

  const payload: TablesInsert<"accounts"> = {
    brand_name: parsed.data.brandName,
    business_category_id: parsed.data.businessCategoryId,
    stage_id: parsed.data.stageId,
    source: parsed.data.source,
    status: parsed.data.status?.trim() || "active",
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("accounts")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/sales-system/accounts");
  revalidatePath(`/sales-system/accounts/${data.id}`);

  return { success: true, accountId: data.id };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FollowUpDraft } from "@/lib/follow-ups/draft";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error(error?.message ?? "You must be signed in.");
  }
  return { supabase, user };
}

export async function createFollowUpItemAction(input: {
  salesActivityId: string;
  accountId: string;
  assignedUserId: string;
  dueDate: string;
  notes?: string | null;
}): Promise<void> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("follow_up_items").insert({
    sales_activity_id: input.salesActivityId,
    account_id: input.accountId,
    assigned_user_id: input.assignedUserId,
    due_date: input.dueDate,
    notes: input.notes?.trim() || null,
    created_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/sales-system/follow-ups");
  revalidatePath(`/sales-system/accounts/${input.accountId}`);
}

export async function markFollowUpItemCompleteAction(
  itemId: string,
  completed: boolean
): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("follow_up_items")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/sales-system/follow-ups");
  revalidatePath("/sales-system/dashboard");
}

export async function updateFollowUpItemAction(
  itemId: string,
  input: { dueDate: string; notes?: string | null }
): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("follow_up_items")
    .update({
      due_date: input.dueDate,
      notes: input.notes?.trim() || null,
    })
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/sales-system/follow-ups");
}

export async function deleteFollowUpItemAction(itemId: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("follow_up_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/sales-system/follow-ups");
}

export async function createFollowUpDraftsAction(
  activityId: string,
  accountId: string,
  drafts: FollowUpDraft[]
): Promise<void> {
  for (const draft of drafts) {
    await createFollowUpItemAction({
      salesActivityId: activityId,
      accountId,
      assignedUserId: draft.assignedUserId,
      dueDate: draft.dueDate,
      notes: draft.notes,
    });
  }
}

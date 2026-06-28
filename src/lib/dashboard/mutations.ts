"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { markFollowUpItemCompleteAction } from "@/lib/follow-ups/mutations";
import type {
  DashboardDismissKind,
  DashboardReadItemType,
} from "@/lib/dashboard/types";

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

export async function markDashboardItemReadAction(
  userId: string,
  itemType: DashboardReadItemType,
  itemId: string
): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("user_dashboard_reads").upsert(
    {
      user_id: userId,
      item_type: itemType,
      item_id: itemId,
      read_at: new Date().toISOString(),
    },
    { onConflict: "user_id,item_type,item_id" }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/sales-system/dashboard");
}

export async function dismissDashboardItemAction(
  userId: string,
  kind: DashboardDismissKind,
  itemId: string
): Promise<void> {
  if (kind === "follow_up") {
    await markFollowUpItemCompleteAction(itemId, true);
    return;
  }
  await markDashboardItemReadAction(userId, kind, itemId);
}

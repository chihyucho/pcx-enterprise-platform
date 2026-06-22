import { createClient } from "@/lib/supabase/client";
import type { FollowUpDraft } from "@/lib/follow-ups/draft";
import type {
  ActivityFollowUpItem,
  AssignableUser,
  FollowUpItem,
} from "@/lib/follow-ups/types";

type AccountJoin = { brand_name: string } | null;
type ActivityJoin = { subject: string | null } | null;

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
};

function accountName(accounts: AccountJoin): string {
  return accounts?.brand_name?.trim() || "Unknown account";
}

function profileLabel(
  profilesById: Map<string, ProfileRow>,
  userId: string
): string {
  const profile = profilesById.get(userId);
  const name = profile?.full_name?.trim();
  if (name) return name;
  const email = profile?.email?.trim();
  if (email) return email;
  return userId.slice(0, 8);
}

async function fetchProfilesMap(
  userIds: string[]
): Promise<Map<string, ProfileRow>> {
  if (userIds.length === 0) {
    return new Map();
  }

  const supabase = createClient();
  const uniqueIds = [...new Set(userIds)];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", uniqueIds);

  if (error) {
    throw new Error(error.message);
  }

  return new Map((data ?? []).map((row) => [row.id, row]));
}

export async function fetchAssignableUsers(): Promise<AssignableUser[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .order("full_name", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  return rows.map((row) => ({
    id: row.id,
    label: profileLabel(new Map(rows.map((r) => [r.id, r])), row.id),
  }));
}

export async function fetchFollowUpsForUser(
  userId: string
): Promise<FollowUpItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("follow_up_items")
    .select(
      `
      id,
      sales_activity_id,
      account_id,
      assigned_user_id,
      due_date,
      notes,
      sales_activities(subject),
      accounts(brand_name)
    `
    )
    .eq("assigned_user_id", userId)
    .is("completed_at", null)
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  const profilesById = await fetchProfilesMap(
    rows.map((row) => row.assigned_user_id)
  );

  return rows.map((row) => ({
    id: row.id,
    salesActivityId: row.sales_activity_id,
    subject: (row.sales_activities as ActivityJoin)?.subject ?? null,
    dueDate: row.due_date,
    accountId: row.account_id,
    accountName: accountName(row.accounts as AccountJoin),
    assignedUserId: row.assigned_user_id,
    assignedUserName: profileLabel(profilesById, row.assigned_user_id),
    notes: row.notes,
    completedAt: null,
  }));
}

export async function fetchCompletedFollowUpsForUser(
  userId: string
): Promise<FollowUpItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("follow_up_items")
    .select(
      `
      id,
      sales_activity_id,
      account_id,
      assigned_user_id,
      due_date,
      notes,
      completed_at,
      sales_activities(subject),
      accounts(brand_name)
    `
    )
    .eq("assigned_user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  const profilesById = await fetchProfilesMap(
    rows.map((row) => row.assigned_user_id)
  );

  return rows.map((row) => ({
    id: row.id,
    salesActivityId: row.sales_activity_id,
    subject: (row.sales_activities as ActivityJoin)?.subject ?? null,
    dueDate: row.due_date,
    accountId: row.account_id,
    accountName: accountName(row.accounts as AccountJoin),
    assignedUserId: row.assigned_user_id,
    assignedUserName: profileLabel(profilesById, row.assigned_user_id),
    notes: row.notes,
    completedAt: row.completed_at,
  }));
}

export async function fetchFollowUpsForActivity(
  activityId: string
): Promise<ActivityFollowUpItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("follow_up_items")
    .select("id, due_date, assigned_user_id, notes, completed_at")
    .eq("sales_activity_id", activityId)
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  const profilesById = await fetchProfilesMap(
    rows.map((row) => row.assigned_user_id)
  );

  return rows.map((row) => ({
    id: row.id,
    dueDate: row.due_date,
    assignedUserId: row.assigned_user_id,
    assignedUserName: profileLabel(profilesById, row.assigned_user_id),
    notes: row.notes,
    completedAt: row.completed_at,
  }));
}

export async function createFollowUpItem(input: {
  salesActivityId: string;
  accountId: string;
  assignedUserId: string;
  dueDate: string;
  notes?: string | null;
  createdBy?: string | null;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("follow_up_items").insert({
    sales_activity_id: input.salesActivityId,
    account_id: input.accountId,
    assigned_user_id: input.assignedUserId,
    due_date: input.dueDate,
    notes: input.notes?.trim() || null,
    created_by: input.createdBy ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function markFollowUpItemComplete(
  itemId: string,
  completed: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("follow_up_items")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateFollowUpItem(
  itemId: string,
  input: { dueDate: string; notes?: string | null }
): Promise<void> {
  const supabase = createClient();
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
}

export async function createFollowUpDrafts(
  activityId: string,
  accountId: string,
  drafts: FollowUpDraft[],
  createdBy?: string | null
): Promise<void> {
  for (const draft of drafts) {
    await createFollowUpItem({
      salesActivityId: activityId,
      accountId,
      assignedUserId: draft.assignedUserId,
      dueDate: draft.dueDate,
      notes: draft.notes,
      createdBy: createdBy ?? null,
    });
  }
}

export async function deleteFollowUpItem(itemId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("follow_up_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }
}

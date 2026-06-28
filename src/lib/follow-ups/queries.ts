"use server";

import { fetchUnifiedData } from "@/lib/data/unified-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/data/pagination-core";
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

type FollowUpRow = {
  id: string;
  sales_activity_id: string;
  account_id: string;
  assigned_user_id: string;
  due_date: string;
  notes: string | null;
  completed_at: string | null;
  sales_activities: ActivityJoin;
  accounts: AccountJoin;
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

  const uniqueIds = [...new Set(userIds)];
  const result = await fetchUnifiedData<ProfileRow>({
    table: "profiles",
    page: 1,
    pageSize: Math.max(uniqueIds.length, DEFAULT_PAGE_SIZE),
    filters: { id__in: uniqueIds },
  });

  if (result.error || !result.data) {
    throw new Error(result.error ?? "Failed to load profiles");
  }

  return new Map(result.data.items.map((row) => [row.id, row]));
}

function mapFollowUpRow(
  row: FollowUpRow,
  profilesById: Map<string, ProfileRow>
): FollowUpItem {
  return {
    id: row.id,
    salesActivityId: row.sales_activity_id,
    subject: row.sales_activities?.subject ?? null,
    dueDate: row.due_date,
    accountId: row.account_id,
    accountName: accountName(row.accounts),
    assignedUserId: row.assigned_user_id,
    assignedUserName: profileLabel(profilesById, row.assigned_user_id),
    notes: row.notes,
    completedAt: row.completed_at,
  };
}

export async function fetchAssignableUsersAction(): Promise<AssignableUser[]> {
  const result = await fetchUnifiedData<ProfileRow>({
    table: "profiles",
    page: 1,
    pageSize: 500,
  });

  if (result.error || !result.data) {
    throw new Error(result.error ?? "Failed to load users");
  }

  const rows = result.data.items;
  const profilesById = new Map(rows.map((row) => [row.id, row]));
  return rows.map((row) => ({
    id: row.id,
    label: profileLabel(profilesById, row.id),
  }));
}

export async function fetchFollowUpsForUserAction(
  userId: string,
  page = 1
): Promise<{ items: FollowUpItem[]; total: number; totalPages: number }> {
  const result = await fetchUnifiedData<FollowUpRow>({
    table: "follow_up_items",
    page,
    filters: {
      assigned_user_id: userId,
      completed: false,
    },
    orderBy: { column: "due_date", ascending: true },
  });

  if (result.error || !result.data) {
    throw new Error(result.error ?? "Failed to load follow-ups");
  }

  const profilesById = await fetchProfilesMap(
    result.data.items.map((row) => row.assigned_user_id)
  );

  return {
    items: result.data.items.map((row) => mapFollowUpRow(row, profilesById)),
    total: result.data.total,
    totalPages: result.data.totalPages,
  };
}

export async function fetchCompletedFollowUpsForUserAction(
  userId: string,
  page = 1
): Promise<{ items: FollowUpItem[]; total: number; totalPages: number }> {
  const result = await fetchUnifiedData<FollowUpRow>({
    table: "follow_up_items",
    page,
    filters: {
      assigned_user_id: userId,
      completed: true,
    },
    orderBy: { column: "completed_at", ascending: false },
  });

  if (result.error || !result.data) {
    throw new Error(result.error ?? "Failed to load completed follow-ups");
  }

  const profilesById = await fetchProfilesMap(
    result.data.items.map((row) => row.assigned_user_id)
  );

  return {
    items: result.data.items.map((row) => mapFollowUpRow(row, profilesById)),
    total: result.data.total,
    totalPages: result.data.totalPages,
  };
}

export async function fetchFollowUpsForActivityAction(
  activityId: string,
  page = 1
): Promise<ActivityFollowUpItem[]> {
  const result = await fetchUnifiedData<{
    id: string;
    due_date: string;
    assigned_user_id: string;
    notes: string | null;
    completed_at: string | null;
  }>({
    table: "follow_up_items",
    page,
    select: "id, due_date, assigned_user_id, notes, completed_at",
    filters: { sales_activity_id: activityId },
    orderBy: { column: "due_date", ascending: true },
  });

  if (result.error || !result.data) {
    throw new Error(result.error ?? "Failed to load activity follow-ups");
  }

  const profilesById = await fetchProfilesMap(
    result.data.items.map((row) => row.assigned_user_id)
  );

  return result.data.items.map((row) => ({
    id: row.id,
    dueDate: row.due_date,
    assignedUserId: row.assigned_user_id,
    assignedUserName: profileLabel(profilesById, row.assigned_user_id),
    notes: row.notes,
    completedAt: row.completed_at,
  }));
}

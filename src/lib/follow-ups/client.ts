import {
  createFollowUpDraftsAction,
  createFollowUpItemAction,
  deleteFollowUpItemAction,
  markFollowUpItemCompleteAction,
  updateFollowUpItemAction,
} from "@/lib/follow-ups/mutations";
import {
  fetchAssignableUsersAction,
  fetchCompletedFollowUpsForUserAction,
  fetchFollowUpsForActivityAction,
  fetchFollowUpsForUserAction,
} from "@/lib/follow-ups/queries";
import type { FollowUpDraft } from "@/lib/follow-ups/draft";

export async function fetchAssignableUsers() {
  return fetchAssignableUsersAction();
}

export async function fetchFollowUpsForUser(userId: string, page = 1) {
  const result = await fetchFollowUpsForUserAction(userId, page);
  return result.items;
}

export async function fetchCompletedFollowUpsForUser(userId: string, page = 1) {
  const result = await fetchCompletedFollowUpsForUserAction(userId, page);
  return result.items;
}

export async function fetchFollowUpsPageForUser(userId: string, page = 1) {
  return fetchFollowUpsForUserAction(userId, page);
}

export async function fetchCompletedFollowUpsPageForUser(
  userId: string,
  page = 1
) {
  return fetchCompletedFollowUpsForUserAction(userId, page);
}

export async function fetchFollowUpsForActivity(activityId: string, page = 1) {
  return fetchFollowUpsForActivityAction(activityId, page);
}

export async function createFollowUpItem(input: {
  salesActivityId: string;
  accountId: string;
  assignedUserId: string;
  dueDate: string;
  notes?: string | null;
  createdBy?: string | null;
}): Promise<void> {
  await createFollowUpItemAction(input);
}

export async function markFollowUpItemComplete(
  itemId: string,
  completed: boolean
): Promise<void> {
  await markFollowUpItemCompleteAction(itemId, completed);
}

export async function updateFollowUpItem(
  itemId: string,
  input: { dueDate: string; notes?: string | null }
): Promise<void> {
  await updateFollowUpItemAction(itemId, input);
}

export async function createFollowUpDrafts(
  activityId: string,
  accountId: string,
  drafts: FollowUpDraft[],
  _createdBy?: string | null
): Promise<void> {
  await createFollowUpDraftsAction(activityId, accountId, drafts);
}

export async function deleteFollowUpItem(itemId: string): Promise<void> {
  await deleteFollowUpItemAction(itemId);
}

import { fetchDashboardDataAction } from "@/lib/dashboard/queries";
import {
  dismissDashboardItemAction,
  markDashboardItemReadAction,
} from "@/lib/dashboard/mutations";
import {
  fetchCompletedFollowUpsPageForUser,
  fetchFollowUpsPageForUser,
  markFollowUpItemComplete,
} from "@/lib/follow-ups/client";
import type {
  DashboardDismissKind,
  DashboardReadItemType,
} from "@/lib/dashboard/types";

export type { FollowUpItem } from "@/lib/follow-ups/types";
export { fetchFollowUpsForUser as fetchFollowUps } from "@/lib/follow-ups/client";
export { fetchCompletedFollowUpsForUser as fetchCompletedFollowUps } from "@/lib/follow-ups/client";
export { markFollowUpItemComplete as markFollowUpComplete } from "@/lib/follow-ups/client";

export async function fetchDashboardData(userId: string) {
  return fetchDashboardDataAction(userId);
}

export async function dismissDashboardItem(
  userId: string,
  kind: DashboardDismissKind,
  itemId: string
): Promise<void> {
  await dismissDashboardItemAction(userId, kind, itemId);
}

export async function markDashboardItemRead(
  userId: string,
  itemType: DashboardReadItemType,
  itemId: string
): Promise<void> {
  await markDashboardItemReadAction(userId, itemType, itemId);
}

export {
  fetchFollowUpsPageForUser,
  fetchCompletedFollowUpsPageForUser,
};

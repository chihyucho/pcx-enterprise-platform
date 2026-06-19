import type { AssignableUser } from "@/lib/follow-ups/types";

export type FollowUpDraft = {
  id: string;
  dueDate: string;
  assignedUserId: string;
  assignedUserName: string;
  notes: string | null;
};

export function pickDefaultAssignee(
  users: AssignableUser[],
  currentUserId: string | null
): string | undefined {
  if (users.length === 0) return undefined;
  if (currentUserId && users.some((user) => user.id === currentUserId)) {
    return currentUserId;
  }
  return users[0]?.id;
}

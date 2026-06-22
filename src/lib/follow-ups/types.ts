export type FollowUpItem = {
  id: string;
  salesActivityId: string;
  subject: string | null;
  dueDate: string;
  accountId: string;
  accountName: string;
  assignedUserId: string;
  assignedUserName: string;
  notes: string | null;
  completedAt?: string | null;
};

export type AssignableUser = {
  id: string;
  label: string;
};

export type ActivityFollowUpItem = {
  id: string;
  dueDate: string;
  assignedUserId: string;
  assignedUserName: string;
  notes: string | null;
  completedAt: string | null;
};

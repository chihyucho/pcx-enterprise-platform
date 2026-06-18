/** Status values that appear in the Pending Approval dashboard section. */
export const PENDING_APPROVAL_STATUSES = [
  "pending",
  "in_review",
  "on_hold",
] as const;

export type DashboardReadItemType =
  | "sales_activity"
  | "quote"
  | "product"
  | "marketing";

export type DashboardDismissKind = DashboardReadItemType | "follow_up";

export type FollowUpItem = {
  id: string;
  subject: string | null;
  nextFollowUp: string;
  accountId: string | null;
  accountName: string;
};

export type UnreadActivityItem = {
  id: string;
  subject: string | null;
  createdAt: string;
  accountId: string | null;
  accountName: string;
};

export type UnreadQuoteItem = {
  id: string;
  style: string | null;
  compound: string | null;
  createdAt: string;
  accountId: string | null;
  accountName: string;
};

export type PendingApprovalItem = {
  id: string;
  kind: "product" | "marketing";
  accountId: string | null;
  accountName: string;
  label: string;
  status: string;
};

export type DashboardData = {
  newActivities: UnreadActivityItem[];
  newQuotes: UnreadQuoteItem[];
  pendingApprovals: PendingApprovalItem[];
};

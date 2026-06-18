import { setSalesActivityFollowUpCompleted } from "@/lib/accounts/tab-client";
import { createClient } from "@/lib/supabase/client";
import { PENDING_APPROVAL_STATUSES } from "@/lib/dashboard/types";
import type {
  DashboardData,
  DashboardDismissKind,
  DashboardReadItemType,
  FollowUpItem,
  PendingApprovalItem,
  UnreadActivityItem,
  UnreadQuoteItem,
} from "@/lib/dashboard/types";

type AccountJoin = { brand_name: string } | null;

function accountName(accounts: AccountJoin): string {
  return accounts?.brand_name?.trim() || "Unknown account";
}

async function fetchReadIds(
  userId: string,
  itemType: DashboardReadItemType
): Promise<Set<string>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_dashboard_reads")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_type", itemType);

  if (error) {
    throw new Error(error.message);
  }

  return new Set((data ?? []).map((row) => row.item_id));
}

function mapFollowUpRows(
  rows: {
    id: string;
    subject: string | null;
    next_follow_up: string | null;
    account_id: string | null;
    accounts: AccountJoin;
  }[]
): FollowUpItem[] {
  return rows
    .filter((row) => row.next_follow_up)
    .map((row) => ({
      id: row.id,
      subject: row.subject,
      nextFollowUp: row.next_follow_up as string,
      accountId: row.account_id,
      accountName: accountName(row.accounts),
    }));
}

export async function fetchFollowUps(): Promise<FollowUpItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sales_activities")
    .select("id, subject, next_follow_up, account_id, accounts(brand_name)")
    .eq("follow_up_completed", false)
    .not("next_follow_up", "is", null)
    .order("next_follow_up", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return mapFollowUpRows(data ?? []);
}

export async function fetchDashboardData(
  userId: string
): Promise<DashboardData> {
  const supabase = createClient();

  const [
    activitiesResult,
    quotesResult,
    productsResult,
    marketingResult,
    activityReadIds,
    quoteReadIds,
  ] = await Promise.all([
    supabase
      .from("sales_activities")
      .select("id, subject, created_at, account_id, accounts(brand_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("quotes")
      .select(
        "id, style, compound, created_at, account_id, accounts(brand_name)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select(
        "id, product_number, product_category, approval_status, account_id, accounts(brand_name)"
      )
      .in("approval_status", [...PENDING_APPROVAL_STATUSES])
      .order("created_at", { ascending: false }),
    supabase
      .from("marketing_materials")
      .select("id, title, status, account_id, accounts(brand_name)")
      .in("status", [...PENDING_APPROVAL_STATUSES])
      .order("created_at", { ascending: false }),
    fetchReadIds(userId, "sales_activity"),
    fetchReadIds(userId, "quote"),
  ]);

  const errors = [
    activitiesResult.error,
    quotesResult.error,
    productsResult.error,
    marketingResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors[0]?.message ?? "Failed to load dashboard");
  }

  const newActivities: UnreadActivityItem[] = (activitiesResult.data ?? [])
    .filter((row) => row.created_at && !activityReadIds.has(row.id))
    .map((row) => ({
      id: row.id,
      subject: row.subject,
      createdAt: row.created_at as string,
      accountId: row.account_id,
      accountName: accountName(row.accounts as AccountJoin),
    }));

  const newQuotes: UnreadQuoteItem[] = (quotesResult.data ?? [])
    .filter((row) => !quoteReadIds.has(row.id))
    .map((row) => ({
      id: row.id,
      style: row.style,
      compound: row.compound,
      createdAt: row.created_at ?? new Date(0).toISOString(),
      accountId: row.account_id,
      accountName: accountName(row.accounts as AccountJoin),
    }));

  const pendingProducts: PendingApprovalItem[] = (productsResult.data ?? []).map(
    (row) => ({
      id: row.id,
      kind: "product" as const,
      accountId: row.account_id,
      accountName: accountName(row.accounts as AccountJoin),
      label:
        row.product_number?.trim() ||
        row.product_category?.trim() ||
        "Product",
      status: row.approval_status ?? "pending",
    }));

  const pendingMarketing: PendingApprovalItem[] = (
    marketingResult.data ?? []
  ).map((row) => ({
    id: row.id,
    kind: "marketing" as const,
    accountId: row.account_id,
    accountName: accountName(row.accounts as AccountJoin),
    label: row.title?.trim() || "Marketing material",
    status: row.status ?? "pending",
  }));

  const pendingApprovals = [...pendingProducts, ...pendingMarketing].sort(
    (a, b) => a.accountName.localeCompare(b.accountName)
  );

  return {
    newActivities,
    newQuotes,
    pendingApprovals,
  };
}

export async function markFollowUpComplete(activityId: string): Promise<void> {
  await setSalesActivityFollowUpCompleted(activityId, true);
}

export async function dismissDashboardItem(
  userId: string,
  kind: DashboardDismissKind,
  itemId: string
): Promise<void> {
  if (kind === "follow_up") {
    await markFollowUpComplete(itemId);
    return;
  }
  await markDashboardItemRead(userId, kind, itemId);
}

export async function markDashboardItemRead(
  userId: string,
  itemType: DashboardReadItemType,
  itemId: string
): Promise<void> {
  const supabase = createClient();
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
}

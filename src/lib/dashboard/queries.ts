"use server";

import { fetchUnifiedData } from "@/lib/data/unified-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/data/pagination-core";
import { PENDING_APPROVAL_STATUSES } from "@/lib/dashboard/types";
import type {
  DashboardData,
  DashboardReadItemType,
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
  const result = await fetchUnifiedData<{ item_id: string }>({
    table: "user_dashboard_reads",
    page: 1,
    pageSize: 1000,
    select: "item_id",
    filters: { user_id: userId, item_type: itemType },
  });

  if (result.error || !result.data) {
    throw new Error(result.error ?? "Failed to load dashboard reads");
  }

  return new Set(result.data.items.map((row) => row.item_id));
}

export async function fetchDashboardDataAction(
  userId: string
): Promise<DashboardData> {
  const pageSize = DEFAULT_PAGE_SIZE;

  const [
    activitiesResult,
    quotesResult,
    productsResult,
    marketingResult,
    activityReadIds,
    quoteReadIds,
  ] = await Promise.all([
    fetchUnifiedData<{
      id: string;
      subject: string | null;
      created_at: string | null;
      account_id: string;
      accounts: AccountJoin;
    }>({
      table: "sales_activities",
      page: 1,
      pageSize,
      select: "id, subject, created_at, account_id, accounts(brand_name)",
      orderBy: { column: "created_at", ascending: false },
    }),
    fetchUnifiedData<{
      id: string;
      style: string | null;
      compound: string | null;
      created_at: string | null;
      account_id: string;
      accounts: AccountJoin;
    }>({
      table: "quotes",
      page: 1,
      pageSize,
      select:
        "id, style, compound, created_at, account_id, accounts(brand_name)",
      orderBy: { column: "created_at", ascending: false },
    }),
    fetchUnifiedData<{
      id: string;
      product_number: string | null;
      product_category: string | null;
      approval_status: string | null;
      created_at: string | null;
      account_id: string;
      accounts: AccountJoin;
    }>({
      table: "products",
      page: 1,
      pageSize,
      select:
        "id, product_number, product_category, approval_status, created_at, account_id, accounts(brand_name)",
      filters: { approval_status__in: [...PENDING_APPROVAL_STATUSES] },
      orderBy: { column: "created_at", ascending: false },
    }),
    fetchUnifiedData<{
      id: string;
      title: string | null;
      status: string | null;
      created_at: string | null;
      account_id: string;
      accounts: AccountJoin;
    }>({
      table: "marketing_materials",
      page: 1,
      pageSize,
      select:
        "id, title, status, created_at, account_id, accounts(brand_name)",
      filters: { status__in: [...PENDING_APPROVAL_STATUSES] },
      orderBy: { column: "created_at", ascending: false },
    }),
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
    throw new Error(errors[0] ?? "Failed to load dashboard");
  }

  const activities = activitiesResult.data?.items ?? [];
  const quotes = quotesResult.data?.items ?? [];
  const products = productsResult.data?.items ?? [];
  const marketing = marketingResult.data?.items ?? [];

  const newActivities: UnreadActivityItem[] = activities
    .filter((row) => row.created_at && !activityReadIds.has(row.id))
    .map((row) => ({
      id: row.id,
      subject: row.subject,
      createdAt: row.created_at as string,
      accountId: row.account_id,
      accountName: accountName(row.accounts),
    }));

  const newQuotes: UnreadQuoteItem[] = quotes
    .filter((row) => !quoteReadIds.has(row.id))
    .map((row) => ({
      id: row.id,
      style: row.style,
      compound: row.compound,
      createdAt: row.created_at ?? new Date(0).toISOString(),
      accountId: row.account_id,
      accountName: accountName(row.accounts),
    }));

  const pendingProducts: PendingApprovalItem[] = products.map((row) => ({
    id: row.id,
    kind: "product" as const,
    accountId: row.account_id,
    accountName: accountName(row.accounts),
    label:
      row.product_number?.trim() ||
      row.product_category?.trim() ||
      "Product",
    status: row.approval_status ?? "pending",
    createdAt: row.created_at ?? new Date(0).toISOString(),
  }));

  const pendingMarketing: PendingApprovalItem[] = marketing.map((row) => ({
    id: row.id,
    kind: "marketing" as const,
    accountId: row.account_id,
    accountName: accountName(row.accounts),
    label: row.title?.trim() || "Marketing material",
    status: row.status ?? "pending",
    createdAt: row.created_at ?? new Date(0).toISOString(),
  }));

  const pendingApprovals = [...pendingProducts, ...pendingMarketing].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );

  return {
    newActivities,
    newQuotes,
    pendingApprovals,
  };
}

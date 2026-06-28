"use server";

import { formatAccountDate } from "@/lib/accounts/format";
import { fetchUnifiedData } from "@/lib/data/unified-query";
import { getStageOptions } from "@/lib/accounts/queries";
import type { AccountListItem } from "@/types/account";
import { ACCOUNT_LIST_SELECT, type AccountWithRelations } from "@/types/supabase";
import type { PageParams, PaginatedResult } from "@/lib/data/pagination-core";

function unwrapRelation<T>(value: T | T[] | null): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapAccountRow(row: AccountWithRelations): AccountListItem {
  const category = unwrapRelation(row.business_categories);
  const stage = unwrapRelation(row.stages);

  return {
    id: row.id,
    brandName: row.brand_name,
    categoryName: category?.category_name ?? "—",
    stageName: stage?.stage_name ?? "—",
    stageId: stage?.id ?? row.stage_id ?? "",
    source: row.source ?? "—",
    createdAt: formatAccountDate(row.created_at ?? new Date().toISOString()),
  };
}

export type FetchAccountsPageInput = PageParams & {
  search?: string;
  stageId?: string;
};

export async function fetchAccountsPage(
  input: FetchAccountsPageInput
): Promise<{
  result: PaginatedResult<AccountListItem> | null;
  stages: Awaited<ReturnType<typeof getStageOptions>>;
  error: string | null;
}> {
  const stages = await getStageOptions();
  const filters: Record<string, string> = {};

  if (input.stageId && input.stageId !== "all") {
    filters.stage_id = input.stageId;
  }
  if (input.search?.trim()) {
    filters.brand_name__ilike = `%${input.search.trim()}%`;
  }

  const result = await fetchUnifiedData<AccountWithRelations>({
    table: "accounts",
    page: input.page,
    pageSize: input.pageSize,
    select: ACCOUNT_LIST_SELECT,
    filters,
    orderBy: { column: "created_at", ascending: false },
  });

  if (result.error || !result.data) {
    return { result: null, stages, error: result.error ?? "Failed to load accounts" };
  }

  const items = result.data.items.map(mapAccountRow);
  return {
    result: { ...result.data, items },
    stages,
    error: null,
  };
}

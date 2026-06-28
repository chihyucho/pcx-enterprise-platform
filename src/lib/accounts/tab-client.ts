import {
  deleteAccountTabRowAction,
  insertAccountTabRowAction,
  patchAccountTabRowAction,
  updateAccountTabRowAction,
} from "@/lib/accounts/tab-mutations";
import {
  fetchBrandOverviewAction,
  insertBrandOverviewAction,
  saveBrandOverviewAction,
  updateBrandOverviewAction,
} from "@/lib/accounts/brand-overview.actions";
import { fetchUnifiedDataAction } from "@/lib/data/unified-query.actions";
import type { PageParams } from "@/lib/data/pagination-core";
import type {
  AccountCrudRow,
  AccountCrudTableName,
  TabFetchResult,
  TabInsertResult,
} from "@/types/tab-crud";
import type { BrandOverviewResult } from "@/types/account-detail";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";
import type { Tables } from "@/types/database.types";
import type { TablesUpdate } from "@/types/database.types";

export type AccountProjectsFetchResult =
  | { data: Tables<"account_projects">[]; error: null }
  | { data: null; error: string };

export async function updateBrandOverview(
  id: string,
  values: Record<string, string>,
  fields: TabFormFieldDef[],
  accountId = ""
): Promise<TabInsertResult> {
  return updateBrandOverviewAction(id, accountId, values, fields);
}

export async function insertBrandOverview(
  accountId: string,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  return insertBrandOverviewAction(accountId, values, fields);
}

export async function saveBrandOverview(
  accountId: string,
  recordId: string | null,
  values: Record<string, string>,
  fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  return saveBrandOverviewAction(accountId, recordId, values, fields);
}

export async function updateAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  id: string,
  values: Record<string, string>,
  _fields: TabFormFieldDef[],
  accountId = ""
): Promise<TabInsertResult> {
  return updateAccountTabRowAction(table, id, accountId, values);
}

export async function patchAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  id: string,
  patch: TablesUpdate<T>,
  accountId = ""
): Promise<TabInsertResult> {
  return patchAccountTabRowAction(table, id, accountId, patch);
}

export async function deleteAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  id: string,
  accountId = ""
): Promise<TabInsertResult> {
  return deleteAccountTabRowAction(table, id, accountId);
}

export async function fetchAccountProjects(
  accountId: string
): Promise<AccountProjectsFetchResult> {
  const result = await fetchUnifiedDataAction<Tables<"account_projects">>({
    table: "account_projects",
    page: 1,
    pageSize: 100,
    filters: { account_id: accountId },
    orderBy: { column: "created_at", ascending: true },
  });

  if (result.error || !result.data) {
    return { data: null, error: result.error ?? "Failed to load projects" };
  }

  return { data: result.data.items, error: null };
}

export async function fetchBrandOverview(
  accountId: string
): Promise<BrandOverviewResult> {
  return fetchBrandOverviewAction(accountId);
}

export async function fetchAccountTabRows<T extends AccountCrudTableName>(
  table: T,
  accountId: string,
  options?: {
    pagination?: PageParams;
    projectId?: string | null;
  }
): Promise<TabFetchResult<T>> {
  const filters: Record<string, string> = { account_id: accountId };
  if (options?.projectId) {
    filters.project_id = options.projectId;
  }

  const result = await fetchUnifiedDataAction<AccountCrudRow<T>>({
    table,
    page: options?.pagination?.page ?? 1,
    pageSize: options?.pagination?.pageSize,
    filters,
  });

  if (result.error || !result.data) {
    return {
      data: null,
      error: result.error ?? "Failed to load records",
      total: 0,
    };
  }

  return {
    data: result.data.items,
    error: null,
    total: result.data.total,
    page: result.data.page,
    pageSize: result.data.pageSize,
    totalPages: result.data.totalPages,
    hasMore: result.data.hasMore,
  };
}

export async function fetchAccountTabRowById<T extends AccountCrudTableName>(
  table: T,
  id: string
): Promise<{ data: AccountCrudRow<T> | null; error: string | null }> {
  const { fetchUnifiedRowAction } = await import(
    "@/lib/data/unified-query.actions"
  );
  const result = await fetchUnifiedRowAction(table, id);
  return {
    data: (result.data as AccountCrudRow<T> | null) ?? null,
    error: result.error,
  };
}

export async function insertAccountTabRow<T extends AccountCrudTableName>(
  table: T,
  accountId: string,
  values: Record<string, string>,
  _fields: TabFormFieldDef[]
): Promise<TabInsertResult> {
  return insertAccountTabRowAction(table, accountId, values);
}

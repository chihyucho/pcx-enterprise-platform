"use server";

import {
  fetchUnifiedData,
  type UnifiedQueryInput,
  type UnifiedQueryResult,
} from "@/lib/data/unified-query";
import type { AccountCrudTableName } from "@/types/tab-crud";

export async function fetchUnifiedDataAction<T = Record<string, unknown>>(
  input: UnifiedQueryInput
): Promise<UnifiedQueryResult<T>> {
  return fetchUnifiedData<T>(input);
}

export async function fetchUnifiedRowAction(
  table: AccountCrudTableName,
  id: string
): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const result = await fetchUnifiedData<Record<string, unknown>>({
    table,
    page: 1,
    pageSize: 1,
    filters: { id },
  });

  if (result.error) {
    return { data: null, error: result.error };
  }

  return { data: result.data?.items[0] ?? null, error: null };
}

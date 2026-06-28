"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  deleteAccountTabRow,
  insertAccountTabRow,
  updateAccountTabRow,
} from "@/lib/accounts/tab-client";
import { TAB_FORM_FIELDS } from "@/lib/schema/tab-form-fields";
import { useUnifiedPagination } from "@/hooks/useUnifiedPagination";
import { unifiedQueryKey } from "@/hooks/useUnifiedQuery";
import type { AccountCrudTableName } from "@/types/tab-crud";
import type { Tables } from "@/types/database.types";

export function useAccountTabCrud<T extends AccountCrudTableName>(
  table: T,
  accountId: string,
  enabled: boolean,
  options?: { projectId?: string | null }
) {
  const [submitting, setSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const filters = useMemo(() => {
    const next: Record<string, string> = { account_id: accountId };
    if (options?.projectId) {
      next.project_id = options.projectId;
    }
    return next;
  }, [accountId, options?.projectId]);

  const pagination = useUnifiedPagination<Tables<T>>(
    {
      table,
      filters,
    },
    { enabled }
  );

  const invalidate = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: unifiedQueryKey({ table, filters }),
    });
  }, [queryClient, table, filters]);

  const create = useCallback(
    async (values: Record<string, string>) => {
      setSubmitting(true);
      setMutationError(null);
      const result = await insertAccountTabRow(
        table,
        accountId,
        values,
        TAB_FORM_FIELDS[table]
      );

      if (!result.success) {
        setSubmitting(false);
        setMutationError(result.error);
        return { success: false as const, error: result.error };
      }

      await invalidate();
      setSubmitting(false);
      return { success: true as const, error: null, id: result.id };
    },
    [table, accountId, invalidate]
  );

  const update = useCallback(
    async (id: string, values: Record<string, string>) => {
      setSubmitting(true);
      setMutationError(null);
      const result = await updateAccountTabRow(
        table,
        id,
        values,
        TAB_FORM_FIELDS[table],
        accountId
      );

      if (!result.success) {
        setSubmitting(false);
        setMutationError(result.error);
        return { success: false as const, error: result.error };
      }

      await invalidate();
      setSubmitting(false);
      return { success: true as const, error: null };
    },
    [table, accountId, invalidate]
  );

  const remove = useCallback(
    async (id: string) => {
      setSubmitting(true);
      setMutationError(null);
      const result = await deleteAccountTabRow(table, id, accountId);

      if (!result.success) {
        setSubmitting(false);
        setMutationError(result.error);
        return { success: false as const, error: result.error };
      }

      await invalidate();
      setSubmitting(false);
      return { success: true as const, error: null };
    },
    [table, accountId, invalidate]
  );

  return {
    rows: pagination.items,
    error: mutationError ?? (pagination.error?.message ?? null),
    loading: pagination.isLoading,
    submitting,
    reload: () => void pagination.refetch(),
    create,
    update,
    remove,
    formFields: TAB_FORM_FIELDS[table],
    page: pagination.page,
    setPage: pagination.setPage,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasMore: pagination.hasMore,
    isFetching: pagination.isFetching,
    goNext: pagination.goNext,
    goPrev: pagination.goPrev,
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteAccountTabRow,
  fetchAccountTabRows,
  insertAccountTabRow,
  updateAccountTabRow,
} from "@/lib/accounts/tab-client";
import { TAB_FORM_FIELDS } from "@/lib/schema/tab-form-fields";
import type { AccountCrudTableName } from "@/types/tab-crud";
import type { Tables } from "@/types/database.types";

interface CrudState<T extends AccountCrudTableName> {
  data: Tables<T>[] | null;
  error: string | null;
  loading: boolean;
  submitting: boolean;
}

const initialState = <T extends AccountCrudTableName>(): CrudState<T> => ({
  data: null,
  error: null,
  loading: false,
  submitting: false,
});

export function useAccountTabCrud<T extends AccountCrudTableName>(
  table: T,
  accountId: string,
  enabled: boolean
) {
  const [state, setState] = useState<CrudState<T>>(initialState);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const result = await fetchAccountTabRows(table, accountId);
    if (result.error) {
      setState({ data: null, error: result.error, loading: false, submitting: false });
      return;
    }
    setState((prev) => ({
      ...prev,
      data: result.data,
      error: null,
      loading: false,
    }));
  }, [table, accountId]);

  const create = useCallback(
    async (values: Record<string, string>) => {
      setState((prev) => ({ ...prev, submitting: true, error: null }));
      const result = await insertAccountTabRow(
        table,
        accountId,
        values,
        TAB_FORM_FIELDS[table]
      );

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          submitting: false,
          error: result.error,
        }));
        return { success: false as const, error: result.error };
      }

      await load();
      setState((prev) => ({ ...prev, submitting: false }));
      return { success: true as const, error: null, id: result.id };
    },
    [table, accountId, load]
  );

  const update = useCallback(
    async (id: string, values: Record<string, string>) => {
      setState((prev) => ({ ...prev, submitting: true, error: null }));
      const result = await updateAccountTabRow(
        table,
        id,
        values,
        TAB_FORM_FIELDS[table]
      );

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          submitting: false,
          error: result.error,
        }));
        return { success: false as const, error: result.error };
      }

      await load();
      setState((prev) => ({ ...prev, submitting: false }));
      return { success: true as const, error: null };
    },
    [table, load]
  );

  const remove = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, submitting: true, error: null }));
      const result = await deleteAccountTabRow(table, id);

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          submitting: false,
          error: result.error,
        }));
        return { success: false as const, error: result.error };
      }

      await load();
      setState((prev) => ({ ...prev, submitting: false }));
      return { success: true as const, error: null };
    },
    [table, load]
  );

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [enabled, load]);

  return {
    rows: state.data ?? [],
    error: state.error,
    loading: state.loading,
    submitting: state.submitting,
    reload: load,
    create,
    update,
    remove,
    formFields: TAB_FORM_FIELDS[table],
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAccountTabData } from "@/lib/accounts/tab-actions";
import { fetchBrandOverview } from "@/lib/accounts/tab-client";
import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type {
  AccountTabRowMap,
  BrandOverviewData,
} from "@/types/account-detail";

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const initialState = <T,>(): AsyncState<T> => ({
  data: null,
  error: null,
  loading: false,
});

export function useBrandOverview(accountId: string, enabled: boolean) {
  const [state, setState] = useState<AsyncState<BrandOverviewData>>(initialState);

  const load = useCallback(async () => {
    setState({ data: null, error: null, loading: true });
    try {
      const result = await fetchBrandOverview(accountId);
      if (result.error) {
        setState({ data: null, error: result.error, loading: false });
        return;
      }
      setState({ data: result.data, error: null, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load brand overview";
      setState({ data: null, error: message, loading: false });
    }
  }, [accountId]);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [enabled, load]);

  return { ...state, reload: load };
}

export function useAccountTabData<T extends AccountTabTableName>(
  table: T,
  accountId: string,
  enabled: boolean
) {
  const [state, setState] = useState<AsyncState<AccountTabRowMap[T][]>>(
    initialState
  );

  const load = useCallback(async () => {
    setState({ data: null, error: null, loading: true });
    const result = await fetchAccountTabData(table, accountId);
    if (result.error) {
      setState({ data: null, error: result.error, loading: false });
      return;
    }
    setState({ data: result.data, error: null, loading: false });
  }, [table, accountId]);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [enabled, load]);

  return { ...state, reload: load };
}

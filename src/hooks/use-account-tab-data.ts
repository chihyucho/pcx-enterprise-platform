"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchBrandOverview } from "@/lib/accounts/tab-client";
import type { BrandOverviewData } from "@/types/account-detail";

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

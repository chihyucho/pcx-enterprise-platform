"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUnifiedDataAction } from "@/lib/data/unified-query.actions";
import type { UnifiedQueryInput } from "@/lib/data/unified-query";
import type { PaginatedResult } from "@/lib/data/pagination-core";

export function unifiedQueryKey(input: UnifiedQueryInput) {
  return ["unified-query", input] as const;
}

export function useUnifiedQuery<T = Record<string, unknown>>(
  input: UnifiedQueryInput,
  options?: {
    enabled?: boolean;
    initialData?: PaginatedResult<T>;
  }
) {
  return useQuery({
    queryKey: unifiedQueryKey(input),
    queryFn: async () => {
      const result = await fetchUnifiedDataAction<T>(input);
      if (result.error || !result.data) {
        throw new Error(result.error ?? "Failed to load data");
      }
      return result.data;
    },
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  });
}

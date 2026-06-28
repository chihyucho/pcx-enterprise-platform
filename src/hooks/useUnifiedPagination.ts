"use client";

import { useState } from "react";
import { useUnifiedQuery } from "@/hooks/useUnifiedQuery";
import type { UnifiedQueryInput } from "@/lib/data/unified-query";
import type { PaginatedResult } from "@/lib/data/pagination-core";

export function useUnifiedPagination<T = Record<string, unknown>>(
  baseInput: Omit<UnifiedQueryInput, "page">,
  options?: {
    enabled?: boolean;
    initialData?: PaginatedResult<T>;
  }
) {
  const [page, setPage] = useState(1);

  const query = useUnifiedQuery<T>(
    { ...baseInput, page },
    { enabled: options?.enabled, initialData: options?.initialData }
  );

  const result = query.data;

  return {
    ...query,
    page,
    setPage,
    items: result?.items ?? [],
    total: result?.total ?? 0,
    totalPages: result?.totalPages ?? 1,
    hasMore: result?.hasMore ?? false,
    pageSize: result?.pageSize ?? baseInput.pageSize,
    goNext: () => setPage((current) => current + 1),
    goPrev: () => setPage((current) => Math.max(1, current - 1)),
    resetPage: () => setPage(1),
  };
}

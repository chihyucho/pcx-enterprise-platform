"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAccountsPage,
  type FetchAccountsPageInput,
} from "@/lib/accounts/accounts-pagination";
import type { AccountListItem, StageOption } from "@/types/account";
import type { PaginatedResult } from "@/lib/data/pagination";

export function usePaginatedAccounts(
  input: FetchAccountsPageInput,
  initial?: {
    result: PaginatedResult<AccountListItem>;
    stages: StageOption[];
  }
) {
  return useQuery({
    queryKey: ["accounts", input],
    queryFn: async () => {
      const response = await fetchAccountsPage(input);
      if (response.error || !response.result) {
        throw new Error(response.error ?? "Failed to load accounts");
      }
      return {
        result: response.result,
        stages: response.stages,
      };
    },
    initialData: initial
      ? { result: initial.result, stages: initial.stages }
      : undefined,
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  });
}

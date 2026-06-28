"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountsTable } from "@/components/tables/accounts-table";
import { AccountsEmptyState } from "@/components/accounts/accounts-empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePaginatedAccounts } from "@/hooks/usePaginatedAccounts";
import type { AccountListItem, StageOption } from "@/types/account";
import type { PaginatedResult } from "@/lib/data/pagination";

interface AccountsPageClientProps {
  initialResult: PaginatedResult<AccountListItem>;
  stages: StageOption[];
}

export function AccountsPageClient({
  initialResult,
  stages,
}: AccountsPageClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isFetching, error } = usePaginatedAccounts(
    {
      page,
      search: debouncedSearch,
      stageId: stageFilter,
    },
    { result: initialResult, stages }
  );

  const result = data?.result ?? initialResult;
  const stageOptions = data?.stages ?? stages;
  const showEmptyState = result.total === 0 && !debouncedSearch && stageFilter === "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Accounts</h2>
          <p className="text-sm text-muted-foreground">
            Manage sales accounts and pipeline stages.
          </p>
        </div>
        <Button asChild>
          <Link href="/sales-system/accounts/new">
            <Plus className="h-4 w-4" />
            Create New Account
          </Link>
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}

      {showEmptyState ? (
        <AccountsEmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by brand..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={stageFilter}
              onValueChange={(value) => {
                setStageFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stageOptions.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AccountsTable accounts={result.items} />

          <PaginationControls
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            isLoading={isFetching}
            onPrevious={() => setPage((current) => Math.max(1, current - 1))}
            onNext={() => setPage((current) => current + 1)}
          />
        </>
      )}
    </div>
  );
}

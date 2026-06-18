"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import type { AccountListItem, StageOption } from "@/types/account";

interface AccountsPageClientProps {
  accounts: AccountListItem[];
  stages: StageOption[];
}

export function AccountsPageClient({
  accounts,
  stages,
}: AccountsPageClientProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSearch =
        search === "" ||
        account.brandName.toLowerCase().includes(search.toLowerCase()) ||
        account.categoryName.toLowerCase().includes(search.toLowerCase());
      const matchesStage =
        stageFilter === "all" || account.stageId === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [accounts, search, stageFilter]);

  const showEmptyState = accounts.length === 0;

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

      {showEmptyState ? (
        <AccountsEmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by brand or category..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select disabled>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Source (soon)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AccountsTable accounts={filteredAccounts} />
        </>
      )}
    </div>
  );
}

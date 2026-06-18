"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { formatSourceLabel, stageBadgeVariant } from "@/lib/accounts/format";
import { EditAccountDialog } from "@/components/accounts/detail/edit-account-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AccountDetail, CategoryOption, StageOption } from "@/types/account";

interface AccountDetailHeaderProps {
  account: AccountDetail;
  categories: CategoryOption[];
  stages: StageOption[];
}

export function AccountDetailHeader({
  account,
  categories,
  stages,
}: AccountDetailHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {account.brandName}
            </h2>
            <Badge variant={stageBadgeVariant(account.stageName)}>
              {account.stageName}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">Category:</span>{" "}
              {account.categoryName}
            </span>
            <span>
              <span className="font-medium text-foreground">Source:</span>{" "}
              {account.source
                ? formatSourceLabel(account.source)
                : "—"}
            </span>
            <span>
              <span className="font-medium text-foreground">Created:</span>{" "}
              {account.createdAt}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
          disabled={categories.length === 0 || stages.length === 0}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <EditAccountDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        account={account}
        categories={categories}
        stages={stages}
      />
    </>
  );
}

import Link from "next/link";
import { Pencil } from "lucide-react";
import { formatSourceLabel, stageBadgeVariant } from "@/lib/accounts/format";
import { AccountDetailTabs } from "@/components/accounts/detail/account-detail-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AccountDetail } from "@/types/account";

interface AccountDetailPageProps {
  account: AccountDetail;
}

export function AccountDetailPage({ account }: AccountDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <Link href="/sales-system/accounts" className="hover:underline">
          Accounts
        </Link>
        <span className="mx-2">/</span>
        <span>{account.brandName}</span>
      </div>

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
              {formatSourceLabel(account.source)}
            </span>
            <span>
              <span className="font-medium text-foreground">Created:</span>{" "}
              {account.createdAt}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" disabled>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <Separator />

      <AccountDetailTabs accountId={account.id} />
    </div>
  );
}

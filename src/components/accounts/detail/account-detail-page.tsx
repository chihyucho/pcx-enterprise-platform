import Link from "next/link";
import { AccountDetailTabs } from "@/components/accounts/detail/account-detail-tabs";
import { AccountDetailHeader } from "@/components/accounts/detail/account-detail-header";
import { Separator } from "@/components/ui/separator";
import type { AccountDetail, CategoryOption, StageOption } from "@/types/account";

import type { AccountDetailTabId } from "@/lib/schema/account-detail-tabs";
import { ACCOUNT_DETAIL_TABS } from "@/lib/schema/account-detail-tabs";

interface AccountDetailPageProps {
  account: AccountDetail;
  initialTab?: string;
  categories: CategoryOption[];
  stages: StageOption[];
}

function resolveInitialTab(tab?: string): AccountDetailTabId {
  if (!tab) {
    return ACCOUNT_DETAIL_TABS[0]?.id ?? "brand";
  }
  const match = ACCOUNT_DETAIL_TABS.find((entry) => entry.id === tab);
  return match?.id ?? ACCOUNT_DETAIL_TABS[0]?.id ?? "brand";
}

export function AccountDetailPage({
  account,
  initialTab,
  categories,
  stages,
}: AccountDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <Link href="/sales-system/accounts" className="hover:underline">
          Accounts
        </Link>
        <span className="mx-2">/</span>
        <span>{account.brandName}</span>
      </div>

      <AccountDetailHeader
        account={account}
        categories={categories}
        stages={stages}
      />

      <Separator />

      <AccountDetailTabs
        accountId={account.id}
        initialTab={resolveInitialTab(initialTab)}
      />
    </div>
  );
}

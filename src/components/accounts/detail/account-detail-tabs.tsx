"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCOUNT_DETAIL_TABS } from "@/lib/schema/account-detail-tabs";
import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type { AccountCrudTableName } from "@/types/tab-crud";
import { BrandOverviewTab } from "@/components/accounts/detail/brand-overview-tab";
import { AccountTabCrud } from "@/components/accounts/detail/account-tab-crud";
import { ContactsTab } from "@/components/accounts/detail/contacts-tab";

const CRUD_TABLE_MAP: Record<
  Exclude<AccountTabTableName, never>,
  AccountCrudTableName
> = {
  account_projects: "account_projects",
  sales_activities: "sales_activities",
  contacts: "contacts",
  products: "products",
  quotes: "quotes",
  marketing_materials: "marketing_materials",
  supply_chain: "supply_chain",
};

interface AccountDetailTabsProps {
  accountId: string;
}

export function AccountDetailTabs({ accountId }: AccountDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(
    ACCOUNT_DETAIL_TABS[0]?.id ?? "brand"
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-4"
    >
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
        {ACCOUNT_DETAIL_TABS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="text-xs sm:text-sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {ACCOUNT_DETAIL_TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-0">
          {tab.kind === "account" ? (
            <BrandOverviewTab
              accountId={accountId}
              enabled={activeTab === tab.id}
            />
          ) : tab.id === "contacts" ? (
            <ContactsTab
              accountId={accountId}
              enabled={activeTab === tab.id}
            />
          ) : (
            <AccountTabCrud
              accountId={accountId}
              table={CRUD_TABLE_MAP[tab.table]}
              title={tab.label}
              enabled={activeTab === tab.id}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

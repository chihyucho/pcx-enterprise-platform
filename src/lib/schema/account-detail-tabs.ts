import { schemaMap } from "@/lib/schema/tables";

/** Tables loaded per account tab (filtered by account_id). */
export type AccountTabTableName =
  | "account_projects"
  | "sales_activities"
  | "contacts"
  | "products"
  | "quotes"
  | "marketing_materials"
  | "supply_chain";

export type AccountDetailTabId =
  (typeof schemaMap.accounts.tabs)[number];

export type AccountDetailTabConfig =
  | {
      id: "brand";
      label: string;
      kind: "account";
      table: null;
    }
  | {
      id: Exclude<AccountDetailTabId, "brand">;
      label: string;
      kind: "table";
      table: AccountTabTableName;
    };

const TAB_META: Record<
  Exclude<AccountDetailTabId, "brand">,
  { table: AccountTabTableName; label: string }
> = {
  project: {
    table: "account_projects",
    label: "Project Detail",
  },
  sales_activities: {
    table: "sales_activities",
    label: schemaMap.sales_activities.label,
  },
  contacts: {
    table: "contacts",
    label: schemaMap.contacts.label,
  },
  products: {
    table: "products",
    label: schemaMap.products.label,
  },
  quotes: {
    table: "quotes",
    label: schemaMap.quotes.label,
  },
  marketing_materials: {
    table: "marketing_materials",
    label: schemaMap.marketing_materials.label,
  },
  supply_chain: {
    table: "supply_chain",
    label: schemaMap.supply_chain.label,
  },
};

export const ACCOUNT_DETAIL_TABS: AccountDetailTabConfig[] =
  schemaMap.accounts.tabs.map((tabId) => {
    if (tabId === "brand") {
      return {
        id: "brand" as const,
        label: "Brand Overview",
        kind: "account" as const,
        table: null,
      };
    }

    const meta = TAB_META[tabId];
    return {
      id: tabId,
      label: meta.label,
      kind: "table" as const,
      table: meta.table,
    };
  });

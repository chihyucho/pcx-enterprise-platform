import { formatCellValue } from "@/lib/accounts/format-cell";
import type {
  AccountCrudTableName,
} from "@/types/tab-crud";

const MULTILINE_KEYS_BY_TABLE: Partial<
  Record<AccountCrudTableName, string[]>
> = {
  account_projects: [
    "distribution_plan",
    "technical_requirement",
    "marketing_request",
    "manufacturing_venues",
  ],
  sales_activities: ["notes"],
  contact_persons: ["notes"],
  quotes: ["notes"],
  marketing_materials: ["description"],
  supply_chain: ["notes"],
};

/** Tables on account detail that support delete from the record dialog. */
export const DELETABLE_ACCOUNT_TAB_TABLES = [
  "sales_activities",
  "contact_persons",
  "products",
  "quotes",
  "marketing_materials",
  "supply_chain",
] as const;

export type DeletableAccountTabTable =
  (typeof DELETABLE_ACCOUNT_TAB_TABLES)[number];

export function isDeletableAccountTabTable(
  table: AccountCrudTableName
): table is DeletableAccountTabTable {
  return (DELETABLE_ACCOUNT_TAB_TABLES as readonly string[]).includes(table);
}

export function getMultilineKeysForTable(
  table: AccountCrudTableName
): string[] {
  return MULTILINE_KEYS_BY_TABLE[table] ?? ["notes"];
}

export function getRecordDetailTitle(
  table: AccountCrudTableName,
  row: Record<string, unknown>
): string {
  switch (table) {
    case "sales_activities": {
      const subject = String(row.subject ?? "").trim();
      if (subject) return subject;
      const date = formatCellValue("activity_date", row.activity_date);
      return date === "—" ? "Sales Activity" : date;
    }
    case "contact_persons": {
      const name = String(row.name ?? "").trim();
      return name || "Contact";
    }
    case "products": {
      const num = String(row.product_number ?? "").trim();
      return num || "Product";
    }
    case "quotes": {
      const style = String(row.style ?? "").trim();
      return style || "Quote";
    }
    case "marketing_materials": {
      const title = String(row.title ?? "").trim();
      return title || "Marketing Material";
    }
    case "supply_chain": {
      const factory = String(row.factory_name ?? "").trim();
      return factory || "Supply Chain";
    }
    case "account_projects": {
      const name = String(row.project_name ?? "").trim();
      return name || "Project";
    }
    default:
      return "Record";
  }
}

import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type { Tables } from "@/types/database.types";

export type TabQueryResult<T> =
  | { data: T[]; error: null }
  | { data: null; error: string };

export type AccountProjectsRow = Tables<"account_projects">;
export type SalesActivitiesRow = Tables<"sales_activities">;
export type ContactsRow = Tables<"contacts">;
export type ProductsRow = Tables<"products">;
export type QuotesRow = Tables<"quotes">;
export type MarketingMaterialsRow = Tables<"marketing_materials">;
export type SupplyChainRow = Tables<"supply_chain">;

export type AccountTabRowMap = {
  account_projects: AccountProjectsRow;
  sales_activities: SalesActivitiesRow;
  contacts: ContactsRow;
  products: ProductsRow;
  quotes: QuotesRow;
  marketing_materials: MarketingMaterialsRow;
  supply_chain: SupplyChainRow;
};

export type AccountTabData<T extends AccountTabTableName> = TabQueryResult<
  AccountTabRowMap[T]
>;

export interface BrandOverviewData {
  brand_name: string;
  category_name: string;
  stage_name: string;
  source: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type BrandOverviewResult =
  | { data: BrandOverviewData; error: null }
  | { data: null; error: string };

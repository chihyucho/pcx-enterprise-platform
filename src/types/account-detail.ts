import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type { Tables } from "@/types/database.types";

export type TabQueryResult<T> =
  | { data: T[]; error: null }
  | { data: null; error: string };

export type AccountProjectsRow = Tables<"account_projects">;
export type SalesActivitiesRow = Tables<"sales_activities">;
export type ContactPersonsRow = Tables<"contact_persons">;
export type ProductsRow = Tables<"products">;
export type QuotesRow = Tables<"quotes">;
export type MarketingMaterialsRow = Tables<"marketing_materials">;
export type SupplyChainRow = Tables<"supply_chain">;

export type AccountTabRowMap = {
  account_projects: AccountProjectsRow;
  sales_activities: SalesActivitiesRow;
  contact_persons: ContactPersonsRow;
  products: ProductsRow;
  quotes: QuotesRow;
  marketing_materials: MarketingMaterialsRow;
  supply_chain: SupplyChainRow;
};

export type AccountTabData<T extends AccountTabTableName> = TabQueryResult<
  AccountTabRowMap[T]
>;

export type BrandOverviewData = Tables<"brand_overview">;

export type BrandOverviewResult =
  | { data: BrandOverviewData | null; error: null }
  | { data: null; error: string };

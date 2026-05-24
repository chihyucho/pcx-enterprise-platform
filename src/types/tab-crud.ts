import type { Tables, TablesInsert } from "@/types/database.types";

/** Tables with account_id used in account detail CRUD tabs */
export type AccountCrudTableName =
  | "sales_activities"
  | "contact_persons"
  | "products"
  | "quotes"
  | "marketing_materials"
  | "supply_chain"
  | "account_projects";

export type AccountCrudRow<T extends AccountCrudTableName> = Tables<T>;
export type AccountCrudInsert<T extends AccountCrudTableName> = TablesInsert<T>;

export type TabFetchResult<T extends AccountCrudTableName> =
  | { data: AccountCrudRow<T>[]; error: null }
  | { data: null; error: string };

export type TabInsertResult =
  | { success: true; error: null }
  | { success: false; error: string };

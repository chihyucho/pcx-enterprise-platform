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
  | {
      data: AccountCrudRow<T>[];
      error: null;
      total: number;
      page?: number;
      pageSize?: number;
      totalPages?: number;
      hasMore?: boolean;
    }
  | { data: null; error: string; total?: number };

export type TabInsertResult =
  | { success: true; error: null; id?: string }
  | { success: false; error: string };

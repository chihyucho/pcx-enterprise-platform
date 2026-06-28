import { createClient } from "@/lib/supabase/server";
import {
  buildPaginatedResult,
  DEFAULT_PAGE_SIZE,
  normalizePageParams,
  type PaginatedResult,
} from "@/lib/data/pagination-core";
import { ACCOUNT_LIST_SELECT } from "@/types/supabase";
import type { AccountCrudTableName } from "@/types/tab-crud";

export type UnifiedTable =
  | "accounts"
  | AccountCrudTableName
  | "follow_up_items"
  | "profiles"
  | "user_dashboard_reads";

export type UnifiedFilterValue = string | number | boolean | null | string[];

export type UnifiedQueryInput = {
  table: UnifiedTable;
  page?: number;
  pageSize?: number;
  select?: string;
  filters?: Record<string, UnifiedFilterValue>;
  orderBy?: { column: string; ascending?: boolean };
};

export type UnifiedQueryResult<T = Record<string, unknown>> =
  | { data: PaginatedResult<T>; error: null }
  | { data: null; error: string };

type TableDefaults = {
  select: string;
  orderColumn: string;
  ascending: boolean;
};

const TABLE_DEFAULTS: Record<UnifiedTable, TableDefaults> = {
  accounts: {
    select: ACCOUNT_LIST_SELECT,
    orderColumn: "created_at",
    ascending: false,
  },
  account_projects: {
    select: "*",
    orderColumn: "created_at",
    ascending: true,
  },
  sales_activities: {
    select: "*",
    orderColumn: "activity_date",
    ascending: false,
  },
  contact_persons: {
    select: "*",
    orderColumn: "created_at",
    ascending: false,
  },
  products: {
    select: "*",
    orderColumn: "created_at",
    ascending: false,
  },
  quotes: {
    select: "*",
    orderColumn: "quote_date",
    ascending: false,
  },
  marketing_materials: {
    select: "*",
    orderColumn: "created_at",
    ascending: false,
  },
  supply_chain: {
    select: "*",
    orderColumn: "created_at",
    ascending: false,
  },
  follow_up_items: {
    select: `
      id,
      sales_activity_id,
      account_id,
      assigned_user_id,
      due_date,
      notes,
      completed_at,
      created_at,
      sales_activities(subject),
      accounts(brand_name)
    `,
    orderColumn: "due_date",
    ascending: true,
  },
  profiles: {
    select: "id, full_name, email, role, department",
    orderColumn: "full_name",
    ascending: true,
  },
  user_dashboard_reads: {
    select: "user_id, item_type, item_id, read_at",
    orderColumn: "read_at",
    ascending: false,
  },
};

function applyFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters: Record<string, UnifiedFilterValue>
) {
  let next = query;
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined) continue;

    if (key.endsWith("__ilike") && typeof value === "string") {
      const column = key.replace(/__ilike$/, "");
      next = next.ilike(column, value);
      continue;
    }

    if (key.endsWith("__not_null")) {
      const column = key.replace(/__not_null$/, "");
      next = value ? next.not(column, "is", null) : next.is(column, null);
      continue;
    }

    if (key.endsWith("__in") && Array.isArray(value)) {
      const column = key.replace(/__in$/, "");
      next = next.in(column, value);
      continue;
    }

    if (key === "completed" && typeof value === "boolean") {
      next = value
        ? next.not("completed_at", "is", null)
        : next.is("completed_at", null);
      continue;
    }

    if (Array.isArray(value)) {
      next = next.in(key, value);
      continue;
    }

    if (value === null) {
      next = next.is(key, null);
      continue;
    }

    next = next.eq(key, value);
  }

  return next;
}

/**
 * Server-only unified paginated query. All list reads should flow through here.
 */
export async function fetchUnifiedData<T = Record<string, unknown>>(
  input: UnifiedQueryInput
): Promise<UnifiedQueryResult<T>> {
  const defaults = TABLE_DEFAULTS[input.table];
  const { page, pageSize, from, to } = normalizePageParams({
    page: input.page ?? 1,
    pageSize: input.pageSize ?? DEFAULT_PAGE_SIZE,
  });

  const supabase = await createClient();
  const orderColumn = input.orderBy?.column ?? defaults.orderColumn;
  const ascending = input.orderBy?.ascending ?? defaults.ascending;

  let query = supabase
    .from(input.table)
    .select(input.select ?? defaults.select, { count: "exact" })
    .order(orderColumn, { ascending, nullsFirst: false })
    .range(from, to);

  if (input.filters) {
    query = applyFilters(query, input.filters);
  }

  const { data, error, count } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: buildPaginatedResult(
      (data ?? []) as T[],
      count ?? 0,
      page,
      pageSize
    ),
    error: null,
  };
}

import type { AccountCrudTableName } from "@/types/tab-crud";
import type { TabWriteInput } from "@/schemas/tab.schemas";
import { isProjectScopedTable } from "@/lib/accounts/project-utils";

function nullify(value: string | undefined | null): string | null {
  if (value == null || value.trim() === "") return null;
  return value;
}

/** Map validated Zod output to Supabase insert/update payload. */
export function mapTabWriteToPayload<T extends AccountCrudTableName>(
  table: T,
  data: TabWriteInput<T>,
  options?: { accountId?: string; userId?: string }
): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...data };

  if (options?.accountId) {
    payload.account_id = options.accountId;
  }

  if (
    options?.userId &&
    (table === "sales_activities" || table === "quotes")
  ) {
    payload.created_by = options.userId;
  }

  if ("primary_contact" in payload) {
    payload.primary_contact = payload.primary_contact === "true";
  }

  if ("price" in payload && typeof payload.price !== "number") {
    payload.price = payload.price ?? null;
  }

  for (const key of Object.keys(payload)) {
    const value = payload[key];
    if (typeof value === "string") {
      payload[key] = nullify(value);
    }
  }

  if (isProjectScopedTable(table) && "project_id" in payload) {
    payload.project_id = nullify(payload.project_id as string | undefined);
  }

  return payload;
}

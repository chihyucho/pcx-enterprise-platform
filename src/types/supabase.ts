import type { QueryData } from "@supabase/supabase-js";
import type { TypedSupabaseClient } from "@/lib/supabase/database";

export const ACCOUNT_LIST_SELECT = `
  id,
  brand_name,
  source,
  created_at,
  stage_id,
  business_category_id,
  business_categories (
    category_name
  ),
  stages (
    id,
    stage_name
  )
` as const;

export const STAGE_LIST_SELECT = "id, stage_name, order_index" as const;

export function accountsWithRelationsQuery(client: TypedSupabaseClient) {
  return client.from("accounts").select(ACCOUNT_LIST_SELECT);
}

export function accountByIdQuery(client: TypedSupabaseClient, id: string) {
  return client
    .from("accounts")
    .select(ACCOUNT_LIST_SELECT)
    .eq("id", id)
    .maybeSingle();
}

export function stagesListQuery(client: TypedSupabaseClient) {
  return client
    .from("stages")
    .select(STAGE_LIST_SELECT)
    .order("order_index", { ascending: true });
}

export type AccountWithRelations = QueryData<
  ReturnType<typeof accountsWithRelationsQuery>
>[number];

export type AccountWithRelationsSingle = QueryData<
  ReturnType<typeof accountByIdQuery>
>;

export type StageListRow = QueryData<ReturnType<typeof stagesListQuery>>[number];

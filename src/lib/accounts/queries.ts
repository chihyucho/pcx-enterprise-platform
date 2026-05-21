import { createClient } from "@/lib/supabase/server";
import { formatAccountDate } from "@/lib/accounts/format";
import type {
  AccountDetail,
  AccountListItem,
  AccountQueryResult,
  AccountsQueryResult,
  StageOption,
} from "@/types/account";
import {
  accountByIdQuery,
  accountsWithRelationsQuery,
  stagesListQuery,
  type AccountWithRelations,
  type AccountWithRelationsSingle,
  type StageListRow,
} from "@/types/supabase";

function unwrapRelation<T>(value: T | T[] | null): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapAccountRow(row: AccountWithRelations | AccountWithRelationsSingle): AccountListItem {
  const category = unwrapRelation(row.business_categories);
  const stage = unwrapRelation(row.stages);

  return {
    id: row.id,
    brandName: row.brand_name,
    categoryName: category?.category_name ?? "—",
    stageName: stage?.stage_name ?? "—",
    stageId: stage?.id ?? row.stage_id ?? "",
    source: row.source ?? "—",
    createdAt: formatAccountDate(row.created_at ?? new Date().toISOString()),
  };
}

function mapStageOption(row: StageListRow): StageOption {
  return {
    id: row.id,
    name: row.stage_name,
    orderIndex: row.order_index,
  };
}

export async function getStageOptions(): Promise<StageOption[]> {
  const supabase = await createClient();
  const { data, error } = await stagesListQuery(supabase);

  if (error || !data) {
    return [];
  }

  return data.map(mapStageOption);
}

export async function getAccounts(): Promise<AccountsQueryResult> {
  const supabase = await createClient();
  const stages = await getStageOptions();

  const { data, error } = await accountsWithRelationsQuery(supabase).order(
    "created_at",
    { ascending: false }
  );

  if (error) {
    return {
      data: null,
      stages,
      error: error.message,
    };
  }

  return {
    data: (data ?? []).map(mapAccountRow),
    stages,
    error: null,
  };
}

export async function getAccountById(id: string): Promise<AccountQueryResult> {
  const supabase = await createClient();
  const { data, error } = await accountByIdQuery(supabase, id);

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: "Account not found" };
  }

  return {
    data: mapAccountRow(data) as AccountDetail,
    error: null,
  };
}

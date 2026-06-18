import { createClient } from "@/lib/supabase/server";
import type { CategoryOption, StageOption } from "@/types/account";
export type { CategoryOption, StageOption };

function mapCategory(row: { id: string; category_name: string }): CategoryOption {
  return {
    id: row.id,
    name: row.category_name,
  };
}

function mapStage(row: {
  id: string;
  stage_name: string;
  order_index: number | null;
}): StageOption {
  return {
    id: row.id,
    name: row.stage_name,
    orderIndex: row.order_index,
  };
}

export type AccountFormOptionsResult =
  | {
      categories: CategoryOption[];
      stages: StageOption[];
      error: null;
    }
  | {
      categories: CategoryOption[];
      stages: StageOption[];
      error: string;
    };

export async function getAccountFormOptions(): Promise<AccountFormOptionsResult> {
  const supabase = await createClient();

  const [categoriesResult, stagesResult] = await Promise.all([
    supabase
      .from("business_categories")
      .select("id, category_name")
      .order("category_name", { ascending: true }),
    supabase
      .from("stages")
      .select("id, stage_name, order_index")
      .order("order_index", { ascending: true, nullsFirst: false }),
  ]);

  if (categoriesResult.error || stagesResult.error) {
    return {
      categories: [],
      stages: [],
      error:
        categoriesResult.error?.message ??
        stagesResult.error?.message ??
        "Failed to load form options",
    };
  }

  return {
    categories: (categoriesResult.data ?? []).map(mapCategory),
    stages: (stagesResult.data ?? []).map(mapStage),
    error: null,
  };
}

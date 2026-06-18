export interface AccountListItem {
  id: string;
  brandName: string;
  categoryName: string;
  stageName: string;
  stageId: string;
  source: string;
  createdAt: string;
}

export interface AccountDetail extends AccountListItem {
  businessCategoryId: string;
  status: string;
}

/** Row from `public.stages` */
export interface StageOption {
  id: string;
  name: string;
  orderIndex: number | null;
}

/** Row from `public.business_categories` */
export interface CategoryOption {
  id: string;
  name: string;
}

export type AccountsQueryResult =
  | { data: AccountListItem[]; stages: StageOption[]; error: null }
  | { data: null; stages: StageOption[]; error: string };

export type AccountQueryResult =
  | { data: AccountDetail; error: null }
  | { data: null; error: string };

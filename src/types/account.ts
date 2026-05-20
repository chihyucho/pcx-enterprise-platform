export interface AccountListItem {
  id: string;
  brandName: string;
  categoryName: string;
  stageName: string;
  stageId: string;
  source: string;
  createdAt: string;
}

export type AccountDetail = AccountListItem;

export interface StageOption {
  id: string;
  name: string;
}

export type AccountsQueryResult =
  | { data: AccountListItem[]; stages: StageOption[]; error: null }
  | { data: null; stages: StageOption[]; error: string };

export type AccountQueryResult =
  | { data: AccountDetail; error: null }
  | { data: null; error: string };

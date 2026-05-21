"use server";

import { getAccountTabData, getBrandOverview } from "@/lib/accounts/tab-queries";
import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type {
  AccountTabData,
  AccountTabRowMap,
  BrandOverviewResult,
} from "@/types/account-detail";

export async function fetchBrandOverview(
  accountId: string
): Promise<BrandOverviewResult> {
  return getBrandOverview(accountId);
}

export async function fetchAccountTabData<T extends AccountTabTableName>(
  table: T,
  accountId: string
): Promise<AccountTabData<T>> {
  return getAccountTabData(table, accountId);
}

export type { AccountTabRowMap };

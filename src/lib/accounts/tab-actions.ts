"use server";

import { getAccountTabData } from "@/lib/accounts/tab-queries";
import type { AccountTabTableName } from "@/lib/schema/account-detail-tabs";
import type { AccountTabData, AccountTabRowMap } from "@/types/account-detail";

export async function fetchAccountTabData<T extends AccountTabTableName>(
  table: T,
  accountId: string
): Promise<AccountTabData<T>> {
  return getAccountTabData(table, accountId);
}

export type { AccountTabRowMap };

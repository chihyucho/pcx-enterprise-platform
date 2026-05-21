"use client";

import { useBrandOverview } from "@/hooks/use-account-tab-data";
import { BRAND_OVERVIEW_FIELDS } from "@/lib/schema/tab-columns";
import { formatCellValue } from "@/lib/accounts/format-cell";
import { AccountTabPanel } from "@/components/accounts/detail/account-tab-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface BrandOverviewTabProps {
  accountId: string;
  enabled: boolean;
}

export function BrandOverviewTab({
  accountId,
  enabled,
}: BrandOverviewTabProps) {
  const { data, error, loading, reload } = useBrandOverview(accountId, enabled);

  return (
    <AccountTabPanel
      title="Brand Overview"
      description="Main fields from the accounts table."
      loading={loading}
      error={error}
      onRetry={reload}
    >
      {data ? (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableBody>
              {BRAND_OVERVIEW_FIELDS.map((field) => (
                <TableRow key={field.key}>
                  <TableCell className="w-48 font-medium text-muted-foreground">
                    {field.label}
                  </TableCell>
                  <TableCell>
                    {formatCellValue(
                      field.key,
                      data[field.key as keyof typeof data]
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </AccountTabPanel>
  );
}

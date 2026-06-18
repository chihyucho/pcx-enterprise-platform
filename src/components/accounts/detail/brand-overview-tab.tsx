"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useBrandOverview } from "@/hooks/use-account-tab-data";
import { saveBrandOverview } from "@/lib/accounts/tab-client";
import { BRAND_OVERVIEW_FIELDS } from "@/lib/schema/tab-columns";
import { BRAND_OVERVIEW_FORM_FIELDS } from "@/lib/schema/tab-form-fields";
import { EditBrandOverviewDialog } from "@/components/accounts/detail/edit-brand-overview-dialog";
import { AccountTabPanel } from "@/components/accounts/detail/account-tab-panel";
import { Button } from "@/components/ui/button";
import {
  formatCellValue,
  isUrlColumn,
} from "@/lib/accounts/format-cell";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import type { BrandOverviewData } from "@/types/account-detail";

const MULTILINE_KEYS = new Set([
  "corporate_background_company_history",
  "company_address",
  "competitors",
  "financials",
  "distribution",
  "social_media",
]);

function hrefForUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function BrandOverviewValue({
  fieldKey,
  data,
}: {
  fieldKey: string;
  data: BrandOverviewData;
}) {
  const raw = data[fieldKey as keyof BrandOverviewData];

  if (isUrlColumn(fieldKey) && typeof raw === "string" && raw.trim() !== "") {
    const href = hrefForUrl(raw.trim());
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline-offset-4 hover:underline"
      >
        {raw}
      </a>
    );
  }

  const formatted = formatCellValue(fieldKey, raw);
  if (MULTILINE_KEYS.has(fieldKey) && formatted !== "—") {
    return <span className="whitespace-pre-wrap">{formatted}</span>;
  }

  return <>{formatted}</>;
}

interface BrandOverviewTabProps {
  accountId: string;
  enabled: boolean;
}

export function BrandOverviewTab({
  accountId,
  enabled,
}: BrandOverviewTabProps) {
  const { data, error, loading, reload } = useBrandOverview(accountId, enabled);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSave(values: Record<string, string>) {
    setSubmitting(true);
    const result = await saveBrandOverview(
      accountId,
      data?.id ?? null,
      values,
      BRAND_OVERVIEW_FORM_FIELDS
    );
    setSubmitting(false);

    if (result.success) {
      await reload();
    }

    return result;
  }

  return (
    <AccountTabPanel
      title="Brand Overview"
      description="Brand overview details for this account."
      loading={loading}
      error={error}
      onRetry={reload}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Brand Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              One overview record per account. Use Edit to add or update details.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>

        {data ? (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableBody>
                {BRAND_OVERVIEW_FIELDS.map((field) => (
                  <TableRow key={field.key}>
                    <TableCell className="w-[min(14rem,35%)] align-top font-medium text-muted-foreground">
                      {field.label}
                    </TableCell>
                    <TableCell className="align-top">
                      <BrandOverviewValue fieldKey={field.key} data={data} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
            No brand overview yet. Click Edit to add details for this account.
          </p>
        )}
      </div>

      <EditBrandOverviewDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        data={data}
        fields={BRAND_OVERVIEW_FORM_FIELDS}
        submitting={submitting}
        onSubmit={handleSave}
      />
    </AccountTabPanel>
  );
}

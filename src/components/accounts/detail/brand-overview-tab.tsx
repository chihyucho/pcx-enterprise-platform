"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useBrandOverview } from "@/hooks/use-account-tab-data";
import { updateBrandOverview } from "@/lib/accounts/tab-client";
import { BRAND_OVERVIEW_FIELDS } from "@/lib/schema/tab-columns";
import { BRAND_OVERVIEW_FORM_FIELDS } from "@/lib/schema/tab-form-fields";
import { EditBrandOverviewDialog } from "@/components/accounts/detail/edit-brand-overview-dialog";
import { Button } from "@/components/ui/button";
import {
  formatCellValue,
  isUrlColumn,
} from "@/lib/accounts/format-cell";
import { AccountTabPanel } from "@/components/accounts/detail/account-tab-panel";
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
    if (!data) {
      return { success: false, error: "No brand overview record to update." };
    }

    setSubmitting(true);
    const result = await updateBrandOverview(
      data.id,
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
      description="Fields from the brand_overview table for this account."
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
          <div className="flex justify-end border-t px-4 py-3">
            <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit Brand Overview
            </Button>
          </div>
        </div>
      ) : !error ? (
        <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          No brand overview record yet for this account. Add a row in Supabase
          with{" "}
          <code className="text-xs">account_id = {accountId}</code>.
        </p>
      ) : null}
      {data ? (
        <EditBrandOverviewDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          data={data}
          fields={BRAND_OVERVIEW_FORM_FIELDS}
          submitting={submitting}
          onSubmit={handleSave}
        />
      ) : null}
    </AccountTabPanel>
  );
}

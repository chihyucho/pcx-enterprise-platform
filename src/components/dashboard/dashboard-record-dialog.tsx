"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { RecordDetailDialog } from "@/components/accounts/detail/record-detail-dialog";
import {
  deleteAccountTabRow,
  fetchAccountTabRowById,
  updateAccountTabRow,
} from "@/lib/accounts/tab-client";
import {
  enrichRowsWithProjectName,
  isProjectScopedTable,
} from "@/lib/accounts/project-utils";
import {
  getMultilineKeysForTable,
  getRecordDetailTitle,
  isDeletableAccountTabTable,
} from "@/lib/accounts/record-detail";
import { dismissDashboardItem } from "@/lib/dashboard/client";
import type { DashboardDismissKind } from "@/lib/dashboard/types";
import { useAccountProjects } from "@/hooks/use-account-projects";
import { CRUD_TAB_COLUMNS, columnsWithProject } from "@/lib/schema/tab-columns";
import { TAB_FORM_FIELDS } from "@/lib/schema/tab-form-fields";
import { schemaMap } from "@/lib/schema/tables";
import type { AccountCrudTableName } from "@/types/tab-crud";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type DashboardRecordTarget = {
  table: Extract<
    AccountCrudTableName,
    "sales_activities" | "quotes" | "products" | "marketing_materials"
  >;
  rowId: string;
  accountId: string;
  /** When set, closing the dialog dismisses the dashboard item. */
  dismissKind?: DashboardDismissKind;
};

const SECTION_LABELS: Record<DashboardRecordTarget["table"], string> = {
  sales_activities: schemaMap.sales_activities.label,
  quotes: schemaMap.quotes.label,
  products: schemaMap.products.label,
  marketing_materials: schemaMap.marketing_materials.label,
};

interface DashboardRecordDialogProps {
  target: DashboardRecordTarget | null;
  userId: string | null;
  onTargetChange: (target: DashboardRecordTarget | null) => void;
  onDismissed: (kind: DashboardDismissKind | undefined, itemId: string) => void;
  onDataChange?: () => void | Promise<void>;
}

export function DashboardRecordDialog({
  target,
  userId,
  onTargetChange,
  onDismissed,
  onDataChange,
}: DashboardRecordDialogProps) {
  const open = target !== null;
  const dismissedRef = useRef(false);
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const table = target?.table;
  const projectScoped = table ? isProjectScopedTable(table) : false;
  const { projects } = useAccountProjects(
    target?.accountId ?? "",
    open && projectScoped
  );
  const showProjectOnCreate = projects.length > 0;

  const detailColumns = useMemo(() => {
    if (!table) return [];
    return columnsWithProject(
      CRUD_TAB_COLUMNS[table],
      projectScoped && showProjectOnCreate
    );
  }, [table, projectScoped, showProjectOnCreate]);

  const displayRow = useMemo(() => {
    if (!row) return null;
    if (!projectScoped || !showProjectOnCreate) {
      return row;
    }
    return enrichRowsWithProjectName(
      [row as { project_id?: string | null }],
      projects
    )[0] as Record<string, unknown>;
  }, [row, projectScoped, showProjectOnCreate, projects]);

  useEffect(() => {
    if (!target) {
      setRow(null);
      setLoadError(null);
      setLoading(false);
      return;
    }

    dismissedRef.current = false;
    let cancelled = false;
    const { table, rowId } = target;

    async function loadRow() {
      setLoading(true);
      setLoadError(null);
      const result = await fetchAccountTabRowById(table, rowId);
      if (cancelled) return;

      if (result.error) {
        setRow(null);
        setLoadError(result.error);
      } else if (!result.data) {
        setRow(null);
        setLoadError("Record not found.");
      } else {
        setRow(result.data as unknown as Record<string, unknown>);
      }
      setLoading(false);
    }

    void loadRow();
    return () => {
      cancelled = true;
    };
  }, [target]);

  async function finalizeDismiss() {
    if (!target?.dismissKind || !userId || dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      await dismissDashboardItem(userId, target.dismissKind, target.rowId);
      onDismissed(target.dismissKind, target.rowId);
    } catch {
      dismissedRef.current = false;
    }
  }

  async function handleOpenChange(next: boolean) {
    if (!next) {
      await finalizeDismiss();
      onTargetChange(null);
    }
  }

  async function handleUpdate(values: Record<string, string>) {
    if (!table || !target) {
      return { success: false, error: "No record selected." };
    }
    setSubmitting(true);
    const result = await updateAccountTabRow(
      table,
      target.rowId,
      values,
      TAB_FORM_FIELDS[table]
    );
    if (result.success) {
      const refreshed = await fetchAccountTabRowById(table, target.rowId);
      if (refreshed.data) {
        setRow(refreshed.data as unknown as Record<string, unknown>);
      }
      void onDataChange?.();
    }
    setSubmitting(false);
    return result;
  }

  async function handleDelete() {
    if (!table || !target) {
      return { success: false, error: "No record selected." };
    }
    setSubmitting(true);
    const result = await deleteAccountTabRow(table, target.rowId);
    if (result.success) {
      dismissedRef.current = true;
      onDismissed(target.dismissKind, target.rowId);
      onTargetChange(null);
    }
    setSubmitting(false);
    return result;
  }

  const sectionTitle = table ? SECTION_LABELS[table] : "Record";
  const detailTitle =
    displayRow && table
      ? getRecordDetailTitle(table, displayRow)
      : sectionTitle;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading…</DialogTitle>
            <DialogDescription>Fetching record details.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loadError) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unable to load record</DialogTitle>
            <DialogDescription>{loadError}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!displayRow || !table) {
    return null;
  }

  return (
    <RecordDetailDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={detailTitle}
      subtitle={`${sectionTitle} details`}
      row={displayRow}
      viewColumns={detailColumns}
      fields={TAB_FORM_FIELDS[table]}
      submitting={submitting}
      onSubmit={handleUpdate}
      onDelete={isDeletableAccountTabTable(table) ? handleDelete : undefined}
      multilineKeys={getMultilineKeysForTable(table)}
      projects={projectScoped ? projects : []}
          recordTable={table}
          onInlineFieldChange={() => void onDataChange?.()}
    />
  );
}

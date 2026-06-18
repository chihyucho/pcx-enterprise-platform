"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { RecordFormFields } from "@/components/accounts/detail/record-form-fields";
import { ProjectSelectField } from "@/components/accounts/detail/project-select-field";
import { formatCellValue } from "@/lib/accounts/format-cell";
import { rowToFormValues } from "@/lib/accounts/row-form-values";
import type { AccountProjectRow } from "@/lib/accounts/project-utils";
import type { TabColumnDef } from "@/lib/schema/tab-columns";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";
import { SalesActivityFollowUpField } from "@/components/accounts/detail/sales-activity-follow-up-field";
import { InlineApprovalStatusSelect } from "@/components/accounts/detail/inline-approval-status-select";
import { RECORD_DETAIL_DIALOG_CLASS } from "@/lib/ui/dialog-sizes";
import {
  MARKETING_APPROVAL_STATUS_OPTIONS,
  PRODUCT_APPROVAL_STATUS_OPTIONS,
} from "@/lib/schema/field-options";
import type { AccountCrudTableName } from "@/types/tab-crud";

function isInlineApprovalStatusColumn(
  recordTable: AccountCrudTableName | undefined,
  columnKey: string
): boolean {
  return (
    (recordTable === "products" && columnKey === "approval_status") ||
    (recordTable === "marketing_materials" && columnKey === "status")
  );
}

interface RecordDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  row: Record<string, unknown>;
  viewColumns: TabColumnDef[];
  fields: TabFormFieldDef[];
  submitting: boolean;
  onSubmit: (values: Record<string, string>) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  onDelete?: () => Promise<{
    success: boolean;
    error: string | null;
  }>;
  multilineKeys?: string[];
  projects?: AccountProjectRow[];
  recordTable?: AccountCrudTableName;
  onInlineFieldChange?: () => void;
}

export function RecordDetailDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  row,
  viewColumns,
  fields,
  submitting,
  onSubmit,
  onDelete,
  multilineKeys = ["notes"],
  projects = [],
  recordTable,
  onInlineFieldChange,
}: RecordDetailDialogProps) {
  const showProjectSelect = projects.length > 0;
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [followUpCompleted, setFollowUpCompleted] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [values, setValues] = useState<Record<string, string>>(() =>
    rowToFormValues(row, fields, { includeProjectId: showProjectSelect })
  );
  const [formError, setFormError] = useState<string | null>(null);

  const activityId =
    recordTable === "sales_activities" ? String(row.id ?? "") : "";
  const showFollowUpCheckbox =
    recordTable === "sales_activities" &&
    row.next_follow_up != null &&
    String(row.next_follow_up).trim() !== "";
  const recordId = String(row.id ?? "");
  const inlineApprovalTable =
    recordTable === "products" || recordTable === "marketing_materials"
      ? recordTable
      : null;
  const inlineApprovalFieldName =
    recordTable === "products"
      ? ("approval_status" as const)
      : recordTable === "marketing_materials"
        ? ("status" as const)
        : null;

  useEffect(() => {
    if (open) {
      setValues(
        rowToFormValues(row, fields, { includeProjectId: showProjectSelect })
      );
      setIsEditing(false);
      setConfirmDeleteOpen(false);
      setFormError(null);
      setFollowUpCompleted(Boolean(row.follow_up_completed));
      if (inlineApprovalFieldName) {
        setApprovalStatus(String(row[inlineApprovalFieldName] ?? ""));
      }
    }
  }, [open, row, fields, showProjectSelect, inlineApprovalFieldName]);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setIsEditing(false);
      setConfirmDeleteOpen(false);
      setFormError(null);
    }
    onOpenChange(next);
  }

  function updateField(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (showProjectSelect && !values.project_id?.trim()) {
      setFormError("Project is required.");
      return;
    }

    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        setFormError(`${field.label} is required.`);
        return;
      }
    }

    const result = await onSubmit(values);
    if (!result.success) {
      setFormError(result.error ?? "Failed to save changes.");
      return;
    }

    setIsEditing(false);
  }

  async function handleConfirmDelete() {
    if (!onDelete) return;
    setFormError(null);
    const result = await onDelete();
    if (!result.success) {
      setFormError(result.error ?? "Failed to delete record.");
      setConfirmDeleteOpen(false);
      return;
    }
    setConfirmDeleteOpen(false);
    handleOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={RECORD_DETAIL_DIALOG_CLASS}>
          <div className="border-b px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1.5 pr-2">
                <DialogTitle className="text-xl leading-snug">{title}</DialogTitle>
                {subtitle ? (
                  <DialogDescription className="text-sm">
                    {subtitle}
                  </DialogDescription>
                ) : null}
              </div>
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : null}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {showProjectSelect ? (
                <ProjectSelectField
                  projects={projects}
                  value={values.project_id ?? ""}
                  onChange={(id) => updateField("project_id", id)}
                  id="detail-project_id"
                />
              ) : null}
              <RecordFormFields
                fields={fields}
                values={values}
                onChange={updateField}
                idPrefix="detail-"
              />
              {formError ? (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              ) : null}
              <DialogFooter className="flex-col gap-2 px-0 sm:flex-row sm:justify-between">
                <div>
                  {onDelete ? (
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={submitting}
                      onClick={() => setConfirmDeleteOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setValues(
                        rowToFormValues(row, fields, {
                          includeProjectId: showProjectSelect,
                        })
                      );
                      setIsEditing(false);
                      setFormError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-4 px-6 py-5">
              {showFollowUpCheckbox ? (
                <SalesActivityFollowUpField
                  activityId={activityId}
                  completed={followUpCompleted}
                  disabled={submitting}
                  onCompletedChange={(completed) => {
                    setFollowUpCompleted(completed);
                    onInlineFieldChange?.();
                  }}
                  onError={setFormError}
                />
              ) : null}
              {formError && !isEditing ? (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              ) : null}
              <Table className="table-fixed w-full">
                <TableBody>
                  {viewColumns.map((col) => {
                    const value = row[col.key];
                    const display = formatCellValue(col.key, value);
                    const isMultiline = multilineKeys.includes(col.key);
                    const showInlineApproval =
                      inlineApprovalTable &&
                      inlineApprovalFieldName &&
                      isInlineApprovalStatusColumn(recordTable, col.key);

                    return (
                      <TableRow key={col.key}>
                        <TableCell className="w-[10rem] shrink-0 align-top py-3 pl-0 pr-4 text-sm font-medium text-muted-foreground sm:w-[11.5rem]">
                          {col.label}
                        </TableCell>
                        <TableCell
                          className={`min-w-0 align-top py-3 pl-0 pr-0 text-sm leading-relaxed ${
                            isMultiline
                              ? "whitespace-pre-wrap break-words"
                              : "break-words"
                          }`}
                        >
                          {showInlineApproval ? (
                            <InlineApprovalStatusSelect
                              recordId={recordId}
                              table={inlineApprovalTable}
                              fieldName={inlineApprovalFieldName}
                              value={approvalStatus}
                              options={
                                inlineApprovalTable === "products"
                                  ? PRODUCT_APPROVAL_STATUS_OPTIONS
                                  : MARKETING_APPROVAL_STATUS_OPTIONS
                              }
                              disabled={submitting}
                              onValueChange={setApprovalStatus}
                              onSaved={onInlineFieldChange}
                              onError={setFormError}
                            />
                          ) : (
                            display
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm delete?</DialogTitle>
            <DialogDescription>
              This will permanently remove this record. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={submitting}
              onClick={handleConfirmDelete}
            >
              {submitting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

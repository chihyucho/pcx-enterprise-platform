"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RecordFormFields } from "@/components/accounts/detail/record-form-fields";
import { ProjectSelectField } from "@/components/accounts/detail/project-select-field";
import { emptyFormValues } from "@/lib/accounts/row-form-values";
import type { AccountProjectRow } from "@/lib/accounts/project-utils";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";
import { RECORD_FORM_DIALOG_CLASS } from "@/lib/ui/dialog-sizes";

interface CreateRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  tableName: string;
  accountId: string;
  fields: TabFormFieldDef[];
  submitting: boolean;
  onSubmit: (values: Record<string, string>) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  projects?: AccountProjectRow[];
  defaultProjectId?: string | null;
}

function buildInitialValues(
  fields: TabFormFieldDef[],
  defaultProjectId?: string | null
): Record<string, string> {
  const values = emptyFormValues(fields);
  if (defaultProjectId) {
    values.project_id = defaultProjectId;
  }
  return values;
}

export function CreateRecordDialog({
  open,
  onOpenChange,
  title,
  tableName,
  accountId,
  fields,
  submitting,
  onSubmit,
  projects = [],
  defaultProjectId = null,
}: CreateRecordDialogProps) {
  const showProjectSelect = projects.length > 0;
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(fields, defaultProjectId)
  );
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(buildInitialValues(fields, defaultProjectId));
      setFormError(null);
    }
  }, [open, fields, defaultProjectId]);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setValues(buildInitialValues(fields, defaultProjectId));
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
      setFormError(result.error ?? "Failed to create record.");
      return;
    }

    setValues(buildInitialValues(fields, defaultProjectId));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={RECORD_FORM_DIALOG_CLASS}>
        <DialogHeader>
          <DialogTitle>Create New — {title}</DialogTitle>
          <DialogDescription>
            Inserts into <code className="text-xs">{tableName}</code> with{" "}
            <code className="text-xs">account_id</code> = {accountId}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showProjectSelect ? (
            <ProjectSelectField
              projects={projects}
              value={values.project_id ?? ""}
              onChange={(id) => updateField("project_id", id)}
            />
          ) : null}
          <RecordFormFields
            fields={fields}
            values={values}
            onChange={updateField}
          />
          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emptyFormValues } from "@/lib/accounts/row-form-values";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";
import type { BrandOverviewData } from "@/types/account-detail";
import { RECORD_FORM_DIALOG_CLASS } from "@/lib/ui/dialog-sizes";

function rowToFormValues(
  data: BrandOverviewData,
  fields: TabFormFieldDef[]
): Record<string, string> {
  return Object.fromEntries(
    fields.map((field) => {
      const raw = data[field.name as keyof BrandOverviewData];
      if (typeof raw === "boolean") {
        return [field.name, raw ? "true" : "false"];
      }
      if (raw == null) {
        return [field.name, ""];
      }
      return [field.name, String(raw)];
    })
  );
}

interface EditBrandOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BrandOverviewData | null;
  fields: TabFormFieldDef[];
  submitting: boolean;
  onSubmit: (values: Record<string, string>) => Promise<{
    success: boolean;
    error: string | null;
  }>;
}

export function EditBrandOverviewDialog({
  open,
  onOpenChange,
  data,
  fields,
  submitting,
  onSubmit,
}: EditBrandOverviewDialogProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    data ? rowToFormValues(data, fields) : emptyFormValues(fields)
  );
  const [formError, setFormError] = useState<string | null>(null);
  const isCreate = data === null;

  useEffect(() => {
    if (open) {
      setValues(
        data ? rowToFormValues(data, fields) : emptyFormValues(fields)
      );
      setFormError(null);
    }
  }, [open, data, fields]);

  function handleOpenChange(next: boolean) {
    if (!next) {
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

    const result = await onSubmit(values);
    if (!result.success) {
      setFormError(result.error ?? "Failed to save changes.");
      return;
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={RECORD_FORM_DIALOG_CLASS}>
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Brand Overview" : "Edit Brand Overview"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add brand overview details for this account."
              : "Update brand overview details for this account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={values[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  id={field.name}
                  type="text"
                  value={values[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
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
              {submitting ? "Saving…" : isCreate ? "Save" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

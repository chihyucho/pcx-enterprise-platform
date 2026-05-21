"use client";

import { useState } from "react";
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
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";

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
}

function initialValues(fields: TabFormFieldDef[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [f.name, f.type === "boolean" ? "false" : ""])
  );
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
}: CreateRecordDialogProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    initialValues(fields)
  );
  const [formError, setFormError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setValues(initialValues(fields));
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

    setValues(initialValues(fields));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New — {title}</DialogTitle>
          <DialogDescription>
            Inserts into <code className="text-xs">{tableName}</code> with{" "}
            <code className="text-xs">account_id</code> = {accountId}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required ? (
                  <span className="text-destructive"> *</span>
                ) : null}
              </Label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={values[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                />
              ) : field.type === "boolean" ? (
                <select
                  id={field.name}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={values[field.name] ?? "false"}
                  onChange={(e) => updateField(field.name, e.target.value)}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
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
              {submitting ? "Saving…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

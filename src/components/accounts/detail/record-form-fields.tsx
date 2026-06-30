"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollableNotesTextarea } from "@/components/accounts/detail/scrollable-notes-textarea";
import { mergeSelectOptions } from "@/lib/schema/field-options";
import { INPUT_LIMITS } from "@/lib/sanitize";
import type { TabFormFieldDef } from "@/lib/schema/tab-form-fields";

interface RecordFormFieldsProps {
  fields: TabFormFieldDef[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  idPrefix?: string;
}

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const defaultTextareaClassName =
  "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function RecordFormFields({
  fields,
  values,
  onChange,
  idPrefix = "",
}: RecordFormFieldsProps) {
  return (
    <>
      {fields.map((field) => {
        const inputId = `${idPrefix}${field.name}`;
        const maxLength = field.maxLength ?? INPUT_LIMITS.mediumText;

        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={inputId}>
              {field.label}
              {field.required ? (
                <span className="text-destructive"> *</span>
              ) : null}
            </Label>
            {field.type === "textarea" && field.scrollable ? (
              <ScrollableNotesTextarea
                id={inputId}
                value={values[field.name] ?? ""}
                maxLength={maxLength}
                placeholder={field.placeholder}
                onChange={(next) => onChange(field.name, next)}
              />
            ) : field.type === "textarea" ? (
              <textarea
                id={inputId}
                className={defaultTextareaClassName}
                value={values[field.name] ?? ""}
                maxLength={maxLength}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
              />
            ) : field.type === "boolean" ? (
              <select
                id={inputId}
                className={selectClassName}
                value={values[field.name] ?? "false"}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            ) : field.type === "select" && field.options ? (
              <select
                id={inputId}
                className={selectClassName}
                value={values[field.name] ?? ""}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                {!field.required ? (
                  <option value="">Select…</option>
                ) : null}
                {mergeSelectOptions(
                  field.options,
                  values[field.name]
                ).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={inputId}
                type={
                  field.type === "date"
                    ? "date"
                    : field.type === "number"
                      ? "number"
                      : "text"
                }
                value={values[field.name] ?? ""}
                maxLength={
                  field.type === "text" ? maxLength : undefined
                }
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

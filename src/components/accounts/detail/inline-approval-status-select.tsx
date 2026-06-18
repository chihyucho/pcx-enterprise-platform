"use client";

import { patchAccountTabRow } from "@/lib/accounts/tab-client";
import {
  mergeSelectOptions,
  type FieldOption,
} from "@/lib/schema/field-options";

const selectClassName =
  "flex h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface InlineApprovalStatusSelectProps {
  recordId: string;
  table: "products" | "marketing_materials";
  fieldName: "approval_status" | "status";
  value: string;
  options: readonly FieldOption[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
  onSaved?: () => void;
  onError?: (message: string) => void;
}

export function InlineApprovalStatusSelect({
  recordId,
  table,
  fieldName,
  value,
  options,
  disabled,
  onValueChange,
  onSaved,
  onError,
}: InlineApprovalStatusSelectProps) {
  return (
    <select
      className={selectClassName}
      value={value}
      disabled={disabled}
      aria-label="Approval Status"
      onChange={(event) => {
        const next = event.target.value;
        const previous = value;
        onValueChange(next);

        void patchAccountTabRow(
          table,
          recordId,
          fieldName === "approval_status"
            ? { approval_status: next.trim() === "" ? null : next }
            : { status: next.trim() === "" ? null : next }
        )
          .then((result) => {
            if (!result.success) {
              onValueChange(previous);
              onError?.(result.error ?? "Failed to update approval status.");
              return;
            }
            onSaved?.();
          })
          .catch((err) => {
            onValueChange(previous);
            onError?.(
              err instanceof Error
                ? err.message
                : "Failed to update approval status."
            );
          });
      }}
    >
      <option value="">Select…</option>
      {mergeSelectOptions(options, value).map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

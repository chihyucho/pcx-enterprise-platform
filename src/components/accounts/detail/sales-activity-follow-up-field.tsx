"use client";

import { setSalesActivityFollowUpCompleted } from "@/lib/accounts/tab-client";

interface SalesActivityFollowUpFieldProps {
  activityId: string;
  completed: boolean;
  disabled?: boolean;
  onCompletedChange: (completed: boolean) => void;
  onError?: (message: string) => void;
}

export function SalesActivityFollowUpField({
  activityId,
  completed,
  disabled,
  onCompletedChange,
  onError,
}: SalesActivityFollowUpFieldProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/30 px-3 py-2.5 text-sm">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-input"
        checked={completed}
        disabled={disabled}
        onChange={(event) => {
          const next = event.target.checked;
          void setSalesActivityFollowUpCompleted(activityId, next)
            .then(() => onCompletedChange(next))
            .catch((err) => {
              onError?.(
                err instanceof Error
                  ? err.message
                  : "Failed to update follow-up status."
              );
            });
        }}
      />
      <span>Follow-up completed</span>
    </label>
  );
}

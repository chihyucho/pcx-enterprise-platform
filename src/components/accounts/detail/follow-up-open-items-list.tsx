"use client";

import { Trash2 } from "lucide-react";
import { formatAccountDate } from "@/lib/accounts/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FollowUpListEntry = {
  id: string;
  dueDate: string;
  assignedUserName: string;
  notes: string | null;
  completedAt?: string | null;
};

interface FollowUpOpenItemsListProps {
  items: FollowUpListEntry[];
  disabled?: boolean;
  updatingId?: string | null;
  onComplete?: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function FollowUpOpenItemsList({
  items,
  disabled,
  updatingId,
  onComplete,
  onDelete,
  emptyMessage = "No follow-ups.",
}: FollowUpOpenItemsListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y rounded-md border bg-background">
      {items.map((item) => {
        const completed = Boolean(item.completedAt);

        return (
          <li
            key={item.id}
            className={cn(
              "flex items-start gap-3 px-3 py-2.5 text-sm",
              completed && "bg-muted/30"
            )}
          >
            {onComplete ? (
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-input"
                checked={completed}
                disabled={disabled || updatingId === item.id}
                aria-label={
                  completed
                    ? `Mark follow-up incomplete for ${item.assignedUserName}`
                    : `Mark follow-up complete for ${item.assignedUserName}`
                }
                onChange={() => onComplete(item.id)}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-medium",
                  completed && "text-muted-foreground line-through"
                )}
              >
                Due {formatAccountDate(item.dueDate)}
              </p>
              <p className="text-muted-foreground">
                Assigned to {item.assignedUserName}
                {completed ? " · Completed" : null}
              </p>
              {item.notes ? (
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {item.notes}
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              disabled={disabled || updatingId === item.id}
              onClick={() => onDelete(item.id)}
              aria-label="Delete follow-up"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

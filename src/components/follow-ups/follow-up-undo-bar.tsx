"use client";

import { Button } from "@/components/ui/button";

interface FollowUpUndoBarProps {
  onUndo: () => void;
  undoing?: boolean;
}

export function FollowUpUndoBar({ onUndo, undoing }: FollowUpUndoBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-md border bg-background px-4 py-2.5 text-sm shadow-lg">
        <span className="text-muted-foreground">Follow-up marked complete.</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={undoing}
          onClick={onUndo}
        >
          {undoing ? "Undoing…" : "Undo"}
        </Button>
      </div>
    </div>
  );
}

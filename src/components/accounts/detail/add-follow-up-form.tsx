"use client";

import { Plus } from "lucide-react";
import type { AssignableUser } from "@/lib/follow-ups/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddFollowUpFormProps {
  formId: string;
  users: AssignableUser[];
  dueDate: string;
  assignedUserId?: string;
  notes: string;
  disabled?: boolean;
  saving?: boolean;
  onDueDateChange: (value: string) => void;
  onAssignedUserIdChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function AddFollowUpForm({
  formId,
  users,
  dueDate,
  assignedUserId,
  notes,
  disabled,
  saving,
  onDueDateChange,
  onAssignedUserIdChange,
  onNotesChange,
  onSubmit,
}: AddFollowUpFormProps) {
  const selectValue =
    assignedUserId && users.some((user) => user.id === assignedUserId)
      ? assignedUserId
      : undefined;

  return (
    <form onSubmit={onSubmit} className="space-y-3 border-t pt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${formId}-due-date`}>Due date</Label>
          <Input
            id={`${formId}-due-date`}
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            required
            disabled={disabled || saving}
          />
        </div>
        <div className="space-y-2">
          <Label>Assigned to</Label>
          {users.length > 0 ? (
            <Select
              value={selectValue}
              onValueChange={onAssignedUserIdChange}
              disabled={disabled || saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">
              No team members found in profiles.
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${formId}-notes`}>Notes</Label>
        <Input
          id={`${formId}-notes`}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Optional"
          disabled={disabled || saving}
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={disabled || saving || !assignedUserId}
      >
        <Plus className="mr-2 h-4 w-4" />
        {saving ? "Adding…" : "Add follow-up"}
      </Button>
    </form>
  );
}

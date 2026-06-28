"use client";

import { useEffect, useRef, useState } from "react";
import { getSessionUserId } from "@/lib/auth/session.actions";
import { fetchAssignableUsers } from "@/lib/follow-ups/client";
import type { AssignableUser } from "@/lib/follow-ups/types";
import { pickDefaultAssignee, type FollowUpDraft } from "@/lib/follow-ups/draft";
import { getFollowUpAddValidation } from "@/lib/follow-ups/validate-add-input";
import { AddFollowUpForm } from "@/components/accounts/detail/add-follow-up-form";
import { FollowUpOpenItemsList } from "@/components/accounts/detail/follow-up-open-items-list";

interface SalesActivityFollowUpDraftsSectionProps {
  drafts: FollowUpDraft[];
  onDraftsChange: (drafts: FollowUpDraft[]) => void;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export function SalesActivityFollowUpDraftsSection({
  drafts,
  onDraftsChange,
  disabled,
  onError,
}: SalesActivityFollowUpDraftsSectionProps) {
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(
    undefined
  );
  const [notes, setNotes] = useState("");
  const currentUserIdRef = useRef<string | null>(null);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    void getSessionUserId().then((uid) => {
      currentUserIdRef.current = uid;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchAssignableUsers()
      .then((nextUsers) => {
        if (cancelled) return;
        setUsers(nextUsers);
        setAssignedUserId((current) => {
          if (current && nextUsers.some((user) => user.id === current)) {
            return current;
          }
          return pickDefaultAssignee(nextUsers, currentUserIdRef.current);
        });
      })
      .catch((err) => {
        if (cancelled) return;
        onErrorRef.current?.(
          err instanceof Error ? err.message : "Failed to load team members."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd() {
    const validation = getFollowUpAddValidation({
      dueDate,
      assignedUserId,
      notes,
    });

    if (validation.action === "noop") {
      return;
    }

    if (validation.action === "error") {
      onErrorRef.current?.(validation.message);
      return;
    }

    const assignee = users.find((user) => user.id === assignedUserId);
    if (!assignee || !assignedUserId) {
      onErrorRef.current?.("Select a valid assignee.");
      return;
    }

    onDraftsChange([
      ...drafts,
      {
        id: crypto.randomUUID(),
        dueDate,
        assignedUserId,
        assignedUserName: assignee.label,
        notes: notes.trim() || null,
      },
    ]);
    setDueDate("");
    setNotes("");
  }

  function handleDelete(id: string) {
    onDraftsChange(drafts.filter((draft) => draft.id !== id));
  }

  return (
    <div className="space-y-4 rounded-md border bg-muted/20 p-4">
      <div>
        <h3 className="text-sm font-medium">Follow-up items</h3>
        <p className="text-xs text-muted-foreground">
          Add follow-ups now. They will be saved when you create this activity.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading team members…</p>
      ) : (
        <FollowUpOpenItemsList
          items={drafts}
          disabled={disabled}
          onDelete={handleDelete}
          emptyMessage="No follow-ups added yet."
        />
      )}

      <AddFollowUpForm
        formId="create-activity-follow-up"
        users={users}
        dueDate={dueDate}
        assignedUserId={assignedUserId}
        notes={notes}
        disabled={disabled || loading}
        onDueDateChange={setDueDate}
        onAssignedUserIdChange={setAssignedUserId}
        onNotesChange={setNotes}
        onAdd={handleAdd}
      />
    </div>
  );
}

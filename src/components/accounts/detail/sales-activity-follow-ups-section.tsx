"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createFollowUpItem,
  deleteFollowUpItem,
  fetchAssignableUsers,
  fetchFollowUpsForActivity,
  markFollowUpItemComplete,
  updateFollowUpItem,
} from "@/lib/follow-ups/client";
import type { ActivityFollowUpItem, AssignableUser } from "@/lib/follow-ups/types";
import { pickDefaultAssignee } from "@/lib/follow-ups/draft";
import { getFollowUpAddValidation } from "@/lib/follow-ups/validate-add-input";
import { AddFollowUpForm } from "@/components/accounts/detail/add-follow-up-form";
import { FollowUpEditDialog } from "@/components/accounts/detail/follow-up-edit-dialog";
import { FollowUpOpenItemsList } from "@/components/accounts/detail/follow-up-open-items-list";

interface SalesActivityFollowUpsSectionProps {
  activityId: string;
  accountId: string;
  disabled?: boolean;
  onChange?: () => void;
  onError?: (message: string) => void;
}

export function SalesActivityFollowUpsSection({
  activityId,
  accountId,
  disabled,
  onChange,
  onError,
}: SalesActivityFollowUpsSectionProps) {
  const [items, setItems] = useState<ActivityFollowUpItem[]>([]);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(
    undefined
  );
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityFollowUpItem | null>(
    null
  );
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      currentUserIdRef.current = user?.id ?? null;
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nextItems, nextUsers] = await Promise.all([
        fetchFollowUpsForActivity(activityId),
        fetchAssignableUsers(),
      ]);
      setItems(nextItems);
      setUsers(nextUsers);
      setAssignedUserId((current) => {
        if (current && nextUsers.some((user) => user.id === current)) {
          return current;
        }
        return pickDefaultAssignee(nextUsers, currentUserIdRef.current);
      });
    } catch (err) {
      onErrorRef.current?.(
        err instanceof Error ? err.message : "Failed to load follow-ups."
      );
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    void load();
  }, [load]);

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

    if (!assignedUserId) {
      onErrorRef.current?.("Select a valid assignee.");
      return;
    }

    setSaving(true);
    try {
      await createFollowUpItem({
        salesActivityId: activityId,
        accountId,
        assignedUserId,
        dueDate,
        notes,
        createdBy: currentUserIdRef.current,
      });
      setDueDate("");
      setNotes("");
      await load();
      onChange?.();
    } catch (err) {
      onErrorRef.current?.(
        err instanceof Error ? err.message : "Failed to add follow-up."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleComplete(itemId: string) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;

    setUpdatingId(itemId);
    try {
      await markFollowUpItemComplete(itemId, !item.completedAt);
      await load();
      onChange?.();
    } catch (err) {
      onErrorRef.current?.(
        err instanceof Error ? err.message : "Failed to update follow-up."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(itemId: string) {
    setUpdatingId(itemId);
    try {
      await deleteFollowUpItem(itemId);
      await load();
      onChange?.();
    } catch (err) {
      onErrorRef.current?.(
        err instanceof Error ? err.message : "Failed to delete follow-up."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleEdit(itemId: string) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;
    setEditingItem(item);
    setEditOpen(true);
  }

  async function handleSaveEdit(input: { dueDate: string; notes: string }) {
    if (!editingItem) return;

    setEditSaving(true);
    try {
      await updateFollowUpItem(editingItem.id, {
        dueDate: input.dueDate,
        notes: input.notes,
      });
      setEditOpen(false);
      setEditingItem(null);
      await load();
      onChange?.();
    } catch (err) {
      onErrorRef.current?.(
        err instanceof Error ? err.message : "Failed to update follow-up."
      );
      throw err;
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-md border bg-muted/20 p-4">
      <div>
        <h3 className="text-sm font-medium">Follow-up items</h3>
        <p className="text-xs text-muted-foreground">
          Review all follow-ups for this activity. Uncheck a completed item to
          reopen it.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading follow-ups…</p>
      ) : (
        <FollowUpOpenItemsList
          items={items}
          disabled={disabled}
          updatingId={updatingId}
          onComplete={(id) => void handleToggleComplete(id)}
          onEdit={handleEdit}
          onDelete={(id) => void handleDelete(id)}
          emptyMessage="No follow-ups for this activity."
        />
      )}

      <FollowUpEditDialog
        item={editingItem}
        open={editOpen}
        saving={editSaving}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />

      <AddFollowUpForm
        formId={`activity-follow-up-${activityId}`}
        users={users}
        dueDate={dueDate}
        assignedUserId={assignedUserId}
        notes={notes}
        disabled={disabled || loading}
        saving={saving}
        onDueDateChange={setDueDate}
        onAssignedUserIdChange={setAssignedUserId}
        onNotesChange={setNotes}
        onAdd={handleAdd}
      />
    </div>
  );
}

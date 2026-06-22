"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatAccountDate } from "@/lib/accounts/format";
import {
  fetchCompletedFollowUps,
  fetchFollowUps,
  markFollowUpComplete,
} from "@/lib/dashboard/client";
import type { FollowUpItem } from "@/lib/follow-ups/types";
import {
  followUpItemBackgroundClass,
  getFollowUpUrgency,
} from "@/lib/follow-ups/urgency";
import { createClient } from "@/lib/supabase/client";
import { DashboardListRow } from "@/components/dashboard/dashboard-list-row";
import {
  DashboardRecordDialog,
  type DashboardRecordTarget,
} from "@/components/dashboard/dashboard-record-dialog";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { FollowUpUndoBar } from "@/components/follow-ups/follow-up-undo-bar";

const UNDO_DURATION_MS = 5000;
/** ~5 dashboard list rows before scrolling */
const COMPLETED_LIST_MAX_HEIGHT = "25rem";

function FollowUpList({
  children,
  scrollable = false,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  if (scrollable) {
    return (
      <div
        className="overflow-y-auto overscroll-y-contain rounded-md border"
        style={{ maxHeight: COMPLETED_LIST_MAX_HEIGHT }}
      >
        <ul className="divide-y">{children}</ul>
      </div>
    );
  }

  return <ul className="divide-y rounded-md border">{children}</ul>;
}

function sortOpenFollowUps(items: FollowUpItem[]): FollowUpItem[] {
  return [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function sortCompletedFollowUps(items: FollowUpItem[]): FollowUpItem[] {
  return [...items].sort((a, b) =>
    (b.completedAt ?? "").localeCompare(a.completedAt ?? "")
  );
}

function openFollowUpItem(item: FollowUpItem): FollowUpItem {
  const { completedAt: _completedAt, ...rest } = item;
  return rest;
}

export function FollowUpsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [completedFollowUps, setCompletedFollowUps] = useState<FollowUpItem[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [undoItem, setUndoItem] = useState<FollowUpItem | null>(null);
  const [undoing, setUndoing] = useState(false);
  const [recordTarget, setRecordTarget] = useState<DashboardRecordTarget | null>(
    null
  );
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUndoTimer = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
  }, []);

  const load = useCallback(async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const [open, completed] = await Promise.all([
        fetchFollowUps(uid),
        fetchCompletedFollowUps(uid),
      ]);
      setFollowUps(open);
      setCompletedFollowUps(completed);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load follow-ups"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError("You must be signed in to view follow-ups.");
        setLoading(false);
        return;
      }
      setUserId(user.id);
      void load(user.id);
    });
  }, [load]);

  useEffect(() => {
    return () => {
      clearUndoTimer();
    };
  }, [clearUndoTimer]);

  const openRecord = (target: DashboardRecordTarget) => {
    if (!target.accountId) return;
    setRecordTarget(target);
  };

  function scheduleUndoDismiss() {
    clearUndoTimer();
    undoTimeoutRef.current = setTimeout(() => {
      setUndoItem(null);
      undoTimeoutRef.current = null;
    }, UNDO_DURATION_MS);
  }

  async function handleFollowUpCheck(item: FollowUpItem) {
    setUpdatingId(item.id);
    setError(null);

    setFollowUps((current) => current.filter((entry) => entry.id !== item.id));

    try {
      await markFollowUpComplete(item.id, true);
      const completedAt = new Date().toISOString();
      const completedItem = { ...item, completedAt };
      setCompletedFollowUps((current) =>
        sortCompletedFollowUps([completedItem, ...current])
      );
      clearUndoTimer();
      setUndoItem(item);
      scheduleUndoDismiss();
    } catch (err) {
      setFollowUps((current) => sortOpenFollowUps([...current, item]));
      setError(
        err instanceof Error ? err.message : "Failed to update follow-up"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleUndo() {
    if (!undoItem) return;

    setUndoing(true);
    setError(null);
    clearUndoTimer();

    try {
      await markFollowUpComplete(undoItem.id, false);
      setCompletedFollowUps((current) =>
        current.filter((entry) => entry.id !== undoItem.id)
      );
      setFollowUps((current) =>
        sortOpenFollowUps([...current, openFollowUpItem(undoItem)])
      );
      setUndoItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to undo follow-up");
      setUndoItem(undoItem);
      scheduleUndoDismiss();
    } finally {
      setUndoing(false);
    }
  }

  async function handleCompletedUncheck(item: FollowUpItem) {
    setUpdatingId(item.id);
    setError(null);

    setCompletedFollowUps((current) =>
      current.filter((entry) => entry.id !== item.id)
    );

    try {
      await markFollowUpComplete(item.id, false);
      setFollowUps((current) =>
        sortOpenFollowUps([...current, openFollowUpItem(item)])
      );
    } catch (err) {
      setCompletedFollowUps((current) =>
        sortCompletedFollowUps([item, ...current])
      );
      setError(
        err instanceof Error ? err.message : "Failed to reopen follow-up"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function renderFollowUpRow(
    item: FollowUpItem,
    options: {
      checked: boolean;
      onCheckChange: () => void;
      meta: string;
    }
  ) {
    return (
      <DashboardListRow
        key={item.id}
        title={item.subject?.trim() || "Sales activity"}
        meta={options.meta}
        accountId={item.accountId}
        accountName={item.accountName}
        accountTab="sales_activities"
        disabled={!item.accountId || updatingId === item.id}
        className={followUpItemBackgroundClass(
          getFollowUpUrgency(item.dueDate, item.completedAt)
        )}
        leading={
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-input"
            checked={options.checked}
            aria-label={
              options.checked
                ? `Mark follow-up incomplete for ${item.subject ?? "activity"}`
                : `Mark follow-up complete for ${item.subject ?? "activity"}`
            }
            disabled={updatingId === item.id}
            onChange={options.onCheckChange}
          />
        }
        onTitleClick={() =>
          item.accountId &&
          openRecord({
            table: "sales_activities",
            rowId: item.salesActivityId,
            accountId: item.accountId,
          })
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Follow up</h2>
        <p className="text-sm text-muted-foreground">
          Open and completed follow-up items assigned to you.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <DashboardSection
        title="Your follow-ups"
        description="Incomplete items assigned to you, sorted by due date."
        isLoading={loading}
        isEmpty={!loading && followUps.length === 0}
        emptyMessage="No open follow-ups assigned to you."
      >
        <FollowUpList>
          {followUps.map((item) =>
            renderFollowUpRow(item, {
              checked: false,
              onCheckChange: () => void handleFollowUpCheck(item),
              meta: `Due ${formatAccountDate(item.dueDate)}`,
            })
          )}
        </FollowUpList>
      </DashboardSection>

      <DashboardSection
        title="Completed"
        description="Recently completed items, sorted by due date."
        isLoading={loading}
        isEmpty={!loading && completedFollowUps.length === 0}
        emptyMessage="No completed follow-ups yet."
      >
        <FollowUpList scrollable>
          {completedFollowUps.map((item) =>
            renderFollowUpRow(item, {
              checked: true,
              onCheckChange: () => void handleCompletedUncheck(item),
              meta: item.completedAt
                ? `Completed ${formatAccountDate(item.completedAt)} · Due ${formatAccountDate(item.dueDate)}`
                : `Due ${formatAccountDate(item.dueDate)}`,
            })
          )}
        </FollowUpList>
      </DashboardSection>

      {undoItem ? (
        <FollowUpUndoBar onUndo={() => void handleUndo()} undoing={undoing} />
      ) : null}

      <DashboardRecordDialog
        target={recordTarget}
        userId={userId}
        onTargetChange={setRecordTarget}
        onDismissed={() => {}}
        onDataChange={userId ? () => load(userId) : undefined}
      />
    </div>
  );
}

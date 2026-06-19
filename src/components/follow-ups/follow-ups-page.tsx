"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatAccountDate } from "@/lib/accounts/format";
import { fetchFollowUps, markFollowUpComplete } from "@/lib/dashboard/client";
import type { FollowUpItem } from "@/lib/follow-ups/types";
import { createClient } from "@/lib/supabase/client";
import { DashboardListRow } from "@/components/dashboard/dashboard-list-row";
import {
  DashboardRecordDialog,
  type DashboardRecordTarget,
} from "@/components/dashboard/dashboard-record-dialog";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { FollowUpUndoBar } from "@/components/follow-ups/follow-up-undo-bar";

const UNDO_DURATION_MS = 5000;

function FollowUpList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y rounded-md border">{children}</ul>;
}

function sortFollowUps(items: FollowUpItem[]): FollowUpItem[] {
  return [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function FollowUpsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
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
      const next = await fetchFollowUps(uid);
      setFollowUps(next);
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
      clearUndoTimer();
      setUndoItem(item);
      scheduleUndoDismiss();
    } catch (err) {
      setFollowUps((current) => sortFollowUps([...current, item]));
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
      setFollowUps((current) => sortFollowUps([...current, undoItem]));
      setUndoItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to undo follow-up");
      setUndoItem(undoItem);
      scheduleUndoDismiss();
    } finally {
      setUndoing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Follow up</h2>
        <p className="text-sm text-muted-foreground">
          Open follow-up items assigned to you, sorted by due date.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <DashboardSection
        title="Your follow-ups"
        description="Only incomplete items assigned to you appear here."
        isLoading={loading}
        isEmpty={!loading && followUps.length === 0}
        emptyMessage="No follow-ups assigned to you."
      >
        <FollowUpList>
          {followUps.map((item) => (
            <DashboardListRow
              key={item.id}
              title={item.subject?.trim() || "Sales activity"}
              meta={`Due ${formatAccountDate(item.dueDate)}`}
              accountId={item.accountId}
              accountName={item.accountName}
              accountTab="sales_activities"
              disabled={!item.accountId || updatingId === item.id}
              leading={
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-input"
                  aria-label={`Mark follow-up complete for ${item.subject ?? "activity"}`}
                  disabled={updatingId === item.id}
                  onChange={() => void handleFollowUpCheck(item)}
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
          ))}
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

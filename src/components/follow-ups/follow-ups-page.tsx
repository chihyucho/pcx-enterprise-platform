"use client";

import { useCallback, useEffect, useState } from "react";
import { formatAccountDate } from "@/lib/accounts/format";
import { fetchFollowUps, markFollowUpComplete } from "@/lib/dashboard/client";
import type { FollowUpItem } from "@/lib/dashboard/types";
import { createClient } from "@/lib/supabase/client";
import { DashboardListRow } from "@/components/dashboard/dashboard-list-row";
import {
  DashboardRecordDialog,
  type DashboardRecordTarget,
} from "@/components/dashboard/dashboard-record-dialog";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

function FollowUpList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y rounded-md border">{children}</ul>;
}

export function FollowUpsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [recordTarget, setRecordTarget] = useState<DashboardRecordTarget | null>(
    null
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchFollowUps();
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
      void load();
    });
  }, [load]);

  const openRecord = (target: DashboardRecordTarget) => {
    if (!target.accountId) return;
    setRecordTarget(target);
  };

  const handleFollowUpCheck = async (activityId: string) => {
    setUpdatingId(activityId);
    try {
      await markFollowUpComplete(activityId);
      setFollowUps((current) => current.filter((item) => item.id !== activityId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update follow-up"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Follow up</h2>
        <p className="text-sm text-muted-foreground">
          Sales activities with a next follow-up date that are not yet completed.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <DashboardSection
        title="Due follow-ups"
        description="Sorted by follow-up date, nearest first."
        isLoading={loading}
        isEmpty={!loading && followUps.length === 0}
        emptyMessage="No follow-ups due."
      >
        <FollowUpList>
          {followUps.map((item) => (
            <DashboardListRow
              key={item.id}
              title={item.subject?.trim() || "Sales activity"}
              meta={`Follow up: ${formatAccountDate(item.nextFollowUp)}`}
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
                  onChange={() => void handleFollowUpCheck(item.id)}
                />
              }
              onTitleClick={() =>
                item.accountId &&
                openRecord({
                  table: "sales_activities",
                  rowId: item.id,
                  accountId: item.accountId,
                })
              }
            />
          ))}
        </FollowUpList>
      </DashboardSection>

      <DashboardRecordDialog
        target={recordTarget}
        userId={userId}
        onTargetChange={setRecordTarget}
        onDismissed={() => {}}
        onDataChange={load}
      />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { formatAccountDate } from "@/lib/accounts/format";
import {
  fetchDashboardData,
  markFollowUpComplete,
} from "@/lib/dashboard/client";
import {
  formatApprovalStatusLabel,
} from "@/lib/dashboard/format";
import type {
  DashboardData,
  DashboardDismissKind,
} from "@/lib/dashboard/types";
import { createClient } from "@/lib/supabase/client";
import { DashboardListRow } from "@/components/dashboard/dashboard-list-row";
import {
  DashboardRecordDialog,
  type DashboardRecordTarget,
} from "@/components/dashboard/dashboard-record-dialog";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { Badge } from "@/components/ui/badge";

function DashboardList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y rounded-md border">{children}</ul>;
}

function removeItemById(data: DashboardData, itemId: string): DashboardData {
  return {
    followUps: data.followUps.filter((item) => item.id !== itemId),
    newActivities: data.newActivities.filter((item) => item.id !== itemId),
    newQuotes: data.newQuotes.filter((item) => item.id !== itemId),
    pendingApprovals: data.pendingApprovals.filter((item) => item.id !== itemId),
  };
}

function removeDismissedItem(
  data: DashboardData,
  kind: DashboardDismissKind,
  itemId: string
): DashboardData {
  switch (kind) {
    case "follow_up":
      return {
        ...data,
        followUps: data.followUps.filter((item) => item.id !== itemId),
      };
    case "sales_activity":
      return {
        ...data,
        newActivities: data.newActivities.filter((item) => item.id !== itemId),
      };
    case "quote":
      return {
        ...data,
        newQuotes: data.newQuotes.filter((item) => item.id !== itemId),
      };
    case "product":
      return {
        ...data,
        pendingApprovals: data.pendingApprovals.filter(
          (item) => !(item.id === itemId && item.kind === "product")
        ),
      };
    case "marketing":
      return {
        ...data,
        pendingApprovals: data.pendingApprovals.filter(
          (item) => !(item.id === itemId && item.kind === "marketing")
        ),
      };
    default:
      return data;
  }
}

export function SalesDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [recordTarget, setRecordTarget] = useState<DashboardRecordTarget | null>(
    null
  );

  const load = useCallback(async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchDashboardData(uid);
      setData(next);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError("You must be signed in to view the dashboard.");
        setLoading(false);
        return;
      }
      setUserId(user.id);
      void load(user.id);
    });
  }, [load]);

  const handleDismissed = useCallback(
    (kind: DashboardDismissKind | undefined, itemId: string) => {
      setData((current) => {
        if (!current) return current;
        if (kind) return removeDismissedItem(current, kind, itemId);
        return removeItemById(current, itemId);
      });
    },
    []
  );

  const openRecord = (target: DashboardRecordTarget) => {
    if (!target.accountId) return;
    setRecordTarget(target);
  };

  const handleFollowUpCheck = async (activityId: string) => {
    setUpdatingId(activityId);
    try {
      await markFollowUpComplete(activityId);
      handleDismissed("follow_up", activityId);
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
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Follow-ups, new items, and pending approvals across your pipeline.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardSection
          title="Follow up"
          description="Sales activities with a next follow-up date that are not yet completed."
          isLoading={loading}
          isEmpty={!loading && (data?.followUps.length ?? 0) === 0}
          emptyMessage="No follow-ups due."
        >
          <DashboardList>
            {data?.followUps.map((item) => (
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
          </DashboardList>
        </DashboardSection>

        <DashboardSection
          title="New Sales Activities"
          description="Recently added activities you have not opened yet."
          isLoading={loading}
          isEmpty={!loading && (data?.newActivities.length ?? 0) === 0}
          emptyMessage="No unread sales activities."
        >
          <DashboardList>
            {data?.newActivities.map((item) => (
              <DashboardListRow
                key={item.id}
                title={item.subject?.trim() || "Sales activity"}
                meta={`Added ${formatAccountDate(item.createdAt)}`}
                accountId={item.accountId}
                accountName={item.accountName}
                accountTab="sales_activities"
                disabled={!item.accountId}
                onTitleClick={() =>
                  item.accountId &&
                  openRecord({
                    table: "sales_activities",
                    rowId: item.id,
                    accountId: item.accountId,
                    dismissKind: "sales_activity",
                  })
                }
              />
            ))}
          </DashboardList>
        </DashboardSection>

        <DashboardSection
          title="New Quote"
          description="Recently added quotes you have not opened yet."
          isLoading={loading}
          isEmpty={!loading && (data?.newQuotes.length ?? 0) === 0}
          emptyMessage="No unread quotes."
        >
          <DashboardList>
            {data?.newQuotes.map((item) => (
              <DashboardListRow
                key={item.id}
                title={
                  [item.style, item.compound].filter(Boolean).join(" · ") ||
                  "Quote"
                }
                meta={`Added ${formatAccountDate(item.createdAt)}`}
                accountId={item.accountId}
                accountName={item.accountName}
                accountTab="quotes"
                disabled={!item.accountId}
                onTitleClick={() =>
                  item.accountId &&
                  openRecord({
                    table: "quotes",
                    rowId: item.id,
                    accountId: item.accountId,
                    dismissKind: "quote",
                  })
                }
              />
            ))}
          </DashboardList>
        </DashboardSection>

        <DashboardSection
          title="Pending approval"
          description="Products and marketing materials awaiting approval (Pending, In Review, or On Hold)."
          isLoading={loading}
          isEmpty={!loading && (data?.pendingApprovals.length ?? 0) === 0}
          emptyMessage="Nothing pending approval."
        >
          <DashboardList>
            {data?.pendingApprovals.map((item) => {
              const tab =
                item.kind === "product" ? "products" : "marketing_materials";
              const table =
                item.kind === "product" ? "products" : "marketing_materials";
              return (
                <DashboardListRow
                  key={`${item.kind}-${item.id}`}
                  title={item.label}
                  meta={item.kind === "product" ? "Product" : "Marketing"}
                  accountId={item.accountId}
                  accountName={item.accountName}
                  accountTab={tab}
                  disabled={!item.accountId}
                  trailing={
                    <Badge variant="secondary" className="shrink-0">
                      {formatApprovalStatusLabel(item.status)}
                    </Badge>
                  }
                  onTitleClick={() =>
                    item.accountId &&
                    openRecord({
                      table,
                      rowId: item.id,
                      accountId: item.accountId,
                    })
                  }
                />
              );
            })}
          </DashboardList>
        </DashboardSection>
      </div>

      <DashboardRecordDialog
        target={recordTarget}
        userId={userId}
        onTargetChange={setRecordTarget}
        onDismissed={handleDismissed}
        onDataChange={userId ? () => load(userId) : undefined}
      />
    </div>
  );
}

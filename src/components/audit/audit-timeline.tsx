"use client";

import { formatAccountDate } from "@/lib/accounts/format";
import type { AuditLogRow } from "@/lib/audit/logger";

interface AuditTimelineProps {
  logs: AuditLogRow[];
  isLoading?: boolean;
  error?: string | null;
}

export function AuditTimeline({ logs, isLoading, error }: AuditTimelineProps) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading audit history…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No audit entries for this record.</p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l pl-4">
      {logs.map((log) => (
        <li key={log.id} className="text-sm">
          <p className="font-medium">
            {log.action} · {log.tableName}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatAccountDate(log.createdAt)} · record {log.recordId}
          </p>
        </li>
      ))}
    </ol>
  );
}

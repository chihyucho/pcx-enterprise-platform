"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs, type AuditLogRow } from "@/lib/audit/logger";

export function useAuditLogs(options?: {
  tableName?: string;
  recordId?: string;
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery<{ data: AuditLogRow[]; error: string | null }>({
    queryKey: ["audit-logs", options],
    queryFn: () =>
      fetchAuditLogs({
        tableName: options?.tableName,
        recordId: options?.recordId,
        limit: options?.limit,
      }),
    enabled: options?.enabled ?? true,
    staleTime: 60_000,
  });
}

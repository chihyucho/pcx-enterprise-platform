"use server";

import { createClient } from "@/lib/supabase/server";
import type { JsonObject } from "@/lib/audit/diff";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export type AuditLogInput = {
  action: AuditAction;
  tableName: string;
  recordId: string;
  before?: JsonObject | null;
  after?: JsonObject | null;
  metadata?: JsonObject;
};

/**
 * Audit writes are handled exclusively by database triggers (audit_log_trigger).
 * App-layer logging was removed to prevent duplicate audit entries.
 */
export async function writeAuditLog(_input: AuditLogInput): Promise<void> {
  return;
}

export async function isAuditAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data?.role === "admin";
}

export type AuditLogRow = {
  id: string;
  userId: string | null;
  action: string;
  tableName: string;
  recordId: string;
  changes: JsonObject | null;
  createdAt: string;
};

export async function fetchAuditLogs(options?: {
  tableName?: string;
  recordId?: string;
  limit?: number;
}): Promise<{ data: AuditLogRow[]; error: string | null }> {
  const allowed = await isAuditAdmin();
  if (!allowed) {
    return { data: [], error: "Audit logs are restricted to administrators." };
  }

  const supabase = await createClient();
  let query = supabase
    .from("audit_logs")
    .select("id, user_id, action, table_name, record_id, changes, created_at")
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? 100);

  if (options?.tableName) {
    query = query.eq("table_name", options.tableName);
  }
  if (options?.recordId) {
    query = query.eq("record_id", options.recordId);
  }

  const { data, error } = await query;
  if (error) {
    return { data: [], error: error.message };
  }

  return {
    data: (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      action: row.action,
      tableName: row.table_name,
      recordId: row.record_id,
      changes: row.changes as JsonObject | null,
      createdAt: row.created_at,
    })),
    error: null,
  };
}

export type JsonObject = Record<string, unknown>;

export type AuditDiff = {
  before: JsonObject | null;
  after: JsonObject | null;
  changes: JsonObject;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Compute a minimal field-level diff for audit storage. */
export function computeAuditDiff(
  before: JsonObject | null,
  after: JsonObject | null
): AuditDiff {
  const changes: JsonObject = {};
  const keys = new Set([
    ...Object.keys(before ?? {}),
    ...Object.keys(after ?? {}),
  ]);

  for (const key of keys) {
    const prev = before?.[key];
    const next = after?.[key];
    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      changes[key] = { from: prev ?? null, to: next ?? null };
    }
  }

  return { before, after, changes };
}

export function pickAuditSnapshot(
  row: Record<string, unknown> | null,
  omit: string[] = ["updated_at"]
): JsonObject | null {
  if (!row) return null;
  const snapshot: JsonObject = {};
  for (const [key, value] of Object.entries(row)) {
    if (omit.includes(key)) continue;
    snapshot[key] = value;
  }
  return snapshot;
}

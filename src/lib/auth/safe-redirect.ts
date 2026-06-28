/** Allow only same-origin relative paths (blocks open redirects). */
export function isSafeInternalPath(path: string | null | undefined): path is string {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\")) return false;
  if (path.includes("@")) return false;
  return true;
}

export function safeInternalPath(
  path: string | null | undefined,
  fallback = "/portal"
): string {
  return isSafeInternalPath(path) ? path : fallback;
}

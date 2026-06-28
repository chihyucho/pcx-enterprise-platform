import type { User } from "@supabase/supabase-js";

/** Resolved authentication state for middleware and server gates. */
export type AuthResolution =
  | { status: "authenticated"; user: User }
  | { status: "logged_out" }
  | { status: "unknown" };

export function isAuthenticated(
  resolution: AuthResolution
): resolution is { status: "authenticated"; user: User } {
  return resolution.status === "authenticated";
}

/** Treat unknown as authenticated for route access (avoid false logout). */
export function canAccessProtectedRoute(resolution: AuthResolution): boolean {
  return resolution.status === "authenticated" || resolution.status === "unknown";
}

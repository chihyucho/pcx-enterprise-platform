import type { User } from "@supabase/supabase-js";
import type { AuthResolution } from "@/lib/auth/auth-state";
import { hasSupabaseSessionCookie } from "@/lib/auth/session-cache";

const DEFAULT_ATTEMPTS = 3;
const BASE_DELAY_MS = 120;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type GetUserFn = () => Promise<{ data: { user: User | null }; error: Error | null }>;

/**
 * Resolve auth with retries. Distinguishes logged-out vs unknown (transient failure).
 * Does not call Supabase DB — only auth.getUser() / getSession validation path.
 */
export async function resolveAuthWithRetry(
  getUser: GetUserFn,
  options?: { hasSessionCookie?: boolean; attempts?: number }
): Promise<AuthResolution> {
  const attempts = options?.attempts ?? DEFAULT_ATTEMPTS;
  const hasSessionCookie = options?.hasSessionCookie ?? false;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const { data, error } = await getUser();
      if (error) {
        lastError = error;
      } else if (data.user) {
        return { status: "authenticated", user: data.user };
      } else {
        return { status: "logged_out" };
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    if (attempt < attempts - 1) {
      await sleep(BASE_DELAY_MS * 2 ** attempt);
    }
  }

  if (hasSessionCookie) {
    return { status: "unknown" };
  }

  if (lastError) {
    return { status: "logged_out" };
  }

  return { status: "logged_out" };
}

export function hasSessionCookieFromRequest(
  cookieCheck: boolean
): boolean {
  return cookieCheck;
}

export { hasSupabaseSessionCookie };

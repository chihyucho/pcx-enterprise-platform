import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database.types";
import {
  canAccessProtectedRoute,
  type AuthResolution,
} from "@/lib/auth/auth-state";
import { resolveAuthWithRetry, hasSupabaseSessionCookie } from "@/lib/auth/retry-auth";
import {
  readAuthHint,
  writeAuthHint,
  clearAuthHint,
} from "@/lib/auth/session-cache";

export type SessionUpdateResult = {
  supabaseResponse: NextResponse;
  resolution: AuthResolution;
};

/**
 * Edge-safe session refresh:
 * - Uses cookie session hint + getSession (no DB)
 * - Retries getUser() for authoritative auth
 * - UNKNOWN state when session cookie exists but auth API is flaky
 */
export async function updateSession(
  request: NextRequest
): Promise<SessionUpdateResult> {
  let supabaseResponse = NextResponse.next({ request });
  const hasSessionCookie = hasSupabaseSessionCookie(request);
  const cachedHint = readAuthHint(request);

  try {
    const { url, anonKey } = getSupabaseEnv();

    const supabase = createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const resolution = await resolveAuthWithRetry(
      () => supabase.auth.getUser(),
      { hasSessionCookie, attempts: 3 }
    );

    if (resolution.status === "authenticated") {
      writeAuthHint(supabaseResponse, resolution.user.id);
      return { supabaseResponse, resolution };
    }

    if (resolution.status === "unknown") {
      if (cachedHint) {
        return { supabaseResponse, resolution };
      }
      if (hasSessionCookie) {
        return { supabaseResponse, resolution: { status: "unknown" } };
      }
    }

    clearAuthHint(supabaseResponse);
    return { supabaseResponse, resolution: { status: "logged_out" } };
  } catch {
    if (hasSessionCookie || cachedHint) {
      return {
        supabaseResponse,
        resolution: { status: "unknown" },
      };
    }
    clearAuthHint(supabaseResponse);
    return { supabaseResponse, resolution: { status: "logged_out" } };
  }
}

export { canAccessProtectedRoute };

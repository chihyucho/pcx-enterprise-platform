import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database.types";
import type { User } from "@supabase/supabase-js";

const AUTH_TIMEOUT_MS = 4000;

async function getUserWithTimeout(
  getUser: () => ReturnType<
    ReturnType<typeof createServerClient<Database>>["auth"]["getUser"]
  >
): Promise<User | null> {
  try {
    const result = await Promise.race([
      getUser(),
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Supabase auth request timed out")),
          AUTH_TIMEOUT_MS
        );
      }),
    ]);
    return result.data.user;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const user = await getUserWithTimeout(() => supabase.auth.getUser());
    return { supabaseResponse, user };
  } catch {
    return { supabaseResponse, user: null };
  }
}

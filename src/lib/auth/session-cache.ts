import type { NextRequest, NextResponse } from "next/server";

/** Short-lived hint cookie written after a successful auth resolution. */
export const AUTH_HINT_COOKIE = "pcx-auth-hint";
const AUTH_HINT_MAX_AGE_SEC = 60 * 15; // 15 minutes

export type AuthHintPayload = {
  uid: string;
  exp: number;
};

function encodeHint(payload: AuthHintPayload): string {
  return btoa(JSON.stringify(payload));
}

function decodeHint(value: string): AuthHintPayload | null {
  try {
    const parsed = JSON.parse(atob(value)) as AuthHintPayload;
    if (!parsed?.uid || typeof parsed.exp !== "number") return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readAuthHint(request: NextRequest): AuthHintPayload | null {
  const raw = request.cookies.get(AUTH_HINT_COOKIE)?.value;
  if (!raw) return null;
  return decodeHint(raw);
}

export function writeAuthHint(
  response: NextResponse,
  userId: string
): NextResponse {
  const payload: AuthHintPayload = {
    uid: userId,
    exp: Date.now() + AUTH_HINT_MAX_AGE_SEC * 1000,
  };
  response.cookies.set(AUTH_HINT_COOKIE, encodeHint(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_HINT_MAX_AGE_SEC,
  });
  return response;
}

export function clearAuthHint(response: NextResponse): NextResponse {
  response.cookies.delete(AUTH_HINT_COOKIE);
  return response;
}

/** Edge-safe: detect Supabase auth session cookie without network I/O. */
export function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => {
    const name = cookie.name.toLowerCase();
    return name.includes("auth-token") || name.includes("sb-");
  });
}

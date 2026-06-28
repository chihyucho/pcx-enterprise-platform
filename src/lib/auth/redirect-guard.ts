import { NextResponse, type NextRequest } from "next/server";

const REDIRECT_GUARD_COOKIE = "pcx-redirect-guard";
const MAX_REDIRECTS = 4;
const WINDOW_MS = 10_000;

type GuardPayload = {
  count: number;
  lastAt: number;
  lastPath: string;
};

function readGuard(request: NextRequest): GuardPayload | null {
  const raw = request.cookies.get(REDIRECT_GUARD_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GuardPayload;
  } catch {
    return null;
  }
}

function writeGuard(
  response: NextResponse,
  payload: GuardPayload
): NextResponse {
  response.cookies.set(REDIRECT_GUARD_COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30,
  });
  return response;
}

/**
 * Detect rapid /login <-> /portal redirect loops and break the cycle.
 */
export function applyRedirectLoopGuard(
  request: NextRequest,
  response: NextResponse,
  targetPath: string
): { response: NextResponse; loopDetected: boolean } {
  const now = Date.now();
  const current = readGuard(request);
  const isAuthFlip =
    (request.nextUrl.pathname.startsWith("/login") &&
      targetPath.startsWith("/portal")) ||
    (request.nextUrl.pathname.startsWith("/portal") &&
      targetPath.startsWith("/login"));

  if (!isAuthFlip) {
    return { response, loopDetected: false };
  }

  const withinWindow = current && now - current.lastAt < WINDOW_MS;
  const nextCount = withinWindow ? (current?.count ?? 0) + 1 : 1;

  if (nextCount >= MAX_REDIRECTS) {
    const safe = NextResponse.redirect(new URL("/login?error=auth_loop", request.url));
    safe.cookies.delete(REDIRECT_GUARD_COOKIE);
    return { response: safe, loopDetected: true };
  }

  return {
    response: writeGuard(response, {
      count: nextCount,
      lastAt: now,
      lastPath: targetPath,
    }),
    loopDetected: false,
  };
}

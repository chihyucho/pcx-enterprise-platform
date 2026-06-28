import { type NextRequest, NextResponse } from "next/server";
import {
  canAccessProtectedRoute,
  isAuthenticated,
} from "@/lib/auth/auth-state";
import { applyRedirectLoopGuard } from "@/lib/auth/redirect-guard";
import { safeInternalPath } from "@/lib/auth/safe-redirect";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/login"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/login/");
}

function guardedRedirect(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  return applyRedirectLoopGuard(request, response, pathname).response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const { supabaseResponse, resolution } = await updateSession(request);
  const allowed = canAccessProtectedRoute(resolution);
  const loggedIn = isAuthenticated(resolution);

  if (pathname === "/") {
    return guardedRedirect(request, loggedIn ? "/portal" : "/login");
  }

  if (!allowed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    const response = NextResponse.redirect(url);
    return applyRedirectLoopGuard(request, response, "/login").response;
  }

  if (loggedIn && isAuthRoute(pathname)) {
    return guardedRedirect(request, "/portal");
  }

  if (pathname === "/login" && resolution.status === "unknown") {
    const redirectTo = safeInternalPath(
      request.nextUrl.searchParams.get("redirectTo"),
      "/portal"
    );
    return guardedRedirect(request, redirectTo);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

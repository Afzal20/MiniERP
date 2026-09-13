import { NextResponse, type NextRequest } from "next/server";

function isTokenExpired(token?: string): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );
    if (payload.exp && typeof payload.exp === "number") {
      return payload.exp * 1000 < Date.now();
    }
    return false;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("bp_access_token")?.value;
  const refreshToken = request.cookies.get("bp_refresh_token")?.value;
  const hasToken = Boolean(accessToken || refreshToken);

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/sign-up";

  // Handle explicit session expiration / logout or invalid tokens on auth pages
  if (isAuthPage) {
    if (
      request.nextUrl.searchParams.has("expired") ||
      request.nextUrl.searchParams.has("logout") ||
      (accessToken && isTokenExpired(accessToken) && !refreshToken)
    ) {
      const response = NextResponse.next();
      response.cookies.delete("bp_access_token");
      response.cookies.delete("bp_refresh_token");
      response.cookies.delete("bp_active_org");
      return response;
    }

    // Only redirect to dashboard if the access token is valid and not expired
    if (accessToken && !isTokenExpired(accessToken)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const protectedPaths = [
    "/dashboard",
    "/invoices",
    "/clients",
    "/settings",
    "/team",
    "/products",
    "/search",
    "/expenses",
    "/reports",
    "/create-invoice",
  ];

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (!hasToken && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If both tokens are expired on a protected path, clear cookies and redirect to login
  if (isProtectedPath && accessToken && isTokenExpired(accessToken) && isTokenExpired(refreshToken)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("expired", "true");
    const response = NextResponse.redirect(url);
    response.cookies.delete("bp_access_token");
    response.cookies.delete("bp_refresh_token");
    response.cookies.delete("bp_active_org");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

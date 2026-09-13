import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") || "/dashboard";
  const redirectUri = `${origin}/auth/callback`;
  const format = searchParams.get("format");

  const backendRedirectUrl = `${getApiBaseUrl()}/auth/google/redirect/?redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&next=${encodeURIComponent(next)}`;

  if (format === "json" || request.headers.get("accept")?.includes("application/json")) {
    try {
      const res = await fetch(`${backendRedirectUrl}&format=json`);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // fallback to redirect
    }
  }

  return NextResponse.redirect(backendRedirectUrl);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, redirect_uri, id_token } = body;

    const res = await fetch(`${getApiBaseUrl()}/auth/google/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirect_uri, id_token }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || data.detail || data.message || "Google authentication failed" },
        { status: res.status },
      );
    }

    const isSecure = request.url.startsWith("https://");
    const accessToken = data.tokens?.access || data.access;
    const refreshToken = data.tokens?.refresh || data.refresh;

    const response = NextResponse.json({ ok: true, user: data.user });

    if (accessToken) {
      response.cookies.set("bp_access_token", accessToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    if (refreshToken) {
      response.cookies.set("bp_refresh_token", refreshToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}

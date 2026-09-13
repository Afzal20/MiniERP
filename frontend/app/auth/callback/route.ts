import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  if (error) {
    const msg = errorDescription || error || "Google authentication was cancelled or failed.";
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`);
  }

  const accessParam = searchParams.get("access");
  const refreshParam = searchParams.get("refresh");
  if (accessParam || refreshParam) {
    const isSecure = request.url.startsWith("https://");
    const response = NextResponse.redirect(`${origin}${next}`);
    if (accessParam) {
      response.cookies.set("bp_access_token", accessParam, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }
    if (refreshParam) {
      response.cookies.set("bp_refresh_token", refreshParam, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
    return response;
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=Missing+authorization+code`);
  }

  try {
    const redirectUri = `${origin}/auth/callback`;
    const res = await fetch(`${getApiBaseUrl()}/auth/google/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.error || data.detail || data.message || "Failed to authenticate with Google.";
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`);
    }

    const isSecure = request.url.startsWith("https://");
    const accessToken = data.tokens?.access || data.access;
    const refreshToken = data.tokens?.refresh || data.refresh;

    const response = NextResponse.redirect(`${origin}${next}`);

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
    const msg = err instanceof Error ? err.message : "Internal server error during Google authentication.";
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`);
  }
}
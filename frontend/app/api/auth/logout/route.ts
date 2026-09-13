import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/api/client";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("bp_refresh_token")?.value;

    if (refresh) {
      await fetch(`${getApiBaseUrl()}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }).catch(() => {});
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.delete("bp_access_token");
    response.cookies.delete("bp_refresh_token");
    response.cookies.delete("bp_active_org");

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}

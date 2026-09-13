import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/client";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") || "";

  try {
    const res = await fetch(`${getApiBaseUrl()}/billing/webhook/`, {
      method: "POST",
      headers: {
        "Stripe-Signature": signature,
        "Content-Type": "application/json",
      },
      body,
    });

    return new NextResponse(await res.text(), { status: res.status });
  } catch (error) {
    return new NextResponse(
      `Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 400 },
    );
  }
}

"use server";

import { requireOrg } from "@/lib/erp/org";
import { billingApi } from "@/lib/api/client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getFrontendBaseUrl(): Promise<string> {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL;
  if (envBase) {
    return envBase.replace(/\/$/, "");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const referer = requestHeaders.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin.replace(/\/$/, "");
    } catch {
      return referer.replace(/\/$/, "");
    }
  }

  return "http://localhost:3000";
}

function resolvePriceId(priceId?: string): string {
  const trimmed = priceId?.trim();
  const defaultProMonthly =
    process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ||
    "price_1UBHQXLoTyOsviCM13Zaocz1";
  const defaultProYearly =
    process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID ||
    process.env.STRIPE_PRO_YEARLY_PRICE_ID ||
    "price_1UBHQeLoTyOsviCMGed4mMyp";

  if (!trimmed) {
    return defaultProMonthly;
  }

  if (trimmed.startsWith("price_")) {
    return trimmed;
  }

  const mapping: Record<string, string | undefined> = {
    free: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID,
    starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    pro: defaultProMonthly,
    monthly: defaultProMonthly,
    pro_monthly: defaultProMonthly,
    yearly: defaultProYearly,
    annual: defaultProYearly,
    pro_yearly: defaultProYearly,
    pro_annual: defaultProYearly,
    enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  };

  return mapping[trimmed.toLowerCase()] || trimmed;
}

export async function createCheckoutSession(priceId?: string) {
  const { org } = await requireOrg();
  try {
    const baseUrl = await getFrontendBaseUrl();
    const session = await billingApi.createCheckoutSession(org.id, {
      priceId: resolvePriceId(priceId),
      successUrl: `${baseUrl}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/settings/billing?canceled=true`,
    });
    const checkoutUrl = session.checkout_url || session.url || "";
    return { sessionId: session.session_id, url: checkoutUrl };
  } catch (err) {
    console.error("Billing Checkout Error:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to create checkout session",
    );
  }
}

export async function createCustomerPortalSession() {
  const { org } = await requireOrg();
  try {
    const baseUrl = await getFrontendBaseUrl();
    const portalSession = await billingApi.createCustomerPortalSession(
      org.id,
      `${baseUrl}/settings/billing`,
    );
    const portalUrl = portalSession.portal_url || portalSession.url || "";
    return { url: portalUrl };
  } catch (err) {
    console.error("Billing Customer Portal Error:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to create customer portal session",
    );
  }
}

export async function syncCheckoutSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: "Missing session ID" };
  }
  try {
    const { org } = await requireOrg();
    await billingApi.syncCheckoutSession(org.id, sessionId);
    try {
      revalidatePath("/settings/billing");
      revalidatePath("/dashboard");
      revalidatePath("/", "layout");
    } catch {
      // Ignore if revalidatePath is called in an unsupported context
    }
    return { success: true };
  } catch (err) {
    console.error("Billing sync checkout error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to sync checkout session",
    };
  }
}

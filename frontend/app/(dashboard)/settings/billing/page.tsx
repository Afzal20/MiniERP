import { requireOrg } from "@/lib/erp/org";
import { billingApi } from "@/lib/api/client";
import { BillingPortalButton } from "@/components/erp/billing-portal-button";
import { UpgradeButton } from "@/components/erp/upgrade-button";
import { PricingCardSection } from "@/components/pricing/pricing-card-section";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, AlertCircle, Sparkles, Check } from "lucide-react";
import type { PlanDetail } from "@/lib/api/types";

interface BillingPageProps {
  searchParams: Promise<{
    session_id?: string;
    canceled?: string;
  }>;
}

export default async function BillingSettingsPage({ searchParams }: BillingPageProps) {
  const { session_id, canceled } = await searchParams;
  const { org } = await requireOrg();

  let justUpgraded = false;
  if (session_id) {
    try {
      await billingApi.syncCheckoutSession(org.id, session_id);
      justUpgraded = true;
    } catch (err) {
      console.error("Failed to sync checkout session on billing page:", err);
    }
  }

  let subscription = null;
  try {
    subscription = await billingApi.getSubscription(org.id);
  } catch {
    subscription = null;
  }

  let plans: PlanDetail[] = [];
  try {
    const plansRes = await billingApi.getPlans();
    plans = plansRes?.results || [];
  } catch {
    plans = [];
  }

  const planCode =
    typeof subscription?.plan === "object"
      ? (subscription.plan as { code?: string })?.code
      : subscription?.plan;
  const isEnterprise = planCode === "enterprise" && subscription?.status === "active";
  const isPro = planCode === "pro" && subscription?.status === "active";
  const isPaid = (isPro || isEnterprise) && subscription?.status === "active";
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "pro";

  // Find admin-configured Pro and Enterprise price if available
  const proPlan = plans.find((p) => p.code === "pro");
  const proMonthly = proPlan?.prices?.find((p) => p.interval === "month" && p.is_active);
  const displayPrice = proMonthly ? `$${parseFloat(proMonthly.amount).toFixed(2)}` : "$9.00";

  const entPlan = plans.find((p) => p.code === "enterprise");
  const entMonthly = entPlan?.prices?.find((p) => p.interval === "month" && p.is_active);
  const entDisplayPrice = entMonthly ? `$${parseFloat(entMonthly.amount).toFixed(2)}` : "$49.00";

  const currentPlanName = isEnterprise ? "BizPilot Enterprise" : isPro ? "BizPilot Pro" : "BizPilot Starter";
  const currentBadgeText = isEnterprise ? "Enterprise Plan" : isPro ? "Active" : "Free Plan";
  const currentPriceText = isEnterprise
    ? `${entDisplayPrice} / month recurring`
    : isPro
    ? `${displayPrice} / month recurring`
    : "Free forever with core invoicing features";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Billing & Subscription</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage your subscription, billing details, and invoices.
        </p>
      </div>

      {justUpgraded && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3.5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Upgrade Successful</p>
            <p className="text-xs sm:text-sm">
              Thank you for subscribing! Your {isEnterprise ? "Enterprise" : "Pro"} subscription is now fully active.
            </p>
          </div>
        </div>
      )}

      {canceled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-3.5 shadow-sm">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Checkout Canceled</p>
            <p className="text-xs sm:text-sm">The checkout process was not completed. No charges were made.</p>
          </div>
        </div>
      )}

      {/* Subscription Summary Card */}
      <div className="border border-border/80 rounded-3xl p-5 sm:p-7 lg:p-8 bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {currentPlanName}
                </h3>
                <Badge variant={isPaid ? "default" : "secondary"} className="text-xs px-2.5 py-0.5 font-semibold">
                  {currentBadgeText}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                {currentPriceText}
              </p>
            </div>
            {isPaid && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/80 px-3.5 py-1.5 rounded-full w-fit font-medium border border-border/50">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                {isEnterprise ? "All Enterprise features & unlimited scale unlocked" : "All Pro features unlocked"}
              </div>
            )}
          </div>

          <div className="text-sm">
            {isPaid && subscription ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40 p-4 sm:p-5 rounded-2xl border border-border/50">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                      Status
                    </span>
                    <p className="font-semibold capitalize text-foreground text-sm sm:text-base mt-0.5">
                      {subscription.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                      {subscription.cancel_at_period_end ? "Cancels On" : "Next Renewal Date"}
                    </span>
                    <p className="font-semibold text-foreground text-sm sm:text-base mt-0.5">
                      {subscription.current_period_end
                        ? format(new Date(subscription.current_period_end), "PPP")
                        : "Active"}
                    </p>
                  </div>
                </div>

                {subscription.cancel_at_period_end ? (
                  <p className="text-xs text-destructive font-medium">
                    Your subscription will end on{" "}
                    {subscription.current_period_end
                      ? format(new Date(subscription.current_period_end), "PPP")
                      : "the end of the period"}
                    . You can renew anytime from the billing portal.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Your subscription will automatically renew at the end of each billing cycle.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Upgrade to BizPilot Pro to remove all limits and supercharge your business.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Unlimited invoices & estimates</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Multiple team members</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Custom PDF branding</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Priority email support</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isPaid ? (
              <BillingPortalButton />
            ) : (
              <UpgradeButton
                priceId={proPriceId}
                showIcon
                label={`Upgrade to Pro (${displayPrice}/mo)`}
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 shadow-sm transition-all"
              />
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards Section with Dynamic Admin Prices & Interactive Selection */}
      <div className="pt-2">
        <PricingCardSection
          inDashboard={true}
          currentPlan={isEnterprise ? "enterprise" : isPro ? "pro" : "free"}
          isSubscribed={isPaid}
          activeInterval="month"
          initialPlans={plans}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Boxes, Check, Sparkles, Sprout, ShieldCheck } from "lucide-react";
import { UpgradeButton } from "@/components/erp/upgrade-button";
import { BillingPortalButton } from "@/components/erp/billing-portal-button";
import { billingApi } from "@/lib/api/client";
import type { PlanDetail, PriceMapping } from "@/lib/api/types";

interface PricingCardSectionProps {
  inDashboard?: boolean;
  currentPlan?: string;
  isSubscribed?: boolean;
  activeInterval?: "month" | "year";
  initialPlans?: PlanDetail[];
}

function formatPrice(amount: string | number | undefined, fallback: string = "0"): string {
  if (amount === undefined || amount === null) return fallback;
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return fallback;
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
}

export function PricingCardSection({
  inDashboard = false,
  currentPlan = "free",
  isSubscribed = false,
  activeInterval = "month",
  initialPlans = [],
}: PricingCardSectionProps) {
  const [plans, setPlans] = useState<PlanDetail[]>(initialPlans);
  const [interval, setInterval] = useState<"month" | "year">(activeInterval);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "enterprise">(
    isSubscribed ? "pro" : "pro"
  );

  // Load plans from API if not provided or to ensure live admin pricing
  useEffect(() => {
    let mounted = true;
    billingApi
      .getPlans()
      .then((res) => {
        if (mounted && res?.results && res.results.length > 0) {
          setPlans(res.results);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Find plan details from admin data
  const freePlanData = plans.find((p) => p.code === "free");
  const proPlanData = plans.find((p) => p.code === "pro");
  const entPlanData = plans.find((p) => p.code === "enterprise");

  // Admin-defined prices for Pro
  const proMonthlyPrice = proPlanData?.prices?.find(
    (p) => p.interval === "month" && p.is_active
  );
  const proYearlyPrice = proPlanData?.prices?.find(
    (p) => p.interval === "year" && p.is_active
  );

  const proMonthlyAmount = proMonthlyPrice ? parseFloat(proMonthlyPrice.amount) : 9;
  const proYearlyAmount = proYearlyPrice ? parseFloat(proYearlyPrice.amount) : 90;
  const proMonthlyPriceId = proMonthlyPrice?.stripe_price_id || "price_1UBHQXLoTyOsviCM13Zaocz1";
  const proYearlyPriceId = proYearlyPrice?.stripe_price_id || "price_1UBHQeLoTyOsviCMGed4mMyp";

  const proSavingsPercent =
    proMonthlyAmount > 0
      ? Math.round((1 - proYearlyAmount / (proMonthlyAmount * 12)) * 100)
      : 17;

  // Admin-defined prices for Enterprise
  const entMonthlyPrice = entPlanData?.prices?.find(
    (p) => p.interval === "month" && p.is_active
  );
  const entYearlyPrice = entPlanData?.prices?.find(
    (p) => p.interval === "year" && p.is_active
  );

  const entMonthlyAmount = entMonthlyPrice ? parseFloat(entMonthlyPrice.amount) : 49;
  const entYearlyAmount = entYearlyPrice ? parseFloat(entYearlyPrice.amount) : 490;
  const entMonthlyPriceId = entMonthlyPrice?.stripe_price_id || "price_enterprise_month";
  const entYearlyPriceId = entYearlyPrice?.stripe_price_id || "price_enterprise_year";

  const entSavingsPercent =
    entMonthlyAmount > 0
      ? Math.round((1 - entYearlyAmount / (entMonthlyAmount * 12)) * 100)
      : 17;

  // Selected values for current interval
  const currentProPriceAmount = interval === "month" ? proMonthlyAmount : proYearlyAmount;
  const currentProPriceId = interval === "month" ? proMonthlyPriceId : proYearlyPriceId;

  const currentEntPriceAmount = interval === "month" ? entMonthlyAmount : entYearlyAmount;
  const currentEntPriceId = interval === "month" ? entMonthlyPriceId : entYearlyPriceId;

  const isCurrentFree = !isSubscribed && (currentPlan === "free" || currentPlan === "starter");
  const isCurrentPro = isSubscribed && currentPlan === "pro";
  const isCurrentEnterprise = isSubscribed && currentPlan === "enterprise";

  return (
    <div className="w-full py-8 sm:py-12 px-2 sm:px-4">
      {/* Header section with interactive billing frequency toggle */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <p className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase mb-2 sm:mb-3">
          PRICING
        </p>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3 sm:mb-4">
          Choose the right plan for you
        </h2>
        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl mx-auto px-2">
          Find the ideal plan that fits your budget and goals. Prices adjust automatically based on your selected billing frequency.
        </p>

        {/* Interactive Billing Frequency Selector */}
        <div className="mt-6 sm:mt-8 inline-flex items-center p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-inner">
          <button
            type="button"
            id="billing-interval-monthly"
            onClick={() => setInterval("month")}
            className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
              interval === "month"
                ? "bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            id="billing-interval-annual"
            onClick={() => setInterval("year")}
            className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
              interval === "year"
                ? "bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            }`}
          >
            <span>Annual billing</span>
            <span className="text-[10px] sm:text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
              Save {proSavingsPercent}%
            </span>
          </button>
        </div>
      </div>

      {/* 3-card pricing grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
        {/* Card 1: Standard / Free Forever */}
        <div
          id="pricing-card-free"
          role="button"
          tabIndex={0}
          onClick={() => setSelectedPlan("free")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedPlan("free");
            }
          }}
          className={`bg-white dark:bg-neutral-900 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
            selectedPlan === "free"
              ? "ring-2 ring-neutral-900 dark:ring-white border-transparent shadow-xl scale-[1.01]"
              : "border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
                <Sprout className="w-6 h-6 stroke-[1.75]" />
              </div>
              {isCurrentFree ? (
                <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Current Plan
                </span>
              ) : selectedPlan === "free" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                  Click to select
                </span>
              )}
            </div>

            <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full w-fit mb-5">
              STANDARD
            </div>

            {/* Price changes dynamically with frequency */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-semibold text-neutral-900 dark:text-white mr-1 -translate-y-2">
                $
              </span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                0
              </span>
              <span className="text-xs text-neutral-400 ml-2 font-medium">
                {interval === "month" ? "/ month" : "/ year"}
              </span>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed min-h-[44px]">
              Great for startups and personal projects with clean invoicing and core accounting.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>10 Invoices & Estimates / mo</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>5 Clients & 10 Products</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Custom Color Palette</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>File Formats: PDF, PNG, Print</span>
              </li>
            </ul>
          </div>

          <div className="pt-2" onClick={(e) => e.stopPropagation()}>
            {inDashboard ? (
              <button
                type="button"
                disabled={isCurrentFree}
                onClick={() => setSelectedPlan("free")}
                className={`w-full rounded-full font-medium py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all ${
                  isCurrentFree
                    ? "border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-default"
                    : "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white"
                }`}
              >
                {isCurrentFree ? "Current Plan" : "Select Free Plan"}
              </button>
            ) : (
              <Link
                href="/create"
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Card 2: Professional (Price defined from Admin & changes based on selection) */}
        <div
          id="pricing-card-pro"
          role="button"
          tabIndex={0}
          onClick={() => setSelectedPlan("pro")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedPlan("pro");
            }
          }}
          className={`bg-[#18181b] text-white rounded-[28px] p-6 sm:p-8 lg:p-9 flex flex-col justify-between relative transition-all duration-200 cursor-pointer z-10 ${
            selectedPlan === "pro"
              ? "ring-2 ring-white border-transparent shadow-2xl scale-[1.02] lg:-translate-y-2"
              : "border border-neutral-800 shadow-xl hover:border-neutral-700 hover:scale-[1.01]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-sm">
                <Boxes className="w-6 h-6 stroke-[1.75]" />
              </div>
              {isCurrentPro ? (
                <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Current Plan
                </span>
              ) : selectedPlan === "pro" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-white text-neutral-950">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400 font-medium">
                  Click to select
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="bg-white text-neutral-950 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full w-fit">
                PROFESSIONAL
              </div>
              {interval === "year" && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Save {proSavingsPercent}%
                </span>
              )}
            </div>

            {/* Dynamic Price from Admin based on User Selection */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-semibold text-white mr-1 -translate-y-2">
                $
              </span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                {formatPrice(currentProPriceAmount)}
              </span>
              <span className="text-xs text-neutral-400 ml-2 font-medium">
                {interval === "month" ? "/ month" : "/ year"}
              </span>
            </div>

            <p className="text-sm text-neutral-300 mb-8 leading-relaxed min-h-[44px]">
              {interval === "month"
                ? "Billed monthly. Complete solution for growing businesses needing full invoicing power."
                : `Billed annually ($${(proYearlyAmount / 12).toFixed(2)}/mo). Maximum savings with all assets unlocked.`}
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Unlimited Invoices & Estimates</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Unlimited Clients & Products</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Custom Color Palette & Branding</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>File Formats: PDF, CSV, Print</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Up to 10 Team Members</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Recurring Invoices & Reminders</span>
              </li>
            </ul>
          </div>

          <div className="pt-2" onClick={(e) => e.stopPropagation()}>
            {inDashboard && isCurrentPro ? (
              <BillingPortalButton />
            ) : inDashboard ? (
              <UpgradeButton
                priceId={currentProPriceId}
                className="w-full rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-semibold py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                label={
                  <span className="flex items-center justify-center gap-2">
                    {interval === "month"
                      ? `Upgrade to Pro Monthly ($${formatPrice(proMonthlyAmount)}/mo)`
                      : `Upgrade to Pro Annual ($${formatPrice(proYearlyAmount)}/yr)`}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                }
              />
            ) : (
              <Link
                href="/settings/billing"
                className="w-full rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-semibold py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Card 3: Enterprise (Price defined from Admin & changes based on selection) */}
        <div
          id="pricing-card-enterprise"
          role="button"
          tabIndex={0}
          onClick={() => setSelectedPlan("enterprise")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedPlan("enterprise");
            }
          }}
          className={`bg-white dark:bg-neutral-900 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
            selectedPlan === "enterprise"
              ? "ring-2 ring-neutral-900 dark:ring-white border-transparent shadow-xl scale-[1.01]"
              : "border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
                <Sparkles className="w-6 h-6 stroke-[1.75]" />
              </div>
              {isCurrentEnterprise ? (
                <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Current Plan
                </span>
              ) : selectedPlan === "enterprise" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                  Click to select
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full w-fit">
                ENTERPRISE
              </div>
              {interval === "year" && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Save {entSavingsPercent}%
                </span>
              )}
            </div>

            {/* Dynamic Price from Admin based on User Selection */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-semibold text-neutral-900 dark:text-white mr-1 -translate-y-2">
                $
              </span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {formatPrice(currentEntPriceAmount)}
              </span>
              <span className="text-xs text-neutral-400 ml-2 font-medium">
                {interval === "month" ? "/ month" : "/ year"}
              </span>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed min-h-[44px]">
              {interval === "month"
                ? "Billed monthly. For organizations needing unlimited scale, custom roles, and priority response."
                : `Billed annually ($${(entYearlyAmount / 12).toFixed(2)}/mo). Includes dedicated controls and maximum savings.`}
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Everything in Pro Plan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Unlimited Team Members</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Custom Roles & Permissions</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>5,000 AI Credits / month</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Audit Logs & Activity Reports</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Dedicated SLA & Priority Support</span>
              </li>
            </ul>
          </div>

          <div className="pt-2" onClick={(e) => e.stopPropagation()}>
            {inDashboard && isCurrentEnterprise ? (
              <BillingPortalButton />
            ) : inDashboard ? (
              <UpgradeButton
                priceId={currentEntPriceId}
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                label={
                  <span className="flex items-center justify-center gap-2">
                    {interval === "month"
                      ? `Upgrade to Enterprise ($${formatPrice(entMonthlyAmount)}/mo)`
                      : `Upgrade to Enterprise ($${formatPrice(entYearlyAmount)}/yr)`}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                }
              />
            ) : (
              <Link
                href="/settings/billing"
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

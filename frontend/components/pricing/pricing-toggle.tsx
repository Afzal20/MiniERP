"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, Zap, Sparkles, Shield } from "lucide-react";

const pricingData = {
  monthly: [
    {
      name: "Starter",
      price: 0,
      period: "month",
      description: "Perfect for getting started",
      icon: Zap,
      iconColor: "text-yellow-300",
      iconBg: "bg-yellow-500/20",
      features: [
        "10 invoices per month",
        "3 templates",
        "PDF export",
        "Email support",
      ],
      highlighted: false,
      originalPrice: undefined,
      savings: undefined,
    },
    {
      name: "Professional",
      price: 9,
      period: "month",
      description: "Best for freelancers",
      icon: Sparkles,
      iconColor: "text-purple-300",
      iconBg: "bg-purple-500/20",
      features: [
        "Unlimited invoices",
        "20+ premium templates",
        "Cloud storage",
        "Email delivery",
        "Payment tracking",
        "Priority support",
      ],
      highlighted: true,
      originalPrice: undefined,
      savings: undefined,
    },
    {
      name: "Enterprise",
      price: 29,
      period: "month",
      description: "For growing teams",
      icon: Shield,
      iconColor: "text-blue-300",
      iconBg: "bg-blue-500/20",
      features: [
        "Everything in Pro",
        "10 team members",
        "API access",
        "Custom branding",
        "Advanced analytics",
        "Dedicated support",
      ],
      highlighted: false,
      originalPrice: undefined,
      savings: undefined,
    },
  ],
  yearly: [
    {
      name: "Starter",
      price: 0,
      period: "year",
      description: "Perfect for getting started",
      icon: Zap,
      iconColor: "text-yellow-300",
      iconBg: "bg-yellow-500/20",
      features: [
        "10 invoices per month",
        "3 templates",
        "PDF export",
        "Email support",
      ],
      highlighted: false,
      originalPrice: undefined,
      savings: undefined,
    },
    {
      name: "Professional",
      price: 90,
      period: "year",
      originalPrice: 108,
      description: "Best for freelancers",
      icon: Sparkles,
      iconColor: "text-purple-300",
      iconBg: "bg-purple-500/20",
      features: [
        "Unlimited invoices",
        "20+ premium templates",
        "Cloud storage",
        "Email delivery",
        "Payment tracking",
        "Priority support",
      ],
      highlighted: true,
      savings: "Save $18",
    },
    {
      name: "Enterprise",
      price: 290,
      period: "year",
      originalPrice: 348,
      description: "For growing teams",
      icon: Shield,
      iconColor: "text-blue-300",
      iconBg: "bg-blue-500/20",
      features: [
        "Everything in Pro",
        "10 team members",
        "API access",
        "Custom branding",
        "Advanced analytics",
        "Dedicated support",
      ],
      highlighted: false,
      savings: "Save $58",
    },
  ],
};

export function PricingToggle() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const plans = pricingData[billingPeriod];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-12">
        <Tabs
          value={billingPeriod}
          onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/10 border border-white/20 p-1">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/60">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/60">
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs bg-green-500/20 text-green-300 border-0">Save 17%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group ${plan.highlighted ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent transform scale-[1.02]" : ""
              }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-0">
                  <Zap className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pt-8 pb-6">
              <div className={`w-14 h-14 ${plan.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <plan.icon className={`w-7 h-7 ${plan.iconColor}`} />
              </div>
              <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
              <CardDescription className="mt-2 text-white/70">{plan.description}</CardDescription>
              <div className="mt-4">
                {plan.originalPrice && (
                  <div className="text-sm text-white/40 line-through">
                    ${plan.originalPrice}
                  </div>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/60">/{billingPeriod === "monthly" ? "mo" : "yr"}</span>
                </div>
                {plan.savings && (
                  <Badge variant="outline" className="mt-2 border-green-400 text-green-300">
                    {plan.savings}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
                      <Check className="h-3 w-3 text-green-300 shrink-0" />
                    </div>
                    <span className="text-sm text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                className={`w-full h-12 font-semibold ${plan.highlighted
                    ? "bg-white text-indigo-700 hover:bg-blue-50 shadow-lg"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  }`}
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href={plan.price === 0 ? "/create" : "/settings/billing"}>
                  {plan.price === 0 ? "Get Started" : "Upgrade to Pro"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

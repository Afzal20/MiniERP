"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Check, X, Zap, Sparkles, Shield } from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for trying out",
    badge: null,
    icon: Zap,
    iconColor: "text-yellow-300",
    iconBg: "bg-yellow-500/20",
    features: [
      { name: "10 invoices per month", included: true },
      { name: "3 templates", included: true },
      { name: "PDF download", included: true },
      { name: "Cloud storage", included: false },
      { name: "Email delivery", included: false },
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 9,
    description: "For serious freelancers",
    badge: "MOST POPULAR",
    icon: Sparkles,
    iconColor: "text-purple-300",
    iconBg: "bg-purple-500/20",
    features: [
      { name: "Unlimited invoices", included: true },
      { name: "20+ templates", included: true },
      { name: "Cloud storage", included: true },
      { name: "Email delivery", included: true },
      { name: "Payment tracking", included: true },
      { name: "Custom branding", included: true },
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Business",
    price: 29,
    description: "For teams & agencies",
    badge: null,
    icon: Shield,
    iconColor: "text-blue-300",
    iconBg: "bg-blue-500/20",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "5 team members", included: true },
      { name: "API access", included: true },
      { name: "White-label", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
];

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {pricingTiers.map((tier) => (
        <Card
          key={tier.name}
          className={`relative bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group ${tier.popular
              ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent transform scale-[1.02]"
              : ""
            }`}
        >
          {tier.badge && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {tier.badge}
              </span>
            </div>
          )}

          <CardHeader className="text-center pb-8 pt-10">
            <div className={`w-14 h-14 ${tier.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
              <tier.icon className={`w-7 h-7 ${tier.iconColor}`} />
            </div>
            <CardTitle className="text-2xl font-bold mb-2 text-white">{tier.name}</CardTitle>
            <div className="mb-2">
              <span className="text-5xl font-bold text-white">${tier.price}</span>
              <span className="text-white/60">/month</span>
            </div>
            <CardDescription className="text-white/70">{tier.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-4">
              {tier.features.map((feature) => (
                <li
                  key={feature.name}
                  className="flex items-start gap-3"
                >
                  {feature.included ? (
                    <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
                      <Check className="h-3 w-3 text-green-300 shrink-0" />
                    </div>
                  ) : (
                    <div className="mt-0.5 rounded-full bg-white/5 p-1">
                      <X className="h-3 w-3 text-gray-400 shrink-0" />
                    </div>
                  )}
                  <span className={feature.included ? "text-white/90" : "text-white/40"}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              className={`w-full font-semibold h-12 ${tier.popular
                  ? "bg-white text-indigo-700 hover:bg-blue-50 hover:scale-[1.02] transition-transform shadow-lg"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-transform"
                } `}
              variant={tier.popular ? "default" : "outline"}
              asChild
            >
              <Link href={tier.popular ? "/auth/sign-up" : "/create"}>{tier.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

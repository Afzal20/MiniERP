"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, X } from "lucide-react";

const features = [
  {
    category: "Invoice Management",
    items: [
      { name: "Monthly invoices", free: "10", pro: "Unlimited", business: "Unlimited" },
      { name: "Templates", free: "3", pro: "20+", business: "20+" },
      { name: "PDF export", free: true, pro: true, business: true },
      { name: "Cloud storage", free: false, pro: true, business: true },
      { name: "Email delivery", free: false, pro: true, business: true },
    ],
  },
  {
    category: "Features",
    items: [
      { name: "Payment tracking", free: false, pro: true, business: true },
      { name: "Custom branding", free: false, pro: true, business: true },
      { name: "Recurring invoices", free: false, pro: true, business: true },
      { name: "Multi-currency", free: false, pro: false, business: true },
      { name: "API access", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Collaboration",
    items: [
      { name: "Team members", free: "1", pro: "1", business: "5" },
      { name: "Client portal", free: false, pro: false, business: true },
      { name: "Role permissions", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Support",
    items: [
      { name: "Email support", free: true, pro: true, business: true },
      { name: "Priority support", free: false, pro: false, business: true },
      { name: "Dedicated manager", free: false, pro: false, business: true },
    ],
  },
];

export function PricingComparison() {
  const renderCell = (value: string | boolean | number) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-300 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-white/30 mx-auto" />
      );
    }
    return <span className="text-sm text-white/90">{value}</span>;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">Compare All Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-semibold text-white">Features</th>
                <th className="text-center py-4 px-4 font-semibold text-white">Free</th>
                <th className="text-center py-4 px-4 font-semibold bg-white/5 rounded-t-lg text-white">Pro</th>
                <th className="text-center py-4 px-4 font-semibold text-white">Business</th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, categoryIndex) => (
                <React.Fragment key={category.category}>
                  <tr className="bg-black/20">
                    <td
                      colSpan={4}
                      className="py-3 px-4 font-semibold text-sm text-white"
                    >
                      {category.category}
                    </td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr
                      key={`${categoryIndex}-${itemIndex}`}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-white/90">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderCell(item.free)}
                      </td>
                      <td className="py-3 px-4 text-center bg-white/5">
                        {renderCell(item.pro)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderCell(item.business)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

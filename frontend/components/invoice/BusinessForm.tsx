"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import type { InvoiceData } from "@/lib/invoice";

type Props = {
  data: InvoiceData;
  updateField: (field: keyof InvoiceData, value: string | number) => void;
};

export function BusinessForm({ data, updateField }: Props) {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-indigo-700">
          <Building2 className="w-5 h-5" />
          Your Business Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="Your Company Name"
              value={data.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessEmail">Email</Label>
            <Input
              id="businessEmail"
              type="email"
              placeholder="you@company.com"
              value={data.businessEmail}
              onChange={(e) => updateField("businessEmail", e.target.value)}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessPhone">Phone</Label>
            <Input
              id="businessPhone"
              placeholder="+1 (555) 000-0000"
              value={data.businessPhone}
              onChange={(e) => updateField("businessPhone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Address</Label>
            <Input
              id="businessAddress"
              placeholder="City, Country"
              value={data.businessAddress}
              onChange={(e) => updateField("businessAddress", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

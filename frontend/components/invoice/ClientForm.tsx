"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import type { InvoiceData } from "@/lib/invoice";

type Props = {
  data: InvoiceData;
  updateField: (field: keyof InvoiceData, value: string | number) => void;
};

export function ClientForm({ data, updateField }: Props) {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
          <User className="w-5 h-5" />
          Client Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              placeholder="Client or Company Name"
              value={data.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="client@example.com"
              value={data.clientEmail}
              onChange={(e) => updateField("clientEmail", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientAddress">Address</Label>
          <Input
            id="clientAddress"
            placeholder="Client Address"
            value={data.clientAddress}
            onChange={(e) => updateField("clientAddress", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

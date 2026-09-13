"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencySelect } from "@/components/CurrencySelect";
import { Hash } from "lucide-react";
import type { InvoiceData } from "@/lib/invoice";

type Props = {
  data: InvoiceData;
  updateField: (field: keyof InvoiceData, value: string | number) => void;
};

export function InvoiceDetailsForm({ data, updateField }: Props) {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
          <Hash className="w-5 h-5" />
          Invoice Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              placeholder="INV-001"
              value={data.invoiceNumber}
              onChange={(e) => updateField("invoiceNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <CurrencySelect
              value={data.currency}
              onChange={(value) => updateField("currency", value)}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={data.invoiceDate}
              onChange={(e) => updateField("invoiceDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={data.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

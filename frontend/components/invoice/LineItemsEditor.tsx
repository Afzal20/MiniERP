"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Plus, Trash2 } from "lucide-react";
import type { InvoiceData, InvoiceItem } from "@/lib/invoice";
import { getCurrencySymbol, formatCurrency } from "@/lib/invoice";

type Props = {
  items: InvoiceItem[];
  currency: string;
  taxRate: number;
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  updateField: (field: keyof InvoiceData, value: string | number) => void;
};

export function LineItemsEditor({
  items,
  currency,
  taxRate,
  addItem,
  removeItem,
  updateItem,
  updateField,
}: Props) {
  const symbol = getCurrencySymbol(currency);

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Calculator className="w-5 h-5" />
          Line Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="p-4 bg-card rounded-lg space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Service or product description"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Rate ({symbol})</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <div className="text-right text-sm font-medium text-foreground">
              Amount: {formatCurrency(item.quantity * item.rate, currency)}
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Another Item
        </Button>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="0"
            value={taxRate}
            onChange={(e) => updateField("taxRate", parseFloat(e.target.value) || 0)}
            className="w-32"
          />
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconPackage,
  IconPlus,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CurrencySelect } from "@/components/CurrencySelect";
import type { Client, Product, Profile } from "@/lib/erp/types";
import { formatCurrency } from "@/lib/erp/format";
import {
  createInvoiceAction,
  type CreateInvoiceInput,
} from "@/app/(dashboard)/actions";
import { generateInvoiceItems } from "@/app/(dashboard)/ai-actions";

interface ItemRow {
  key: string;
  product_id: string | null;
  description: string;
  quantity: number;
  rate: number;
}

export interface CreateInvoiceFormProps {
  clients: Client[];
  products: Product[];
  profile: Profile | null;
  suggestedNumber: string;
  defaultClientId?: string;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

let rowSeq = 0;
function newRow(partial?: Partial<ItemRow>): ItemRow {
  rowSeq += 1;
  return {
    key: `row-${Date.now()}-${rowSeq}`,
    product_id: null,
    description: "",
    quantity: 1,
    rate: 0,
    ...partial,
  };
}

export function CreateInvoiceForm({
  clients,
  products,
  profile,
  suggestedNumber,
  defaultClientId,
}: CreateInvoiceFormProps) {
  const router = useRouter();
  const [saving, setSaving] = React.useState<"draft" | "pending" | null>(null);

  const initialClient = clients.find((c) => c.id === defaultClientId);
  const [clientId, setClientId] = React.useState(initialClient?.id ?? "");
  const [clientName, setClientName] = React.useState(initialClient?.name ?? "");
  const [clientEmail, setClientEmail] = React.useState(
    initialClient?.email ?? "",
  );
  const [clientAddress, setClientAddress] = React.useState(
    initialClient?.address ?? "",
  );
  const [invoiceNumber, setInvoiceNumber] = React.useState(suggestedNumber);
  const [issueDate, setIssueDate] = React.useState(today());
  const [dueDate, setDueDate] = React.useState(addDays(14));
  const [currency, setCurrency] = React.useState(
    profile?.default_currency ?? "USD",
  );
  const [taxRate, setTaxRate] = React.useState(
    Number(profile?.default_tax_rate ?? 0),
  );
  const [discount, setDiscount] = React.useState(0);
  const [notes, setNotes] = React.useState(profile?.default_notes ?? "");
  const [terms, setTerms] = React.useState(profile?.default_terms ?? "");

  const [items, setItems] = React.useState<ItemRow[]>([newRow()]);
  const [aiOpen, setAiOpen] = React.useState(false);

  function handleClientChange(value: string) {
    setClientId(value === "none" ? "" : value);
    if (value === "none") {
      setClientName("");
      setClientEmail("");
      setClientAddress("");
      return;
    }
    const client = clients.find((c) => c.id === value);
    if (client) {
      setClientName(client.name);
      setClientEmail(client.email);
      setClientAddress(client.address ?? "");
    }
  }

  function addFromCatalog(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setItems((prev) => [
      ...prev.filter((r) => r.description.trim() !== ""),
      newRow({
        product_id: product.id,
        description: product.description
          ? `${product.name} — ${product.description}`
          : product.name,
        rate: Number(product.unit_price),
        quantity: 1,
      }),
    ]);
  }

  function updateRow(key: string, patch: Partial<ItemRow>) {
    setItems((prev) =>
      prev.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function removeRow(key: string) {
    setItems((prev) => {
      const next = prev.filter((row) => row.key !== key);
      return next.length > 0 ? next : [newRow()];
    });
  }

  const subtotal = items.reduce(
    (s, it) => s + (Number(it.quantity) || 0) * (Number(it.rate) || 0),
    0,
  );
  const appliedDiscount = Math.min(Math.max(0, discount || 0), subtotal);
  const taxAmount =
    ((subtotal - appliedDiscount) * (Number(taxRate) || 0)) / 100;
  const total = subtotal - appliedDiscount + taxAmount;

  async function handleSave(status: "draft" | "pending") {
    setSaving(status);
    try {
      const input: CreateInvoiceInput = {
        client_id: clientId || null,
        client_name: clientName,
        client_email: clientEmail,
        client_address: clientAddress,
        invoice_number: invoiceNumber.trim(),
        issue_date: issueDate,
        due_date: dueDate,
        currency,
        status,
        tax_rate: Number(taxRate) || 0,
        discount_amount: appliedDiscount,
        notes,
        terms,
        items: items.map((it) => ({
          description: it.description,
          quantity: Number(it.quantity) || 0,
          rate: Number(it.rate) || 0,
          product_id: it.product_id,
        })),
      };
      const result = await createInvoiceAction(input);
      if (!result.ok || !result.id) {
        toast.error(result.error ?? "Failed to save invoice.");
        return;
      }
      toast.success(
        status === "draft"
          ? "Draft saved."
          : `Invoice ${invoiceNumber || ""} created.`,
      );
      router.push(`/invoices/${result.id}`);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: form */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Client */}
        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
            <CardDescription>
              Pick a saved client or enter details manually.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Client</Label>
              <Select value={clientId || "none"} onValueChange={handleClientChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No saved client —</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                      {c.company ? ` (${c.company})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client_email">Client Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="jane@company.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_address">Client Address</Label>
              <Textarea
                id="client_address"
                rows={2}
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="123 Street, City, Country"
              />
            </div>
          </CardContent>
        </Card>

        {/* Line items */}
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>
                Add from your catalog, write custom lines, or let AI draft them.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAiOpen(true)}
              >
                <IconSparkles className="size-4" />
                Generate with AI
              </Button>
              <Select value="" onValueChange={addFromCatalog}>
                <SelectTrigger size="sm" className="w-[200px]">
                  <IconPackage className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Add from catalog" />
                </SelectTrigger>
                <SelectContent>
                  {products.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No products yet.
                    </div>
                  )}
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} · {formatCurrency(Number(p.unit_price), p.currency)}
                      {p.track_stock ? ` · ${p.stock_quantity} in stock` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {items.map((row) => {
              const catalogProduct = products.find(
                (p) => p.id === row.product_id,
              );
              const overStock =
                catalogProduct?.track_stock &&
                Number(row.quantity) > Number(catalogProduct.stock_quantity);
              const amount =
                (Number(row.quantity) || 0) * (Number(row.rate) || 0);
              return (
                <div key={row.key} className="flex flex-col gap-2">
                  <div className="grid grid-cols-12 items-start gap-2">
                    <div className="col-span-12 sm:col-span-6">
                      <Input
                        value={row.description}
                        onChange={(e) =>
                          updateRow(row.key, { description: e.target.value })
                        }
                        placeholder="Description of service or product"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(row.key, {
                            quantity: Number(e.target.value),
                          })
                        }
                        placeholder="Qty"
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.rate}
                        onChange={(e) =>
                          updateRow(row.key, { rate: Number(e.target.value) })
                        }
                        placeholder="Rate"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-1 sm:col-span-2">
                      <span className="hidden truncate pr-1 text-sm tabular-nums text-muted-foreground md:inline">
                        {formatCurrency(amount, currency)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeRow(row.key)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {overStock && (
                    <Badge variant="destructive" className="w-fit gap-1">
                      <IconAlertTriangle className="size-3" />
                      Only {catalogProduct.stock_quantity} in stock
                    </Badge>
                  )}
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => setItems((prev) => [...prev, newRow()])}
            >
              <IconPlus className="size-4" />
              Add Line Item
            </Button>
          </CardContent>
        </Card>

        {/* Notes & terms */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Terms</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thank you for your business!"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="terms">Terms</Label>
              <Textarea
                id="terms"
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Payment due within 14 days..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: summary */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="invoice_number">Invoice Number</Label>
              <Input
                id="invoice_number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <CurrencySelect value={currency} onChange={setCurrency} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount">Discount ({currency})</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="tabular-nums">
                    −{formatCurrency(appliedDiscount, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tax ({Number(taxRate) || 0}%)
                </span>
                <span className="tabular-nums">
                  {formatCurrency(taxAmount, currency)}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(total, currency)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              className="w-full"
              disabled={saving !== null}
              onClick={() => handleSave("pending")}
            >
              {saving === "pending" ? "Saving..." : "Save & Mark Sent"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={saving !== null}
              onClick={() => handleSave("draft")}
            >
              {saving === "draft" ? "Saving..." : "Save as Draft"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AiItemsDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        currency={currency}
        onGenerated={(generated) => {
          setItems((prev) => [
            ...prev.filter((r) => r.description.trim() !== ""),
            ...generated.map((it) =>
              newRow({
                description: it.description,
                quantity: it.quantity,
                rate: it.rate,
              }),
            ),
          ]);
        }}
      />
    </div>
  );
}

function AiItemsDialog({
  open,
  onOpenChange,
  currency,
  onGenerated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  onGenerated: (items: { description: string; quantity: number; rate: number }[]) => void;
}) {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await generateInvoiceItems(prompt, currency);
      if (!res.ok || !res.items || res.items.length === 0) {
        toast.error(res.error ?? "The AI returned nothing useful. Try rephrasing.");
        return;
      }
      onGenerated(res.items);
      toast.success(`${res.items.length} line item${res.items.length === 1 ? "" : "s"} generated.`);
      setPrompt("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconSparkles className="size-4" />
            Generate Line Items
          </DialogTitle>
          <DialogDescription>
            Describe what you&apos;d like to bill in plain language.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={600}
          placeholder={`e.g. 12 hours of website design work, plus a logo redesign for ${currency === "USD" ? "$300" : "300"}, and monthly hosting for a year`}
        />
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={loading || prompt.trim().length < 4}>
            {loading ? "Thinking..." : "Generate Items"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

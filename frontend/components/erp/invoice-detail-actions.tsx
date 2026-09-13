"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconCheck,
  IconCoin,
  IconExternalLink,
  IconSend,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InvoiceWithItems } from "@/lib/erp/types";
import { formatCurrency } from "@/lib/erp/format";
import { PAYMENT_METHODS } from "@/lib/erp/types";
import {
  deleteInvoice,
  markInvoicePaid,
  recordPayment,
  sendInvoiceAction,
  updateInvoiceStatus,
} from "@/app/(dashboard)/actions";
import { DownloadInvoicePDF } from "@/components/invoice/DownloadInvoicePDF";
import type { InvoiceData } from "@/lib/invoice";

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

function toPdfData(inv: InvoiceWithItems): InvoiceData {
  return {
    businessName: inv.business_name,
    businessEmail: inv.business_email,
    businessAddress: inv.business_address,
    businessPhone: inv.business_phone,
    clientName: inv.client_name,
    clientEmail: inv.client_email,
    clientAddress: inv.client_address,
    invoiceNumber: inv.invoice_number,
    invoiceDate: inv.issue_date,
    dueDate: inv.due_date,
    currency: inv.currency,
    items: inv.items.map((i) => ({
      id: i.id,
      description: i.description,
      quantity: Number(i.quantity),
      rate: Number(i.rate),
    })),
    taxRate: Number(inv.tax_rate),
    notes: inv.notes,
  };
}

export function InvoiceDetailActions({ invoice }: { invoice: InvoiceWithItems }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [payOpen, setPayOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const balance = Math.max(0, Number(invoice.total) - Number(invoice.paid_amount));

  async function run(fn: () => Promise<unknown>, successMsg?: string) {
    setBusy(true);
    try {
      await fn();
      if (successMsg) toast.success(successMsg);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function handleDelete() {
    run(async () => {
      await deleteInvoice(invoice.id);
      router.push("/invoices");
    });
  }

  async function handleCopyLink() {
    try {
      const publicUrl = `${window.location.origin}/view/${invoice.id}`;
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Public invoice link copied to clipboard.");
    } catch {
      toast.error("Failed to copy link.");
    }
  }

  async function handleSendEmail() {
    run(async () => {
      const res = await sendInvoiceAction(invoice.id);
      if (!res.ok) throw new Error(res.error || "Failed to send invoice");
    }, `Invoice sent to ${invoice.client_email || "client"}.`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DownloadInvoicePDF data={toPdfData(invoice)} label="PDF" />

      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={handleCopyLink}
        title="Copy customer-facing invoice link"
      >
        <IconShare className="size-4" />
        Share Link
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={handleSendEmail}
        title="Send invoice via email to client"
      >
        <IconSend className="size-4" />
        Send via Email
      </Button>

      {invoice.status !== "paid" && balance > 0 && (
        <Dialog open={payOpen} onOpenChange={setPayOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <IconCoin className="size-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <RecordPaymentForm
              invoiceId={invoice.id}
              balance={balance}
              currency={invoice.currency}
              onDone={() => {
                setPayOpen(false);
                router.refresh();
                toast.success("Payment recorded.");
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={busy}>
            More Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className={statusStyles[invoice.status]}>
            <Badge variant="secondary" className={`${statusStyles[invoice.status]} border-transparent`}>
              {invoice.status}
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.open(`/view/${invoice.id}`, '_blank')}>
            <IconExternalLink className="size-4" />
            Open Public Preview
          </DropdownMenuItem>
          {invoice.status !== "paid" && (
            <DropdownMenuItem
              onClick={() => run(() => markInvoicePaid(invoice.id), "Marked as paid.")}
            >
              <IconCheck className="size-4" />
              Mark as Paid
            </DropdownMenuItem>
          )}
          {(["draft", "pending", "overdue", "cancelled"] as const)
            .filter((s) => s !== invoice.status)
            .map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() =>
                  run(() => updateInvoiceStatus(invoice.id, s), `Status set to ${s}.`)
                }
              >
                Set status: {s}
              </DropdownMenuItem>
            ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <IconTrash className="size-4" />
            Delete Invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/invoices")}
      >
        <IconArrowLeft className="size-4" />
        Back
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setDeleteOpen(false)
                handleDelete()
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RecordPaymentForm({
  invoiceId,
  balance,
  currency,
  onDone,
}: {
  invoiceId: string;
  balance: number;
  currency: string;
  onDone: () => void;
}) {
  const [saving, setSaving] = React.useState(false);
  const todayStr = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const result = await recordPayment(fd);
      if (!result.ok) {
        toast.error(result.error ?? "Failed to record payment.");
        return;
      }
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="invoice_id" value={invoiceId} />
      <DialogHeader>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogDescription>
          Outstanding balance:{" "}
          <span className="font-medium text-foreground">
            {formatCurrency(balance, currency)}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ({currency})</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={balance.toFixed(2)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payment_date">Date</Label>
            <Input
              id="payment_date"
              name="payment_date"
              type="date"
              defaultValue={todayStr}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="payment_method">Method</Label>
            <Select name="payment_method" defaultValue="cash">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reference">Reference</Label>
            <Input id="reference" name="reference" placeholder="Txn / check #" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Payment"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export { statusStyles };

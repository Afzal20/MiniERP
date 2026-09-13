import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { erpApi } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/erp/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PublicInvoiceActions } from "./public-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const inv = await erpApi.getPublicInvoice(id);
    const bal = Number(inv.balance_due ?? Math.max(0, Number(inv.total) - Number(inv.paid_amount || 0)));
    return {
      title: `Invoice ${inv.invoice_number} · ${inv.business_name || "BizPilot"}`,
      description: `Invoice ${inv.invoice_number} issued to ${inv.client_name || "Client"}. Balance due: ${formatCurrency(bal, inv.currency)}.`,
    };
  } catch {
    return {
      title: "Invoice · BizPilot",
    };
  }
}

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
  overdue: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300",
  draft: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300",
  cancelled: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
};

export default function PublicInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <PublicInvoiceLoader params={params} />
    </Suspense>
  );
}

async function PublicInvoiceLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let invoice;
  try {
    invoice = await erpApi.getPublicInvoice(id);
  } catch {
    notFound();
  }

  if (!invoice) notFound();

  const balanceDue = Number(
    invoice.balance_due ?? Math.max(0, Number(invoice.total) - Number(invoice.paid_amount || 0))
  );

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-8 px-4 sm:px-6">
      {/* Top Banner with Action Toolbar */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-bold tracking-tight text-sm text-neutral-600 dark:text-neutral-400">
            Powered by BizPilot
          </span>
        </div>
        <PublicInvoiceActions invoiceId={invoice.id} invoiceNumber={invoice.invoice_number} />
      </div>

      {/* Main Invoice Document Container */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Status Header Bar */}
        <div className="bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Invoice Status
            </span>
            <Badge variant="outline" className={`capitalize font-semibold text-xs px-2.5 py-0.5 ${statusStyles[invoice.status] || ""}`}>
              {invoice.status}
            </Badge>
          </div>
          <div className="text-xs text-neutral-500">
            Due on <strong className="text-neutral-900 dark:text-white">{formatDate(invoice.due_date)}</strong>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-10">
          {/* Business & Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {invoice.business_name || "BizPilot Business"}
              </h1>
              {invoice.business_email && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {invoice.business_email}
                </p>
              )}
              {invoice.business_address && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line max-w-sm">
                  {invoice.business_address}
                </p>
              )}
              {invoice.business_phone && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {invoice.business_phone}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right space-y-1 sm:min-w-[200px]">
              <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Invoice Number
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold">
                {invoice.invoice_number}
              </div>
              <div className="pt-2 text-xs text-neutral-500 space-y-1">
                <div>
                  Issue Date: <span className="font-medium text-neutral-900 dark:text-white">{formatDate(invoice.issue_date)}</span>
                </div>
                <div>
                  Due Date: <span className="font-medium text-neutral-900 dark:text-white">{formatDate(invoice.due_date)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billed To Section */}
          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Billed To
            </div>
            <div className="space-y-1">
              <div className="font-bold text-lg">
                {invoice.client_name || "Valued Client"}
              </div>
              {invoice.client_email && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {invoice.client_email}
                </div>
              )}
              {invoice.client_address && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line max-w-sm">
                  {invoice.client_address}
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-neutral-50 dark:bg-neutral-800/50">
                <TableRow>
                  <TableHead className="font-semibold text-neutral-900 dark:text-white">Description</TableHead>
                  <TableHead className="text-right font-semibold text-neutral-900 dark:text-white w-24">Qty</TableHead>
                  <TableHead className="text-right font-semibold text-neutral-900 dark:text-white w-32">Rate</TableHead>
                  <TableHead className="text-right font-semibold text-neutral-900 dark:text-white w-32">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <TableRow key={item.id || idx}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(Number(item.rate), invoice.currency)}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatCurrency(Number(item.amount), invoice.currency)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-neutral-500 py-6">
                      No items listed.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Totals Calculation */}
          <div className="flex flex-col sm:flex-row justify-between gap-8 pt-4">
            <div className="space-y-4 max-w-md">
              {invoice.notes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Notes
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Payment Terms
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed">
                    {invoice.terms}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between py-1 text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(Number(invoice.subtotal), invoice.currency)}</span>
              </div>
              {Number(invoice.discount_amount) > 0 && (
                <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatCurrency(Number(invoice.discount_amount), invoice.currency)}</span>
                </div>
              )}
              {Number(invoice.tax_amount) > 0 && (
                <div className="flex justify-between py-1 text-neutral-600 dark:text-neutral-400">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span className="tabular-nums">+{formatCurrency(Number(invoice.tax_amount), invoice.currency)}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(Number(invoice.total), invoice.currency)}</span>
              </div>
              {Number(invoice.paid_amount) > 0 && (
                <div className="flex justify-between py-1 text-neutral-500 text-xs">
                  <span>Paid to Date</span>
                  <span className="tabular-nums">-{formatCurrency(Number(invoice.paid_amount), invoice.currency)}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 flex justify-between font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
                <span>Balance Due</span>
                <span className="tabular-nums">{formatCurrency(balanceDue, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info for client */}
        <div className="bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200 dark:border-neutral-800 px-8 py-6 text-center text-xs text-neutral-500 space-y-1">
          <p>Thank you for your business.</p>
          <p>Questions regarding this invoice? Contact {invoice.business_email || "the issuer directly"}.</p>
        </div>
      </div>
    </div>
  );
}

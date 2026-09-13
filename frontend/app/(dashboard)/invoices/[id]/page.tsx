import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  IconBuildingStore,
  IconCalendarDue,
  IconCoin,
  IconMail,
  IconUser,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInvoice } from "@/lib/erp/queries";
import { requireOrg } from "@/lib/erp/org";
import { formatCurrency, formatDate, getInitials } from "@/lib/erp/format";
import { PAYMENT_METHODS } from "@/lib/erp/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  InvoiceDetailActions,
  statusStyles,
} from "@/components/erp/invoice-detail-actions";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <InvoiceDetailLoader params={params} />
    </Suspense>
  );
}

async function InvoiceDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { org } = await requireOrg();
  const invoice = await getInvoice(id);
  // Org isolation: a valid id from another organization must 404
  if (!invoice || (invoice.organization_id && invoice.organization_id !== org.id)) notFound();

  const balance = Math.max(
    0,
    Number(invoice.total) - Number(invoice.paid_amount),
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 px-4 lg:px-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-mono text-2xl font-bold">
                  {invoice.invoice_number}
                </h2>
                <Badge
                  variant="secondary"
                  className={statusStyles[invoice.status]}
                >
                  {invoice.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Issued {formatDate(invoice.issue_date)} · Due{" "}
                {formatDate(invoice.due_date)}
              </p>
            </div>
            <InvoiceDetailActions invoice={invoice} />
          </div>

          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
            {/* Left column */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Parties */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardDescription>From</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-start gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <IconBuildingStore className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 text-sm">
                      <p className="font-medium">{invoice.business_name || "—"}</p>
                      {invoice.business_email && (
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <IconMail className="size-3" />
                          {invoice.business_email}
                        </p>
                      )}
                      {invoice.business_phone && (
                        <p className="text-muted-foreground">
                          {invoice.business_phone}
                        </p>
                      )}
                      {invoice.business_address && (
                        <p className="whitespace-pre-line text-muted-foreground">
                          {invoice.business_address}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Bill To</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-start gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {getInitials(invoice.client_name || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 text-sm">
                      <p className="font-medium">{invoice.client_name || "—"}</p>
                      {invoice.client_email && (
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <IconMail className="size-3" />
                          {invoice.client_email}
                        </p>
                      )}
                      {invoice.client_address && (
                        <p className="whitespace-pre-line text-muted-foreground">
                          {invoice.client_address}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {Number(item.quantity)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCurrency(Number(item.rate), invoice.currency)}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(Number(item.amount), invoice.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Payment history */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    {invoice.payments.length} payment
                    {invoice.payments.length === 1 ? "" : "s"} recorded
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {invoice.payments.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No payments recorded yet.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoice.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.payment_date)}</TableCell>
                            <TableCell>
                              {PAYMENT_METHODS.find(
                                (m) => m.value === payment.payment_method,
                              )?.label ?? payment.payment_method}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {payment.reference || "—"}
                            </TableCell>
                            <TableCell className="text-right font-medium tabular-nums">
                              {formatCurrency(
                                Number(payment.amount),
                                invoice.currency,
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column: totals */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5 text-sm">
                  <Row
                    label="Subtotal"
                    value={formatCurrency(Number(invoice.subtotal), invoice.currency)}
                  />
                  {Number(invoice.discount_amount) > 0 && (
                    <Row
                      label={`Discount`}
                      value={`−${formatCurrency(Number(invoice.discount_amount), invoice.currency)}`}
                    />
                  )}
                  <Row
                    label={`Tax (${Number(invoice.tax_rate)}%)`}
                    value={formatCurrency(Number(invoice.tax_amount), invoice.currency)}
                  />
                  <Separator className="my-1.5" />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {formatCurrency(Number(invoice.total), invoice.currency)}
                    </span>
                  </div>
                  <Separator className="my-1.5" />
                  <Row
                    label="Paid"
                    value={formatCurrency(Number(invoice.paid_amount), invoice.currency)}
                  />
                  <div
                    className={`flex justify-between font-medium ${
                      balance > 0 ? "text-destructive" : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    <span>Balance Due</span>
                    <span className="tabular-nums">
                      {formatCurrency(balance, invoice.currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {(invoice.notes || invoice.terms) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes & Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 text-sm">
                    {invoice.notes && (
                      <div>
                        <p className="mb-1 flex items-center gap-1 font-medium text-muted-foreground">
                          <IconUser className="size-3" /> Notes
                        </p>
                        <p className="whitespace-pre-line">{invoice.notes}</p>
                      </div>
                    )}
                    {invoice.terms && (
                      <div>
                        <p className="mb-1 flex items-center gap-1 font-medium text-muted-foreground">
                          <IconCalendarDue className="size-3" /> Terms
                        </p>
                        <p className="whitespace-pre-line">{invoice.terms}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCoin className="size-4 text-muted-foreground" />
                    Collection Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {Number(invoice.paid_amount) <= 0
                    ? "No payments received yet."
                    : balance <= 0
                      ? "Fully paid. Thank you!"
                      : `${Math.round((Number(invoice.paid_amount) / Number(invoice.total)) * 100)}% collected.`}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

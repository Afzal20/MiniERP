import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireOrg } from "@/lib/erp/org";
import { getClient, getInvoices } from "@/lib/erp/queries";
import { formatCurrency, formatDate, getInitials } from "@/lib/erp/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconArrowLeft,
  IconBuildingStore,
  IconMail,
  IconPhone,
  IconPlus,
} from "@tabler/icons-react";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <ClientDetailLoader params={params} />
    </Suspense>
  );
}

async function ClientDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { org } = await requireOrg();

  const [client, allInvoices] = await Promise.all([
    getClient(id),
    getInvoices(org.id),
  ]);

  if (!client) notFound();

  // Filter invoices for this client
  const clientInvoices = allInvoices.filter(
    (inv) => inv.client_id === id || (inv as any).client === id,
  );

  const totalBilled = clientInvoices.reduce(
    (sum, inv) => sum + Number(inv.total || 0),
    0,
  );
  const totalPaid = clientInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number(inv.total || 0), 0);
  const outstanding = Math.max(0, totalBilled - totalPaid);

  const statusStyles: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    overdue: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    draft: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300",
    cancelled: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Header toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/clients">
                <IconArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
                  <Badge variant={client.status === "active" ? "default" : "secondary"}>
                    {client.status}
                  </Badge>
                </div>
                {client.company && (
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                )}
              </div>
            </div>
          </div>

          <Button asChild size="sm">
            <Link href={`/create-invoice?client=${client.id}`}>
              <IconPlus className="size-4 mr-1" />
              Create Invoice
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 lg:px-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Invoiced</p>
              <p className="text-2xl font-semibold tabular-nums">
                {formatCurrency(totalBilled)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalPaid)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              <p className="text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                {formatCurrency(outstanding)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Client Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
              <CardDescription>Direct details for communication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <IconMail className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3">
                  <IconPhone className="size-4 text-muted-foreground shrink-0" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.company && (
                <div className="flex items-center gap-3">
                  <IconBuildingStore className="size-4 text-muted-foreground shrink-0" />
                  <span>{client.company}</span>
                </div>
              )}
              {client.address && (
                <div className="pt-2 border-t text-xs text-muted-foreground whitespace-pre-line">
                  <strong>Billing Address:</strong>
                  <p className="mt-1 text-foreground">{client.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Invoices Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Invoice History ({clientInvoices.length})</CardTitle>
              <CardDescription>All invoices issued to this client</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No invoices generated for this client yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono font-medium">
                          <Link href={`/invoices/${inv.id}`} className="hover:underline">
                            {inv.invoice_number}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatDate(inv.issue_date)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatDate(inv.due_date)}
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {formatCurrency(Number(inv.total), inv.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusStyles[inv.status] || ""}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/invoices/${inv.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

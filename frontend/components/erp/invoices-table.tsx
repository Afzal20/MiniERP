"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconCheck,
  IconDots,
  IconDownload,
  IconExternalLink,
  IconPlus,
  IconSearch,
  IconSend,
  IconShare,
  IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Invoice } from "@/lib/erp/types"
import { formatCurrency, formatDate } from "@/lib/erp/format"
import { deleteInvoice, markInvoicePaid, sendInvoiceAction } from "@/app/(dashboard)/actions"
import { exportToCSV } from "@/lib/erp/export-csv"

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
}

export function InvoicesTable({ invoices, canCreate = true }: { invoices: Invoice[], canCreate?: boolean }) {
  const [search, setSearch] = React.useState("")
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const filtered = invoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (inv.client_name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const totalBilled = invoices.reduce((s, i) => s + Number(i.total), 0)
  const paidAmount = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.total), 0)
  const outstandingAmount = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i) => s + Number(i.total), 0)

  async function handleMarkPaid(id: string) {
    setPendingId(id)
    try {
      await markInvoicePaid(id)
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(id: string) {
    setPendingId(id)
    try {
      await deleteInvoice(id)
    } finally {
      setPendingId(null)
    }
  }

  async function handleSendEmail(id: string, email?: string) {
    setPendingId(id)
    try {
      const res = await sendInvoiceAction(id)
      if (res.ok) {
        toast.success(`Invoice sent to ${email || "client"}.`)
      } else {
        toast.error(res.error || "Failed to send invoice.")
      }
    } catch {
      toast.error("Failed to send invoice.")
    } finally {
      setPendingId(null)
    }
  }

  async function handleCopyLink(id: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/view/${id}`)
      toast.success("Public invoice link copied.")
    } catch {
      toast.error("Failed to copy link.")
    }
  }

  function handleExportCSV() {
    const headers = ["Invoice Number", "Client", "Amount", "Currency", "Status", "Issue Date", "Due Date"]
    const rows = invoices.map((inv) => [
      inv.invoice_number,
      inv.client_name || "",
      inv.total,
      inv.currency,
      inv.status,
      inv.issue_date,
      inv.due_date,
    ])
    exportToCSV(`invoices-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
    toast.success("Invoices exported to CSV.")
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Billed</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(totalBilled)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Collected</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(paidAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(outstandingAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + table */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-9 w-62.5"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <IconDownload className="size-4" />
                Export CSV
              </Button>
              {canCreate && (
                <Button asChild size="sm">
                  <Link href="/create-invoice">
                    <IconPlus className="size-4" />
                    New Invoice
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {(["all", "paid", "pending", "overdue", "draft"] as const).map(
            (tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(tab === "all"
                          ? filtered
                          : filtered.filter((i) => i.status === tab)
                        ).length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="py-10 text-center text-sm text-muted-foreground"
                            >
                              No invoices found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          (tab === "all"
                            ? filtered
                            : filtered.filter((i) => i.status === tab)
                          ).map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-mono text-sm font-medium">
                                <Link
                                  href={`/invoices/${invoice.id}`}
                                  className="hover:underline"
                                >
                                  {invoice.invoice_number}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {invoice.client_name || "—"}
                              </TableCell>
                              <TableCell className="text-right font-medium tabular-nums">
                                {formatCurrency(Number(invoice.total), invoice.currency)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={statusStyles[invoice.status]}
                                >
                                  {invoice.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatDate(invoice.issue_date)}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatDate(invoice.due_date)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-8"
                                      disabled={pendingId === invoice.id}
                                    >
                                      <IconDots className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/invoices/${invoice.id}`}>
                                        View Details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCopyLink(invoice.id)}>
                                      <IconShare className="size-4" />
                                      Copy Public Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.open(`/view/${invoice.id}`, '_blank')}>
                                      <IconExternalLink className="size-4" />
                                      View Public Page
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendEmail(invoice.id, invoice.client_email)}>
                                      <IconSend className="size-4" />
                                      Send via Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {invoice.status !== "paid" && (
                                      <DropdownMenuItem
                                        onClick={() => handleMarkPaid(invoice.id)}
                                      >
                                        <IconCheck className="size-4" />
                                        Mark as Paid
                                      </DropdownMenuItem>
                                    )}
                                      <DropdownMenuItem
                                        onClick={() => setDeleteId(invoice.id)}
                                        className="text-destructive"
                                      >
                                        <IconTrash className="size-4" />
                                        Delete
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          )}
        </Tabs>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
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
                if (deleteId) handleDelete(deleteId)
                setDeleteId(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
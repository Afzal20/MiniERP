import Link from "next/link"
import {
  IconArrowUpRight,
  IconAlertTriangle,
  IconFileInvoice,
  IconUsers,
  IconWallet,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RevenueExpenseChart } from "@/components/dashboard/revenue-expense-chart"
import { getDashboardStats } from "@/lib/erp/queries"
import { requireOrg } from "@/lib/erp/org"
import { formatCurrency, formatDate } from "@/lib/erp/format"

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
}

export default async function DashboardPage() {
  const { org } = await requireOrg()
  const stats = await getDashboardStats(org.id)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Stats Cards */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(stats.total_revenue)}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    This month {formatCurrency(stats.revenue_this_month)}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Collected across all paid invoices
                </div>
                <div className="text-muted-foreground">
                  {stats.invoice_count} invoices total
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Outstanding</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(stats.outstanding)}
                </CardTitle>
                <CardAction>
                  <Badge variant={stats.overdue_count > 0 ? "destructive" : "outline"}>
                    {stats.overdue_count} overdue
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Pending & overdue invoices
                </div>
                <div className="text-muted-foreground">Needs follow-up</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Expenses (this month)</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(stats.expenses_this_month)}
                </CardTitle>
                <CardAction>
                  <IconWallet className="size-4 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Net profit this month
                </div>
                <div
                  className={`text-muted-foreground ${stats.net_profit_this_month >= 0 ? "" : "text-destructive"}`}
                >
                  {formatCurrency(stats.net_profit_this_month)}
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Clients</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {stats.client_count}
                </CardTitle>
                <CardAction>
                  <IconUsers className="size-4 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  {stats.product_count} products in catalog
                </div>
                <div className="text-muted-foreground">
                  {stats.low_stock_count > 0
                    ? `${stats.low_stock_count} low stock alerts`
                    : "Inventory healthy"}
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <RevenueExpenseChart data={stats.monthly_series} />
          </div>

          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
            {/* Recent Invoices */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardAction>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/invoices">
                      View all <IconArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="p-0">
                {stats.recent_invoices.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <IconFileInvoice className="size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No invoices yet. Create your first invoice.
                    </p>
                    <Button asChild size="sm">
                      <Link href="/create-invoice">New Invoice</Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recent_invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-sm font-medium">
                            {inv.invoice_number}
                          </TableCell>
                          <TableCell>{inv.client_name || "—"}</TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(Number(inv.total), inv.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statusStyles[inv.status]}
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(inv.due_date)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items at or below threshold</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {stats.low_stock_products.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No low stock alerts. Inventory is healthy.
                  </p>
                ) : (
                  stats.low_stock_products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.sku || "No SKU"} · threshold {p.low_stock_threshold}
                        </p>
                      </div>
                      <Badge variant="destructive" className="ml-2 shrink-0">
                        <IconAlertTriangle className="size-3" />
                        {p.stock_quantity} left
                      </Badge>
                    </div>
                  ))
                )}
                <Button asChild variant="outline" size="sm" className="mt-1">
                  <Link href="/products">Manage Inventory</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
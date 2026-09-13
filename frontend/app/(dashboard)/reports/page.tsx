import {
  Card,
  CardContent,
  CardDescription,
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
import { getReportData } from "@/lib/erp/queries"
import { requireOrg } from "@/lib/erp/org"
import { AskBizPilot } from "@/components/erp/ask-bizpilot"
import { formatCurrency } from "@/lib/erp/format"

export default async function ReportsPage() {
  const { org } = await requireOrg()
  const report = await getReportData(org.id)
  const maxCategory = Math.max(1, ...report.expense_by_category.map((c) => c.amount))

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Reports</h2>
            <p className="text-sm text-muted-foreground">
              Business performance overview across revenue, expenses, and clients.
            </p>
          </div>

          {/* AI assistant */}
          <div className="px-4 lg:px-6">
            <AskBizPilot orgName={org.name} />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6 @xl/main:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(report.totals.revenue)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {report.totals.paid_count}/{report.totals.invoice_count} invoices paid
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(report.totals.expenses)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p
                  className={`text-2xl font-semibold tabular-nums ${report.totals.profit >= 0 ? "" : "text-destructive"}`}
                >
                  {formatCurrency(report.totals.profit)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(report.totals.outstanding)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <RevenueExpenseChart data={report.monthly_series} />
          </div>

          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
            {/* Expense breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>All-time spending breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {report.expense_by_category.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No expenses recorded yet.
                  </p>
                ) : (
                  report.expense_by_category.map((c) => (
                    <div key={c.category}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{c.category}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {formatCurrency(c.amount)}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(c.amount / maxCategory) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Top clients */}
            <Card>
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
                <CardDescription>By total invoiced amount</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Invoices</TableHead>
                      <TableHead className="text-right">Total Invoiced</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.top_clients.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="py-10 text-center text-sm text-muted-foreground"
                        >
                          No client data yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.top_clients.map((c) => (
                        <TableRow key={c.name}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {c.invoice_count}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(c.total)}
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
    </div>
  )
}
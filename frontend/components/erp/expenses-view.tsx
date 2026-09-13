"use client"

import * as React from "react"
import {
  IconDots,
  IconDownload,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import type { Expense } from "@/lib/erp/types"
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/lib/erp/types"
import { formatCurrency, formatDate } from "@/lib/erp/format"
import { createExpense, deleteExpense } from "@/app/(dashboard)/actions"
import { exportToCSV } from "@/lib/erp/export-csv"

export function ExpensesView({ expenses }: { expenses: Expense[] }) {
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [open, setOpen] = React.useState(false)
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [editExpense, setEditExpense] = React.useState<Expense | null>(null)

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.vendor ?? "").toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || e.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const thisMonth = new Date().toISOString().slice(0, 7)
  const thisMonthTotal = expenses
    .filter((e) => e.expense_date.startsWith(thisMonth))
    .reduce((s, e) => s + Number(e.amount), 0)

  async function handleDelete(id: string) {
    setPendingId(id)
    try {
      await deleteExpense(id)
    } finally {
      setPendingId(null)
    }
  }

  function handleExportCSV() {
    const headers = ["Title", "Category", "Vendor", "Amount", "Currency", "Date", "Payment Method", "Notes"]
    const rows = expenses.map((e) => [
      e.title,
      e.category,
      e.vendor || "",
      e.amount,
      e.currency,
      e.expense_date,
      e.payment_method,
      e.notes || "",
    ])
    exportToCSV(`expenses-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
    toast.success("Expenses exported to CSV.")
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(totalExpenses)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(thisMonthTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Entries</p>
            <p className="text-2xl font-semibold tabular-nums">{expenses.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar + table */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-9 w-62.5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <IconDownload className="size-4" />
              Export CSV
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <IconPlus className="size-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <form
                action={async (fd) => {
                  await createExpense(fd)
                  setOpen(false)
                }}
              >
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                  <DialogDescription>
                    Record a business expense to track profitability.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="exp-title">Title *</Label>
                    <Input id="exp-title" name="title" required placeholder="Office rent" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="exp-category">Category</Label>
                      <Select name="category" defaultValue="other">
                        <SelectTrigger id="exp-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="exp-vendor">Vendor</Label>
                      <Input id="exp-vendor" name="vendor" placeholder="Landlord Inc." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="exp-amount">Amount *</Label>
                      <Input
                        id="exp-amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="500.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="exp-date">Date</Label>
                      <Input
                        id="exp-date"
                        name="expense_date"
                        type="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="exp-method">Payment method</Label>
                      <Select name="payment_method" defaultValue="cash">
                        <SelectTrigger id="exp-method">
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
                      <Label htmlFor="exp-currency">Currency</Label>
                      <Input id="exp-currency" name="currency" defaultValue="USD" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="exp-notes">Notes</Label>
                    <Textarea id="exp-notes" name="notes" placeholder="Optional notes" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Expense</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

        <Card className="mt-4">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No expenses found. Record your first expense.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {expense.vendor || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(expense.expense_date)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm capitalize">
                        {(expense.payment_method ?? "").replace("_", " ")}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(Number(expense.amount), expense.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              disabled={pendingId === expense.id}
                            >
                              <IconDots className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditExpense(expense)}>
                              Edit Expense
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(expense.id)}
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
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense record.
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

      <Dialog open={!!editExpense} onOpenChange={(open) => !open && setEditExpense(null)}>
        <DialogContent className="sm:max-w-lg">
          <form
            action={async (fd) => {
              const { updateExpense } = await import("@/app/(dashboard)/actions")
              await updateExpense(fd)
              setEditExpense(null)
            }}
          >
            <input type="hidden" name="id" value={editExpense?.id || ""} />
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Update your business expense record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-exp-title">Title *</Label>
                <Input id="edit-exp-title" name="title" required defaultValue={editExpense?.title} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-exp-category">Category</Label>
                  <Select name="category" defaultValue={editExpense?.category || "other"}>
                    <SelectTrigger id="edit-exp-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-exp-vendor">Vendor</Label>
                  <Input id="edit-exp-vendor" name="vendor" defaultValue={editExpense?.vendor || ""} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-exp-amount">Amount *</Label>
                  <Input
                    id="edit-exp-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={editExpense?.amount?.toString()}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-exp-date">Date</Label>
                  <Input
                    id="edit-exp-date"
                    name="expense_date"
                    type="date"
                    defaultValue={editExpense?.expense_date?.slice(0, 10)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-exp-method">Payment method</Label>
                  <Select name="payment_method" defaultValue={editExpense?.payment_method || "cash"}>
                    <SelectTrigger id="edit-exp-method">
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
                  <Label htmlFor="edit-exp-currency">Currency</Label>
                  <Input id="edit-exp-currency" name="currency" defaultValue={editExpense?.currency || "USD"} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-exp-notes">Notes</Label>
                <Textarea id="edit-exp-notes" name="notes" defaultValue={editExpense?.notes || ""} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditExpense(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
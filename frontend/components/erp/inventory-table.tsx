"use client"

import * as React from "react"
import {
  IconDots,
  IconDownload,
  IconMinus,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/erp/types"
import { formatCurrency } from "@/lib/erp/format"
import {
  deleteProduct,
  toggleProductActive,
  updateProductStock,
} from "@/app/(dashboard)/actions"
import { exportToCSV } from "@/lib/erp/export-csv"

export function InventoryTable({ products }: { products: Product[] }) {
  const [search, setSearch] = React.useState("")
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [editProduct, setEditProduct] = React.useState<Product | null>(null)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const tracked = products.filter((p) => p.track_stock)
  const lowStock = tracked.filter((p) => p.stock_quantity <= p.low_stock_threshold)
  const inventoryValue = tracked.reduce(
    (s, p) => s + p.stock_quantity * Number(p.unit_price),
    0
  )

  async function adjustStock(id: string, delta: number, current: number) {
    setPendingId(id)
    try {
      await updateProductStock(id, current + delta)
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(id: string) {
    setPendingId(id)
    try {
      await deleteProduct(id)
    } finally {
      setPendingId(null)
    }
  }

  function handleExportCSV() {
    const headers = ["Product Name", "SKU", "Category", "Unit Price", "Currency", "Stock Quantity", "Low Stock Threshold", "Track Stock", "Status"]
    const rows = products.map((p) => [
      p.name,
      p.sku || "",
      p.category || "",
      p.unit_price,
      p.currency,
      p.stock_quantity,
      p.low_stock_threshold,
      p.track_stock ? "Yes" : "No",
      p.is_active ? "Active" : "Archived",
    ])
    exportToCSV(`inventory-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
    toast.success("Inventory exported to CSV.")
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Catalog Items</p>
            <p className="text-2xl font-semibold tabular-nums">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Inventory Value</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(inventoryValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p
              className={`text-2xl font-semibold tabular-nums ${lowStock.length > 0 ? "text-destructive" : ""}`}
            >
              {lowStock.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + table */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="tracked">Tracked</TabsTrigger>
              <TabsTrigger value="low">Low Stock</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 w-62.5"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <IconDownload className="size-4" />
                Export CSV
              </Button>
              <Button asChild size="sm">
                <a href="/create-product">
                  <IconPlus className="size-4" />
                  Add Product
                </a>
              </Button>
            </div>
          </div>

          {(["all", "tracked", "low"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tab === "all"
                        ? filtered
                        : tab === "tracked"
                          ? filtered.filter((p) => p.track_stock)
                          : filtered.filter(
                              (p) =>
                                p.track_stock &&
                                p.stock_quantity <= p.low_stock_threshold
                            )
                      ).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            No products found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        (tab === "all"
                          ? filtered
                          : tab === "tracked"
                            ? filtered.filter((p) => p.track_stock)
                            : filtered.filter(
                                (p) =>
                                  p.track_stock &&
                                  p.stock_quantity <= p.low_stock_threshold
                              )
                        ).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="min-w-0">
                                <span className="block truncate font-medium">
                                  {product.name}
                                </span>
                                {product.description && (
                                  <span className="block max-w-64 truncate text-xs text-muted-foreground">
                                    {product.description}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {product.sku || "—"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {product.category || "—"}
                            </TableCell>
                            <TableCell className="text-right font-medium tabular-nums">
                              {formatCurrency(Number(product.unit_price), product.currency)}
                            </TableCell>
                            <TableCell>
                              {product.track_stock ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-7"
                                    disabled={pendingId === product.id || product.stock_quantity <= 0}
                                    onClick={() =>
                                      adjustStock(product.id, -1, product.stock_quantity)
                                    }
                                  >
                                    <IconMinus className="size-3" />
                                  </Button>
                                  <Badge
                                    variant={
                                      product.stock_quantity <= product.low_stock_threshold
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className="min-w-12 justify-center"
                                  >
                                    {product.stock_quantity}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-7"
                                    disabled={pendingId === product.id}
                                    onClick={() =>
                                      adjustStock(product.id, 1, product.stock_quantity)
                                    }
                                  >
                                    <IconPlus className="size-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="block text-center text-sm text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={product.is_active ? "default" : "secondary"}
                              >
                                {product.is_active ? "active" : "inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    disabled={pendingId === product.id}
                                  >
                                    <IconDots className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditProduct(product)}>
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleProductActive(product.id, !product.is_active)
                                    }
                                  >
                                    {product.is_active ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(product.id)}
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
          ))}
        </Tabs>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your inventory.
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

      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-lg">
          <form
            action={async (fd) => {
              const { updateProductAction } = await import("@/app/(dashboard)/actions")
              await updateProductAction(fd)
              setEditProduct(null)
            }}
          >
            <input type="hidden" name="id" value={editProduct?.id || ""} />
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product details and inventory settings.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-prod-name">Name *</Label>
                  <Input id="edit-prod-name" name="name" required defaultValue={editProduct?.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-prod-sku">SKU</Label>
                  <Input id="edit-prod-sku" name="sku" defaultValue={editProduct?.sku || ""} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-prod-desc">Description</Label>
                <Input id="edit-prod-desc" name="description" defaultValue={editProduct?.description || ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-prod-price">Unit Price *</Label>
                  <Input
                    id="edit-prod-price"
                    name="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={editProduct?.unit_price?.toString()}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-prod-currency">Currency</Label>
                  <Input id="edit-prod-currency" name="currency" defaultValue={editProduct?.currency || "USD"} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-prod-category">Category</Label>
                  <Input id="edit-prod-category" name="category" defaultValue={editProduct?.category || ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-prod-unit">Unit</Label>
                  <Input id="edit-prod-unit" name="unit" defaultValue={editProduct?.unit || "item"} />
                </div>
              </div>
              <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-prod-track"
                    name="track_stock"
                    className="size-4"
                    defaultChecked={editProduct?.track_stock}
                  />
                  <Label htmlFor="edit-prod-track">Track Inventory</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-prod-stock">Current Stock</Label>
                    <Input
                      id="edit-prod-stock"
                      name="stock_quantity"
                      type="number"
                      min="0"
                      defaultValue={editProduct?.stock_quantity?.toString() || "0"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-prod-low">Low Stock Alert at</Label>
                    <Input
                      id="edit-prod-low"
                      name="low_stock_threshold"
                      type="number"
                      min="0"
                      defaultValue={editProduct?.low_stock_threshold?.toString() || "5"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditProduct(null)}>
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
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createProductAction } from "@/app/(dashboard)/actions"

export default function CreateProductPage() {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await createProductAction(formData)
      if (res.ok) {
        toast.success("Product created successfully.")
        router.push("/products")
      } else {
        toast.error(res.error || "Failed to create product.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Add Product</h2>
                <p className="text-sm text-muted-foreground">
                  Add an item to your catalog and optionally track its stock.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/products">Back to Inventory</Link>
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Products can be reused across invoices for faster billing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product name *</Label>
                    <Input id="name" name="name" required placeholder="Consulting Service" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" name="sku" placeholder="SKU-001" />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Short description of the product or service"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit_price">Unit price *</Label>
                    <Input
                      id="unit_price"
                      name="unit_price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="99.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" defaultValue="USD" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="Services" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" name="unit" defaultValue="item" placeholder="item / hour / kg" />
                  </div>

                  <div className="md:col-span-2 mt-2 rounded-lg border p-4">
                    <p className="mb-3 text-sm font-medium">Inventory Tracking</p>
                    <div className="mb-4 flex items-center gap-2">
                      <Checkbox id="track_stock" name="track_stock" />
                      <Label htmlFor="track_stock" className="font-normal">
                        Track stock levels for this product
                      </Label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="stock_quantity">Current stock quantity</Label>
                        <Input
                          id="stock_quantity"
                          name="stock_quantity"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={0}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="low_stock_threshold">Low stock threshold</Label>
                        <Input
                          id="low_stock_threshold"
                          name="low_stock_threshold"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={5}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button asChild variant="ghost" disabled={busy}>
                    <Link href="/products">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={busy}>
                    {busy ? "Saving..." : "Save Product"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
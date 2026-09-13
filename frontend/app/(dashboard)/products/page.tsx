import { InventoryTable } from "@/components/erp/inventory-table"
import { getProducts } from "@/lib/erp/queries"
import { requireOrg } from "@/lib/erp/org"

export default async function ProductsPage() {
  const { org } = await requireOrg()
  const products = await getProducts(org.id)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Inventory</h2>
            <p className="text-sm text-muted-foreground">
              Manage your product catalog and track stock levels.
            </p>
          </div>
          <InventoryTable products={products} />
        </div>
      </div>
    </div>
  )
}
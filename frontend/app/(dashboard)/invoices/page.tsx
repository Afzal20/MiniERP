import { InvoicesTable } from "@/components/erp/invoices-table"
import { getInvoices } from "@/lib/erp/queries"
import { requireOrg } from "@/lib/erp/org"

export default async function InvoicesPage() {
  const { org, member } = await requireOrg()
  const invoices = await getInvoices(org.id)
  
  const { roleAtLeast } = await import("@/lib/erp/org")
  const canCreate = roleAtLeast(member.role, "editor")

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Invoices</h2>
            <p className="text-sm text-muted-foreground">
              Track billing, payments, and outstanding balances.
            </p>
          </div>
          <InvoicesTable invoices={invoices} canCreate={canCreate} />
        </div>
      </div>
    </div>
  )
}
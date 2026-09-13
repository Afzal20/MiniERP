import { ClientsTable } from "@/components/erp/clients-table"
import { getClientsWithStats } from "@/lib/erp/queries"
import { requireOrg } from "@/lib/erp/org"

export default async function ClientsPage() {
  const { org } = await requireOrg()
  const clients = await getClientsWithStats(org.id)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Clients</h2>
            <p className="text-sm text-muted-foreground">
              Manage your customer relationships and track their value.
            </p>
          </div>
          <ClientsTable clients={clients} />
        </div>
      </div>
    </div>
  )
}
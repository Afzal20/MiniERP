import { requireOrg } from "@/lib/erp/org";
import { getClientsWithStats, getProducts, getProfile } from "@/lib/erp/queries";
import {
  CreateInvoiceForm,
} from "@/components/erp/create-invoice-form";
import type { Client, Product, Profile } from "@/lib/erp/types";

export default async function CreateInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { org } = await requireOrg();
  const params = await searchParams;

  const [clients, products, profile] = await Promise.all([
    getClientsWithStats(org.id),
    getProducts(org.id),
    getProfile(),
  ]);

  const year = new Date().getFullYear();
  const suggestedNumber = `INV-${year}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Create Invoice</h2>
            <p className="text-sm text-muted-foreground">
              Bill a client, pull items from your catalog, and track payment.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <CreateInvoiceForm
              clients={(clients as Client[]) ?? []}
              products={(products as Product[]) ?? []}
              profile={(profile as Profile) ?? null}
              suggestedNumber={suggestedNumber}
              defaultClientId={params.client}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

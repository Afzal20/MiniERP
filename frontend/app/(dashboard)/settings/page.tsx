import { SettingsForm } from "@/components/erp/settings-form"
import { getProfile } from "@/lib/erp/queries"

export default async function SettingsPage() {
  const profile = await getProfile()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-lg font-semibold mb-1">Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your business profile and invoice defaults
            </p>
            <SettingsForm profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}
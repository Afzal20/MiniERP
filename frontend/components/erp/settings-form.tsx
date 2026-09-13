"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/lib/erp/types"
import { updateProfile } from "@/app/(dashboard)/actions"

export function SettingsForm({ profile }: { profile: Profile | null }) {
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  async function handleSubmit(fd: FormData) {
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile(fd)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              This information will appear on your invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Your Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name ?? ""}
                placeholder="Jane Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_name">Business Name</Label>
              <Input
                id="company_name"
                name="company_name"
                defaultValue={profile?.company_name ?? ""}
                placeholder="Acme Inc."
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="company_email">Email</Label>
                <Input
                  id="company_email"
                  name="company_email"
                  type="email"
                  defaultValue={profile?.company_email ?? ""}
                  placeholder="billing@acme.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company_phone">Phone</Label>
                <Input
                  id="company_phone"
                  name="company_phone"
                  defaultValue={profile?.company_phone ?? ""}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_address">Address</Label>
              <Textarea
                id="company_address"
                name="company_address"
                defaultValue={profile?.company_address ?? ""}
                placeholder="123 Business St, City, State ZIP"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Defaults</CardTitle>
            <CardDescription>
              Pre-filled values used when creating new invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="default_currency">Default Currency</Label>
                <Input
                  id="default_currency"
                  name="default_currency"
                  defaultValue={profile?.default_currency ?? "USD"}
                  placeholder="USD"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
                <Input
                  id="default_tax_rate"
                  name="default_tax_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={profile?.default_tax_rate ?? 0}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="default_notes">Default Notes</Label>
              <Textarea
                id="default_notes"
                name="default_notes"
                defaultValue={profile?.default_notes ?? ""}
                placeholder="Thank you for your business!"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="default_terms">Default Terms</Label>
              <Textarea
                id="default_terms"
                name="default_terms"
                defaultValue={profile?.default_terms ?? ""}
                placeholder="Payment terms and conditions..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-muted-foreground">Saved successfully.</span>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  )
}
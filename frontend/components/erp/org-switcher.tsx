"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconBuildingStore,
  IconCheck,
  IconChevronDown,
  IconPlus,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { TeamRole } from "@/lib/erp/types";
import { createOrganization, switchOrganization } from "@/app/(dashboard)/actions";

export interface SidebarOrg {
  id: string;
  name: string;
  role: TeamRole;
}

export function OrgSwitcher({
  organizations,
  activeOrgId,
}: {
  organizations: SidebarOrg[];
  activeOrgId?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const active = organizations.find((o) => o.id === activeOrgId) ?? organizations[0];

  async function handleSwitch(orgId: string) {
    if (orgId === active?.id) return;
    setPending(true);
    try {
      const res = await switchOrganization(orgId);
      if (!res.ok) toast.error(res.error);
      else router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={pending}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IconBuildingStore className="size-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">
                  {active?.name ?? "My Business"}
                </span>
                <span className="truncate text-xs text-muted-foreground capitalize">
                  {active ? `${active.role} · switch` : "no organization"}
                </span>
              </div>
              <IconChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSwitch(org.id)}
                className="gap-2"
              >
                <div className="flex aspect-square size-6 items-center justify-center rounded bg-primary/10 text-primary">
                  <IconBuildingStore className="size-3" />
                </div>
                <span className="min-w-0 flex-1 truncate">{org.name}</span>
                <span className="shrink-0 text-xs capitalize text-muted-foreground">
                  {org.role}
                </span>
                {org.id === active?.id && (
                  <IconCheck className="size-3.5 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => setCreateOpen(true)}
                >
                  <IconPlus className="size-4" />
                  New organization
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <NewOrgForm onDone={() => setCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NewOrgForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const name = new FormData(e.currentTarget).get("name");
      const res = await createOrganization(String(name ?? ""));
      if (!res.ok) {
        toast.error(res.error ?? "Failed to create organization.");
        return;
      }
      toast.success("Organization created.");
      onDone();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Create Organization</DialogTitle>
        <DialogDescription>
          Each organization has its own invoices, clients, inventory, expenses,
          and team.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="new_org_name">Business name</Label>
          <Input
            id="new_org_name"
            name="name"
            placeholder="Acme Corp"
            required
            maxLength={80}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create & Switch"}
        </Button>
      </DialogFooter>
    </form>
  );
}

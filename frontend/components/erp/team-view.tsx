"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconBuildingStore,
  IconCrown,
  IconDots,
  IconMail,
  IconPlus,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Organization, Profile, TeamMember, TeamRole } from "@/lib/erp/types";
import { formatDate, getInitials } from "@/lib/erp/format";
import {
  inviteTeamMember,
  removeTeamMember,
  updateOrganization,
  updateTeamMemberRole,
} from "@/app/(dashboard)/actions";

const roleColors: Record<string, string> = {
  owner: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  editor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  viewer: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const ROLE_WEIGHT: Record<TeamRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

function rank(role: TeamRole) {
  return ROLE_WEIGHT[role] ?? 0;
}

export function TeamView({
  organization,
  members,
  profile,
  myRole,
}: {
  organization: Organization | null;
  members: TeamMember[];
  profile: Profile | null;
  myRole: TeamRole;
}) {
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const canManage = rank(myRole) >= rank("admin");
  const pendingCount = members.filter((m) => m.status === "pending").length;

  async function run(
    memberId: string,
    fn: () => Promise<{ ok: boolean; error?: string }>,
    msg: string,
  ) {
    setBusyId(memberId);
    try {
      const res = await fn();
      if (!res.ok) toast.error(res.error ?? "Something went wrong.");
      else toast.success(msg);
    } finally {
      setBusyId(null);
    }
  }

  // Roles a member may be assigned to, given MY role
  const assignableRoles: TeamRole[] =
    myRole === "owner" ? ["owner", "admin", "editor", "viewer"] : ["admin", "editor", "viewer"];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Organization</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {organization?.name || profile?.company_name || "My Business"}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 capitalize">
              <IconBuildingStore className="size-4" />
              Your role: {myRole}
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Members</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {members.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconUsers className="size-4" />
              {pendingCount > 0
                ? `${pendingCount} pending invitation${pendingCount === 1 ? "" : "s"}`
                : "Everyone has accepted"}
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Your Access</CardDescription>
            <CardTitle className="text-2xl font-semibold capitalize">
              {myRole}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
            <span>
              {canManage
                ? "You can invite members and manage roles."
                : rank(myRole) >= rank("editor")
                  ? "You can create and edit business data."
                  : "Read-only access."}
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* Owner card */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Owner</h2>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-sm text-primary">
                  {getInitials(profile?.full_name || "Me")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium">{profile?.full_name || "You"}</p>
                <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                  <IconMail className="size-3 shrink-0" />
                  {profile?.company_email || "Add email in Settings"}
                </p>
              </div>
            </div>
            <Badge className={roleColors.owner} variant="secondary">
              <IconCrown className="size-3" />
              Owner
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Members */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team Members</h2>
          {canManage && (
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <IconPlus className="size-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <InviteForm
                  onDone={() => {
                    setInviteOpen(false);
                    toast.success("Invitation saved — they'll join automatically when they sign up with this email.");
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {members.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <IconUsers className="size-8 text-muted-foreground" />
              <p className="font-medium">No team members yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Invite colleagues to help manage invoices, clients, inventory,
                and expenses.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{member.name}</p>
                        <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                          <IconMail className="size-3 shrink-0" />
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {canManage && member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            disabled={busyId === member.id}
                          >
                            <IconDots className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change role</DropdownMenuLabel>
                          {assignableRoles.map((r) => (
                            <DropdownMenuItem
                              key={r}
                              disabled={r === member.role}
                              onClick={() =>
                                run(
                                  member.id,
                                  () => updateTeamMemberRole(member.id, r),
                                  `Role updated.`,
                                )
                              }
                              className="capitalize"
                            >
                              {r}
                              {r === member.role ? " ✓" : ""}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              run(
                                member.id,
                                () => removeTeamMember(member.id),
                                "Member removed.",
                              )
                            }
                          >
                            <IconTrash className="size-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge className={roleColors[member.role]} variant="secondary">
                      {member.role === "owner" && <IconCrown className="size-3" />}
                      {member.role}
                    </Badge>
                    {member.department && (
                      <Badge variant="outline">{member.department}</Badge>
                    )}
                    <Badge
                      variant={member.status === "active" ? "default" : "secondary"}
                      className={
                        member.status === "active"
                          ? ""
                          : "border-dashed text-muted-foreground"
                      }
                    >
                      {member.status === "active" ? "Active" : "Invited"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Invited {formatDate(member.invited_at ?? member.created_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Organization settings (admins only) */}
      {organization && canManage && (
        <>
          <Separator className="my-4" />
          <OrgSettingsCard organization={organization} />
        </>
      )}
    </div>
  );
}

function OrgSettingsCard({ organization }: { organization: Organization }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await updateOrganization(fd);
      if (!res.ok) {
        toast.error(res.error ?? "Failed to save.");
        return;
      }
      toast.success("Organization updated.");
      setSaved(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            These details appear on every invoice this organization sends.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="org_name">Business Name</Label>
            <Input id="org_name" name="name" defaultValue={organization.name} required maxLength={80} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org_email">Email</Label>
            <Input id="org_email" name="company_email" type="email" defaultValue={organization.company_email ?? ""} placeholder="billing@company.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="org_phone">Phone</Label>
            <Input id="org_phone" name="company_phone" defaultValue={organization.company_phone ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="org_currency">Currency</Label>
              <Input id="org_currency" name="default_currency" defaultValue={organization.default_currency ?? "USD"} maxLength={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org_tax">Default Tax %</Label>
              <Input id="org_tax" name="default_tax_rate" type="number" step="0.01" min="0" defaultValue={organization.default_tax_rate ?? 0} />
            </div>
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="org_address">Address</Label>
            <Textarea id="org_address" name="company_address" rows={2} defaultValue={organization.company_address ?? ""} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="org_notes">Default Invoice Notes</Label>
            <Textarea id="org_notes" name="default_notes" rows={2} defaultValue={organization.default_notes ?? ""} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="org_terms">Default Terms</Label>
            <Textarea id="org_terms" name="default_terms" rows={2} defaultValue={organization.default_terms ?? ""} />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          {saved && (
            <span className="text-sm text-muted-foreground">Saved.</span>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Organization"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function InviteForm({ onDone }: { onDone: () => void }) {
  const [saving, setSaving] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const result = await inviteTeamMember(fd);
      if (!result.ok) {
        toast.error(result.error ?? "Failed to send invite.");
        return;
      }
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogDescription>
          They&apos;ll be added as soon as they sign up or log in with this email.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="member_name">Name</Label>
          <Input id="member_name" name="name" placeholder="Sarah Johnson" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="member_email">Email</Label>
          <Input
            id="member_email"
            name="email"
            type="email"
            placeholder="sarah@company.com"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="member_role">Role</Label>
            <Select name="role" defaultValue="viewer">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin — manage everything & team</SelectItem>
                <SelectItem value="editor">Editor — create & edit data</SelectItem>
                <SelectItem value="viewer">Viewer — read-only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="member_department">Department</Label>
            <Input id="member_department" name="department" placeholder="Sales" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Sending..." : "Send Invite"}
        </Button>
      </DialogFooter>
    </form>
  );
}

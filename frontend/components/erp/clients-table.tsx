"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconDots,
  IconDownload,
  IconMail,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ClientWithStats } from "@/lib/erp/types"
import { formatCurrency, getInitials } from "@/lib/erp/format"
import { deleteClient } from "@/app/(dashboard)/actions"
import { exportToCSV } from "@/lib/erp/export-csv"

export function ClientsTable({ clients }: { clients: ClientWithStats[] }) {
  const [search, setSearch] = React.useState("")
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [editClient, setEditClient] = React.useState<ClientWithStats | null>(null)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = clients.reduce((s, c) => s + (Number(c.total_invoiced) || 0), 0)
  const totalOutstanding = clients.reduce((s, c) => s + (Number(c.outstanding) || 0), 0)
  const activeClients = clients.filter((c) => c.status === "active").length

  async function handleDelete(id: string) {
    setPendingId(id)
    try {
      await deleteClient(id)
    } finally {
      setPendingId(null)
    }
  }

  function handleExportCSV() {
    const headers = ["Name", "Email", "Company", "Phone", "Invoices Count", "Total Invoiced", "Outstanding", "Status"]
    const rows = clients.map((c) => [
      c.name,
      c.email,
      c.company || "",
      c.phone || "",
      c.invoice_count,
      c.total_invoiced,
      c.outstanding,
      c.status,
    ])
    exportToCSV(`clients-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
    toast.success("Clients exported to CSV.")
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Clients</p>
            <p className="text-2xl font-semibold tabular-nums">
              {clients.length}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({activeClients} active)
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Lifetime Value</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(totalOutstanding)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + table */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <TabsList>
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
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
                <Link href="/create-client">
                  <IconPlus className="size-4" />
                  Add Client
                </Link>
              </Button>
            </div>
          </div>

          {(["all", "active", "inactive"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Invoices</TableHead>
                        <TableHead className="text-right">Invoiced</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tab === "all"
                        ? filtered
                        : filtered.filter((c) => c.status === tab)
                      ).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            No clients found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        (tab === "all"
                          ? filtered
                          : filtered.filter((c) => c.status === tab)
                        ).map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="size-8">
                                  <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                    {getInitials(client.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <Link
                                    href={`/clients/${client.id}`}
                                    className="block truncate font-medium hover:underline"
                                  >
                                    {client.name}
                                  </Link>
                                  {client.company && (
                                    <span className="block truncate text-xs text-muted-foreground">
                                      {client.company}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-0.5 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <IconMail className="size-3" />
                                  {client.email}
                                </span>
                                {client.phone && (
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <IconPhone className="size-3" />
                                    {client.phone}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {client.invoice_count}
                            </TableCell>
                            <TableCell className="text-right font-medium tabular-nums">
                              {formatCurrency(client.total_invoiced)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {formatCurrency(client.outstanding)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  client.status === "active" ? "default" : "secondary"
                                }
                              >
                                {client.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    disabled={pendingId === client.id}
                                  >
                                    <IconDots className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/clients/${client.id}`}>
                                      View Client Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditClient(client)}>
                                    Edit Client
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/create-invoice?client=${client.id}`}>
                                      Create Invoice
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(client.id)}
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
              This action cannot be undone. This will permanently delete the client and all associated data.
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

      <Dialog open={!!editClient} onOpenChange={(open) => !open && setEditClient(null)}>
        <DialogContent className="sm:max-w-lg">
          <form
            action={async (fd) => {
              const { updateClient } = await import("@/app/(dashboard)/actions")
              await updateClient(fd)
              setEditClient(null)
            }}
          >
            <input type="hidden" name="client_id" value={editClient?.id || ""} />
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update the client&apos;s information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Client name *</Label>
                <Input id="edit-name" name="name" required defaultValue={editClient?.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input id="edit-company" name="company" defaultValue={editClient?.company ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input id="edit-email" name="email" type="email" required defaultValue={editClient?.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" name="phone" defaultValue={editClient?.phone ?? ""} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" name="address" defaultValue={editClient?.address ?? ""} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditClient(null)}>
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
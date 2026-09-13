"use client"

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Download } from "lucide-react"

interface Invoice {
    id: string
    number: string
    clientName: string
    amount: number
    status: "paid" | "pending" | "overdue"
    date: string
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
        paid: "bg-green-100 text-green-800 hover:bg-green-200",
        pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        overdue: "bg-red-100 text-red-800 hover:bg-red-200",
    }

    return (
        <Badge className={variants[status]} variant="secondary">
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    )
}

export const RecentInvoices: React.FC<{ invoices: Invoice[] }> = ({
    invoices,
}) => {
    return (
        <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Invoices</CardTitle>
                <CardDescription>Latest invoices from your clients</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="w-[50px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow
                                    key={invoice.id}
                                    className="hover:bg-gray-50/50 transition-colors duration-150"
                                >
                                    <TableCell className="font-medium">
                                        {invoice.number}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                                    {invoice.clientName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            {invoice.clientName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {formatCurrency(invoice.amount)}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                    <TableCell className="text-gray-600">
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Client {
    id: string
    name: string
    totalRevenue: number
    invoiceCount: number
    percentage: number
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

export const TopClients: React.FC<{ clients: Client[] }> = ({ clients }) => {
    return (
        <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Top Clients</CardTitle>
                <CardDescription>Clients by revenue generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {clients.map((client, index) => (
                    <div
                        key={client.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-150"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-500 w-4">
                                    #{index + 1}
                                </span>
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                        {client.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <p className="font-medium text-sm">{client.name}</p>
                                <p className="text-xs text-gray-600">
                                    {client.invoiceCount} invoices
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm">
                                {formatCurrency(client.totalRevenue)}
                            </p>
                            <p className="text-xs text-gray-600">
                                {client.percentage}% of total
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

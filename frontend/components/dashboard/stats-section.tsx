"use client"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    FileText,
    Clock,
    CheckCircle,
} from "lucide-react"

interface DashboardStats {
    totalRevenue: number
    revenueChange: number
    invoicesCreated: number
    invoicesChange: number
    pendingPayments: number
    pendingChange: number
    paidThisMonth: number
    paidChange: number
}

interface StatsCardProps {
    title: string
    value: string | number
    change: number
    icon: React.ReactNode
    isCurrency?: boolean
    primary?: boolean
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

const getTrendIcon = (change: number) => {
    return change >= 0 ? (
        <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
        <TrendingDown className="h-4 w-4 text-red-500" />
    )
}

const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    change,
    icon,
    isCurrency = false,
    primary = false,
}) => {
    const displayValue = isCurrency
        ? formatCurrency(value as number)
        : value.toString()

    if (primary) {
        return (
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">{title}</p>
                            <p className="text-3xl font-bold">{displayValue}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {getTrendIcon(change)}
                                <span className="text-sm font-medium">
                                    {change > 0 ? "+" : ""}
                                    {change}% from last month
                                </span>
                            </div>
                        </div>
                        {icon}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">{title}</p>
                        <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
                        <div className="flex items-center gap-1 mt-1">
                            {getTrendIcon(change)}
                            <span className={`text-sm font-medium ${getTrendColor(change)}`}>
                                {change > 0 ? "+" : ""}
                                {change}% this month
                            </span>
                        </div>
                    </div>
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}

export const StatsSection: React.FC<{ stats: DashboardStats }> = ({
    stats,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                title="Total Revenue"
                value={stats.totalRevenue}
                change={stats.revenueChange}
                icon={<DollarSign className="h-8 w-8 text-indigo-200" />}
                isCurrency
                primary
            />
            <StatsCard
                title="Invoices Created"
                value={stats.invoicesCreated}
                change={stats.invoicesChange}
                icon={<FileText className="h-8 w-8 text-indigo-500" />}
            />
            <StatsCard
                title="Pending Payments"
                value={stats.pendingPayments}
                change={stats.pendingChange}
                icon={<Clock className="h-8 w-8 text-yellow-500" />}
                isCurrency
            />
            <StatsCard
                title="Paid This Month"
                value={stats.paidThisMonth}
                change={stats.paidChange}
                icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                isCurrency
            />
        </div>
    )
}

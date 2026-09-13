"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText, Users } from "lucide-react"

export const QuickActions = () => {
    return (
        <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-lg">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 flex-1 sm:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Invoice
                    </Button>
                    <Button variant="secondary" className="flex-1 sm:flex-none">
                        <FileText className="h-4 w-4 mr-2" />
                        View All Invoices
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                        <Users className="h-4 w-4 mr-2" />
                        Add Client
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export default function ReportsLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-1 h-4 w-80" />
          </div>

          {/* AI assistant skeleton */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Summary stat cards */}
          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6 @xl/main:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-8 w-36" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart skeleton */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-72 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Expense breakdown + Top clients */}
          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-36" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="p-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="ml-auto h-4 w-8" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

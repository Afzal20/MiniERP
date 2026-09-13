import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export default function InvoicesLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="mt-1 h-4 w-72" />
          </div>

          <Card className="mx-4 lg:mx-6">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-9 w-32" />
            </CardHeader>
            <CardContent className="p-0">
              {/* Table header skeleton */}
              <div className="flex items-center gap-4 border-b px-4 py-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
              {/* Table rows skeleton */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                >
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-4 w-20" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

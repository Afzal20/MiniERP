"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import {
  IconFileInvoice,
  IconSearch,
  IconUser,
  IconBox,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { searchWorkspaceData } from "../actions"

type SearchResult = {
  id: string
  type: "invoice" | "client" | "product" | "team" | "setting"
  title: string
  subtitle: string
  meta?: string
  route: string
}

const typeIcons: Record<SearchResult["type"], React.ReactNode> = {
  invoice: <IconFileInvoice className="size-4" />,
  client: <IconUser className="size-4" />,
  product: <IconBox className="size-4" />,
  team: <IconUsers className="size-4" />,
  setting: <IconSettings className="size-4" />,
}

const typeColors: Record<SearchResult["type"], string> = {
  invoice: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  client: "bg-green-500/10 text-green-600 dark:text-green-400",
  product: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  team: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  setting: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [allResults, setAllResults] = useState<SearchResult[]>([])
  const [, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const loadResults = async () => {
      try {
        const { clientsData, productsData, invoicesData, teamData } = await searchWorkspaceData()

        if (!isMounted) return

        const teamResults: SearchResult[] = (teamData ?? []).map((member) => ({
          id: member.id,
          type: "team",
          title: member.name,
          subtitle: `${member.role || "Member"} · ${member.email}`,
          route: "/team",
        }))

        const clientResults: SearchResult[] = (clientsData ?? []).map((client) => ({
          id: client.id,
          type: "client",
          title: client.name,
          subtitle: `${client.email} · ${client.status}`,
          route: "/clients",
        }))

        const productResults: SearchResult[] = (productsData ?? []).map((product) => ({
          id: product.id,
          type: "product",
          title: product.name,
          subtitle: `${product.category || "General"} · ${product.description || "No description"}`,
          route: "/products",
        }))

        const invoiceResults: SearchResult[] = (invoicesData ?? []).map((invoice) => ({
          id: invoice.id,
          type: "invoice",
          title: invoice.invoice_number,
          subtitle: `${invoice.client_name || "Client"} · $${Number(invoice.total ?? 0).toFixed(2)}`,
          meta: invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : undefined,
          route: `/invoices/${invoice.id}`,
        }))

        const nextResults = [...clientResults, ...productResults, ...invoiceResults, ...teamResults]

        setAllResults(nextResults)
      } catch (e) {
        console.error("Failed to fetch search data", e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadResults()

    return () => {
      isMounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const nextQuery = query.trim().toLowerCase()

    if (!nextQuery) return allResults

    return allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(nextQuery) ||
        result.subtitle.toLowerCase().includes(nextQuery)
    )
  }, [allResults, query])

  const byType = (type: SearchResult["type"]) =>
    filtered.filter((r) => r.type === type)

  function ResultList({ results }: { results: SearchResult[] }) {
    if (results.length === 0) {
      return (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No results found.
        </p>
      )
    }
    return (
      <div className="divide-y">
        {results.map((result) => (
          <div
            key={result.id}
            className="flex items-center gap-3 px-1 py-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
            onClick={() => router.push(result.route)}
          >
            <div className={`rounded-md p-2 ${typeColors[result.type]}`}>
              {typeIcons[result.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{result.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {result.subtitle}
              </p>
            </div>
            {result.meta && (
              <Badge
                variant="secondary"
                className={statusColors[result.meta] ?? ""}
              >
                {result.meta}
              </Badge>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Search Header */}
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold mb-4">Search</h2>
            <div className="relative max-w-lg">
              <IconSearch className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices, clients, products, team..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            {query && (
              <p className="text-sm text-muted-foreground mt-2">
                {filtered.length} result{filtered.length !== 1 && "s"} for
                &quot;{query}&quot;
              </p>
            )}
          </div>

          {/* Results */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  {query
                    ? `Showing matches across all categories`
                    : `Type to search across your workspace`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">
                      All ({filtered.length})
                    </TabsTrigger>
                    <TabsTrigger value="invoices">
                      Invoices ({byType("invoice").length})
                    </TabsTrigger>
                    <TabsTrigger value="clients">
                      Clients ({byType("client").length})
                    </TabsTrigger>
                    <TabsTrigger value="products">
                      Products ({byType("product").length})
                    </TabsTrigger>
                    <TabsTrigger value="team">
                      Team ({byType("team").length})
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      Settings ({byType("setting").length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <ResultList results={filtered} />
                  </TabsContent>
                  <TabsContent value="invoices">
                    <ResultList results={byType("invoice")} />
                  </TabsContent>
                  <TabsContent value="clients">
                    <ResultList results={byType("client")} />
                  </TabsContent>
                  <TabsContent value="products">
                    <ResultList results={byType("product")} />
                  </TabsContent>
                  <TabsContent value="team">
                    <ResultList results={byType("team")} />
                  </TabsContent>
                  <TabsContent value="settings">
                    <ResultList results={byType("setting")} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { usePathname } from "next/navigation"

import Link from "next/link"
import { CheckCircle2, Sparkles } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titles: { match: string; title: string }[] = [
  { match: "/dashboard", title: "Dashboard" },
  { match: "/invoices", title: "Invoices" },
  { match: "/create-invoice", title: "Create Invoice" },
  { match: "/clients", title: "Clients" },
  { match: "/create-client", title: "New Client" },
  { match: "/products", title: "Products" },
  { match: "/create-product", title: "New Product" },
  { match: "/expenses", title: "Expenses" },
  { match: "/reports", title: "Reports" },
  { match: "/team", title: "My Team" },
  { match: "/settings", title: "Settings" },
  { match: "/search", title: "Search" },
  { match: "/help", title: "Help" },
]

interface SiteHeaderProps {
  isPro?: boolean
  planCode?: string
}

export function SiteHeader({ isPro = false, planCode }: SiteHeaderProps) {
  const pathname = usePathname()
  const title =
    titles.find((t) => pathname?.startsWith(t.match))?.title ?? "Dashboard"

  const isEnterprise = planCode === "enterprise"
  const isPaid = isPro || isEnterprise

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>

        <div className="ml-auto flex items-center gap-2.5">
          {isPaid ? (
            <Link
              href="/settings/billing"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isEnterprise ? "Enterprise Plan" : "Pro Plan"}</span>
            </Link>
          ) : (
            <Link
              href="/settings/billing"
              id="header-upgrade-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Upgrade to Pro</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}


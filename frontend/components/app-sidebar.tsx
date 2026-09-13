"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconHelp,
  IconListDetails,
  IconReceipt,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  OrgSwitcher,
  type SidebarOrg,
} from "@/components/erp/org-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: IconFileDescription,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: IconListDetails,
    },
    {
      title: "Products",
      url: "/products",
      icon: IconChartBar,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: IconReceipt,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    {
      title: "My Team",
      url: "/team",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Billing",
      url: "/settings/billing",
      icon: IconReceipt,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
}

function SidebarUpgradeCard({ isPro }: { isPro: boolean }) {
  if (isPro) return null

  return (
    <div className="mx-2 mb-2 p-3 rounded-xl bg-linear-to-b from-primary/10 to-primary/5 border border-primary/20 text-card-foreground shadow-xs group-data-[collapsible=icon]:hidden">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <span className="text-xs font-bold text-foreground">BizPilot Pro</span>
        <span className="ml-auto text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Free
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug mb-2.5">
        Unlock unlimited invoices, team seats, and premium features.
      </p>
      <Link
        href="/settings/billing"
        id="sidebar-upgrade-btn"
        className="w-full inline-flex items-center justify-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
      >
        Upgrade Now
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

export function AppSidebar({
  organizations = [],
  activeOrgId,
  isPro = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  organizations?: SidebarOrg[];
  activeOrgId?: string;
  isPro?: boolean;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher organizations={organizations} activeOrgId={activeOrgId} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUpgradeCard isPro={isPro} />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}



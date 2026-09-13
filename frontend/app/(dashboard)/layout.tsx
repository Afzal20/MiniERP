import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authApi, billingApi } from "@/lib/api/client";
import {
  claimPendingInvites,
  getMemberships,
} from "@/lib/erp/org";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={null}>
      <DashboardGuard>{children}</DashboardGuard>
    </Suspense>
  );
}

async function DashboardGuard({ children }: DashboardLayoutProps) {
  let user = null;
  try {
    user = await authApi.getMe();
  } catch {
    // Unauthenticated
  }

  if (!user) {
    redirect("/auth/login?expired=true");
  }

  // Accept any team invites pending for this email
  await claimPendingInvites(user.email ?? "", user.id);

  const [memberships, cookieStore] = await Promise.all([
    getMemberships(),
    cookies(),
  ]);
  const activeOrgId = cookieStore.get("bp_active_org")?.value;
  const activeOrg =
    memberships.find((m) => m.org.id === activeOrgId) ?? memberships[0];

  let isPro = false;
  let isEnterprise = false;
  let activePlanCode = "free";
  if (activeOrg?.org?.id) {
    try {
      const sub = await billingApi.getSubscription(activeOrg.org.id);
      const planCode =
        typeof sub?.plan === "object"
          ? (sub.plan as { code?: string })?.code
          : sub?.plan;
      activePlanCode = planCode || "free";
      isEnterprise = planCode === "enterprise" && sub?.status === "active";
      isPro = (planCode === "pro" || isEnterprise) && sub?.status === "active";
    } catch {
      isPro = false;
      isEnterprise = false;
    }
  }

  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        organizations={memberships.map((m) => ({
          id: m.org.id,
          name: m.org.name,
          role: m.member.role,
        }))}
        activeOrgId={activeOrg?.org.id}
        isPro={isPro}
      />
      <SidebarInset>
        <SiteHeader isPro={isPro} planCode={activePlanCode} />
        <main className="flex-1">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}

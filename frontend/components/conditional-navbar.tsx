"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"

// These routes render inside `app/(dashboard)/layout.tsx`, which supplies the
// application sidebar and its own header. The marketing navbar belongs only on
// pages outside that layout.
const sidebarLayoutRoutes = [
  "/dashboard",
  "/clients",
  "/create-client",
  "/create-invoice",
  "/create-product",
  "/expenses",
  "/products",
  "/invoices",
  "/reports",
  "/team",
  "/settings",
  "/help",
  "/search",
]

export function ConditionalNavbar() {
  const pathname = usePathname()
  const isSidebarLayoutRoute = sidebarLayoutRoutes.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  )

  if (isSidebarLayoutRoute) {
    return null
  }

  return <Navbar />
}

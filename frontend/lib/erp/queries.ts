import "server-only";

import { authApi, erpApi, orgsApi } from "@/lib/api/client";
import { getActiveOrg } from "./org";
import type {
  Client,
  ClientWithStats,
  DashboardStats,
  Expense,
  Invoice,
  InvoiceWithItems,
  Organization,
  Product,
  Profile,
  TeamMember,
} from "./types";

export async function getUser() {
  try {
    return await authApi.getMe();
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    return await authApi.getProfile();
  } catch {
    return null;
  }
}

// ---------- Invoices (org-scoped) ----------

export async function getInvoices(orgId: string): Promise<Invoice[]> {
  try {
    return await erpApi.listInvoices(orgId);
  } catch {
    return [];
  }
}

export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
  try {
    const ctx = await getActiveOrg();
    if (!ctx) return null;
    return await erpApi.getInvoice(ctx.org.id, id);
  } catch {
    return null;
  }
}

// ---------- Clients with aggregated stats (org-scoped) ----------

export async function getClientsWithStats(orgId: string): Promise<ClientWithStats[]> {
  try {
    return await erpApi.listClients(orgId);
  } catch {
    return [];
  }
}

export async function getClient(clientId: string): Promise<Client | null> {
  try {
    const ctx = await getActiveOrg();
    if (!ctx) return null;
    return await erpApi.getClient(ctx.org.id, clientId);
  } catch {
    return null;
  }
}

// ---------- Products / Inventory (org-scoped) ----------

export async function getProducts(orgId: string): Promise<Product[]> {
  try {
    return await erpApi.listProducts(orgId);
  } catch {
    return [];
  }
}

// ---------- Expenses (org-scoped) ----------

export async function getExpenses(orgId: string): Promise<Expense[]> {
  try {
    return await erpApi.listExpenses(orgId);
  } catch {
    return [];
  }
}

// ---------- Dashboard (org-scoped) ----------

export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  try {
    return await erpApi.getDashboardStats(orgId);
  } catch {
    return {
      total_revenue: 0,
      outstanding: 0,
      overdue_count: 0,
      expenses_this_month: 0,
      revenue_this_month: 0,
      net_profit_this_month: 0,
      invoice_count: 0,
      client_count: 0,
      product_count: 0,
      low_stock_count: 0,
      monthly_series: [],
      recent_invoices: [],
      recent_expenses: [],
      low_stock_products: [],
    };
  }
}

// ---------- Team (org-scoped) ----------

export interface TeamData {
  organization: Organization | null;
  members: TeamMember[];
}

export async function getTeamData(orgId: string): Promise<TeamData> {
  try {
    const [organization, members] = await Promise.all([
      orgsApi.get(orgId).catch(() => null),
      orgsApi.listMembers(orgId).catch(() => []),
    ]);

    return { organization, members };
  } catch {
    return { organization: null, members: [] };
  }
}

// ---------- Reports (org-scoped) ----------

export interface ReportData {
  monthly_series: { month: string; revenue: number; expenses: number; profit: number }[];
  expense_by_category: { category: string; amount: number }[];
  top_clients: { name: string; total: number; invoice_count: number }[];
  totals: {
    revenue: number;
    expenses: number;
    profit: number;
    outstanding: number;
    invoice_count: number;
    paid_count: number;
  };
}

export async function getReportData(orgId: string): Promise<ReportData> {
  try {
    return await erpApi.getReportData(orgId);
  } catch {
    return {
      monthly_series: [],
      expense_by_category: [],
      top_clients: [],
      totals: {
        revenue: 0,
        expenses: 0,
        profit: 0,
        outstanding: 0,
        invoice_count: 0,
        paid_count: 0,
      },
    };
  }
}

export type {
  Client,
  ClientWithStats,
  DashboardStats,
  Expense,
  ExpenseCategory,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  InvoiceWithItems,
  Organization,
  Payment,
  PaymentMethod,
  Product,
  Profile,
  TeamMember,
  TeamRole,
} from "@/lib/erp/types";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone_number?: string;
  bio?: string;
  company_name?: string;
  role?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

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

export interface PriceMapping {
  id: string;
  stripe_price_id: string;
  interval: "month" | "year";
  amount: string;
  currency: string;
  is_active: boolean;
}

export interface PlanDetail {
  id: string;
  code: string;
  name: string;
  description: string;
  tier: number;
  trial_days: number;
  is_active: boolean;
  entitlements: { id: string; key: string; value: { value: unknown } }[];
  prices: PriceMapping[];
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan: string;
  status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  limits: Record<string, number>;
  usage: Record<string, number>;
}

export interface AILogItem {
  id: string;
  feature: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  latency_ms: number;
  created_at: string;
}

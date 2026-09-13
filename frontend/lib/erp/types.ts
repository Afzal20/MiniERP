export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

export type ExpenseCategory =
  | "rent"
  | "utilities"
  | "salaries"
  | "marketing"
  | "supplies"
  | "software"
  | "travel"
  | "taxes"
  | "other";

export type PaymentMethod =
  | "cash"
  | "card"
  | "bank_transfer"
  | "mobile_money"
  | "other";

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "salaries", label: "Salaries" },
  { value: "marketing", label: "Marketing" },
  { value: "supplies", label: "Supplies" },
  { value: "software", label: "Software" },
  { value: "travel", label: "Travel" },
  { value: "taxes", label: "Taxes" },
  { value: "other", label: "Other" },
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "other", label: "Other" },
];

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface ClientWithStats extends Client {
  invoice_count: number;
  total_invoiced: number;
  total_paid: number;
  outstanding: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  unit_price: number;
  currency: string;
  category: string;
  unit: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  track_stock: boolean;
  is_active: boolean;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  organization_id: string;
  client_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  notes: string;
  terms: string;
  business_name: string;
  business_email: string;
  business_address: string;
  business_phone: string;
  client_name: string;
  client_email: string;
  client_address: string;
  created_at: string;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  paid_amount: number;
  balance_due?: number;
  payments: Payment[];
}

export type TeamRole = "owner" | "admin" | "editor" | "viewer";

export const ROLE_LABELS: Record<TeamRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  logo_url: string;
  website: string;
  company_email: string;
  company_address: string;
  company_phone: string;
  default_currency: string;
  default_tax_rate: number;
  default_notes: string;
  default_terms: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  organization_id: string;
  user_id: string | null;
  email: string;
  name: string;
  role: TeamRole;
  department: string;
  status: "active" | "pending";
  invited_at: string | null;
  joined_at: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  vendor: string;
  amount: number;
  currency: string;
  expense_date: string;
  payment_method: PaymentMethod;
  notes: string;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_date: string;
  reference: string;
  notes: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  company_name: string;
  company_email: string;
  company_address: string;
  company_phone: string;
  default_currency: string;
  default_tax_rate: number;
  default_notes: string;
  default_terms: string;
}

export interface DashboardStats {
  total_revenue: number;
  outstanding: number;
  overdue_count: number;
  expenses_this_month: number;
  revenue_this_month: number;
  net_profit_this_month: number;
  invoice_count: number;
  client_count: number;
  product_count: number;
  low_stock_count: number;
  monthly_series: { month: string; revenue: number; expenses: number }[];
  recent_invoices: Invoice[];
  recent_expenses: Expense[];
  low_stock_products: Product[];
}
import { currencies } from "./currencies";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  businessPhone: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
}

export function getCurrencySymbol(currency: string): string {
  return currencies.find((c) => c.value === currency)?.symbol || "$";
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return (subtotal * taxRate) / 100;
}

export function calculateTotal(items: InvoiceItem[], taxRate: number): number {
  const subtotal = calculateSubtotal(items);
  return subtotal + calculateTax(subtotal, taxRate);
}

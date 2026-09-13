"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACTIVE_ORG_COOKIE,
  getMemberships,
  requireRole,
} from "@/lib/erp/org";
import {
  authApi,
  erpApi,
  orgsApi,
} from "@/lib/api/client";
import type { InvoiceStatus, PaymentMethod, TeamRole, TeamMember } from "@/lib/erp/types";

function str(fd: FormData, key: string, fallback = "") {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;
}

function num(fd: FormData, key: string, fallback = 0) {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : fallback;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

// ===================== ORGANIZATIONS =====================

export async function switchOrganization(orgId: string): Promise<ActionResult> {
  try {
    const ctxList = await getMemberships();
    if (!ctxList.some((m) => m.org.id === orgId))
      return { ok: false, error: "You are not a member of that organization." };

    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_ORG_COOKIE, orgId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to switch organization." };
  }
}

export async function createOrganization(
  name: string,
): Promise<ActionResult> {
  try {
    const clean = name.trim().slice(0, 80);
    if (!clean) return { ok: false, error: "Enter a business name." };

    const org = await orgsApi.create({ name: clean });

    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_ORG_COOKIE, org.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    revalidatePath("/", "layout");
    return { ok: true, id: org.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create organization." };
  }
}

export async function updateOrganization(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    const name = str(formData, "name");
    if (!name) return { ok: false, error: "Business name is required." };

    await orgsApi.update(ctx.org.id, {
      name,
      company_email: str(formData, "company_email"),
      company_address: str(formData, "company_address"),
      company_phone: str(formData, "company_phone"),
      default_currency: str(formData, "default_currency", "USD"),
      default_tax_rate: num(formData, "default_tax_rate"),
      default_notes: str(formData, "default_notes"),
      default_terms: str(formData, "default_terms"),
    });

    revalidatePath("/", "layout");
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update organization." };
  }
}

// ===================== EXPENSES =====================

export async function createExpense(formData: FormData) {
  const ctx = await requireRole("editor");
  const title = str(formData, "title");
  if (!title) return;

  await erpApi.createExpense(ctx.org.id, {
    title,
    category: str(formData, "category", "other") as any,
    vendor: str(formData, "vendor"),
    amount: num(formData, "amount"),
    currency: str(formData, "currency", "USD"),
    expense_date: str(formData, "expense_date", new Date().toISOString().slice(0, 10)),
    payment_method: (str(formData, "payment_method", "cash") || "cash") as PaymentMethod,
    notes: str(formData, "notes"),
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
  redirect("/expenses");
}

export async function updateExpense(formData: FormData) {
  const ctx = await requireRole("editor");
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!id || !title) return;

  await erpApi.updateExpense(ctx.org.id, id, {
    title,
    category: str(formData, "category", "other") as any,
    vendor: str(formData, "vendor"),
    amount: num(formData, "amount"),
    currency: str(formData, "currency", "USD"),
    expense_date: str(formData, "expense_date", new Date().toISOString().slice(0, 10)),
    payment_method: (str(formData, "payment_method", "cash") || "cash") as PaymentMethod,
    notes: str(formData, "notes"),
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function deleteExpense(id: string) {
  const ctx = await requireRole("editor");
  await erpApi.deleteExpense(ctx.org.id, id);
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

// ===================== INVOICES =====================

export async function markInvoicePaid(invoiceId: string) {
  const ctx = await requireRole("editor");
  const invoice = await erpApi.getInvoice(ctx.org.id, invoiceId);
  if (!invoice || invoice.status === "paid") return;

  const remaining = Math.max(0, Number(invoice.total) - Number(invoice.paid_amount || 0));
  if (remaining > 0) {
    await erpApi.recordPayment(ctx.org.id, invoiceId, {
      amount: remaining,
      payment_method: "cash",
      notes: "Marked as paid",
    });
  } else {
    await erpApi.updateInvoice(ctx.org.id, invoiceId, { status: "paid" });
  }

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function sendInvoiceAction(invoiceId: string): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    await erpApi.sendInvoice(ctx.org.id, invoiceId);
    revalidatePath("/invoices");
    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath("/dashboard");
    return { ok: true, id: invoiceId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send invoice.",
    };
  }
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  const ctx = await requireRole("editor");
  await erpApi.updateInvoice(ctx.org.id, invoiceId, { status });
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/dashboard");
}

export async function deleteInvoice(invoiceId: string) {
  const ctx = await requireRole("editor");
  await erpApi.deleteInvoice(ctx.org.id, invoiceId);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export interface CreateInvoiceItemInput {
  description: string;
  quantity: number;
  rate: number;
  product_id?: string | null;
}

export interface CreateInvoiceInput {
  client_id: string | null;
  client_name: string;
  client_email: string;
  client_address: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  currency: string;
  status: "draft" | "pending";
  tax_rate: number;
  discount_amount: number;
  notes: string;
  terms: string;
  items: CreateInvoiceItemInput[];
}

export async function createInvoiceAction(
  input: CreateInvoiceInput,
): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    const orgId = ctx.org.id;

    if (!input.due_date) return { ok: false, error: "Due date is required." };
    const items = (input.items ?? []).filter(
      (it) => it.description.trim() !== "" && Number(it.quantity) > 0,
    );
    if (items.length === 0)
      return { ok: false, error: "Add at least one line item." };

    const invoice = await erpApi.createInvoice(orgId, {
      client_id: input.client_id || null,
      invoice_number: input.invoice_number.trim() || undefined,
      status: input.status,
      issue_date: input.issue_date || new Date().toISOString().slice(0, 10),
      due_date: input.due_date,
      currency: input.currency || "USD",
      tax_rate: Number(input.tax_rate) || 0,
      discount_amount: Number(input.discount_amount) || 0,
      notes: input.notes ?? "",
      terms: input.terms ?? "",
      client_name: input.client_name ?? "",
      client_email: input.client_email ?? "",
      client_address: input.client_address ?? "",
      items: items.map((it) => ({
        description: it.description.trim(),
        quantity: Number(it.quantity),
        rate: Number(it.rate),
        product_id: it.product_id || null,
      })),
    });

    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    revalidatePath("/reports");
    revalidatePath("/products");
    return { ok: true, id: invoice.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
}

export async function recordPayment(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    const invoiceId = str(formData, "invoice_id");
    const amount = num(formData, "amount");

    if (!invoiceId) return { ok: false, error: "Missing invoice." };
    if (amount <= 0) return { ok: false, error: "Amount must be greater than zero." };

    await erpApi.recordPayment(ctx.org.id, invoiceId, {
      amount,
      payment_method: str(formData, "payment_method", "cash"),
      reference: str(formData, "reference"),
      notes: str(formData, "notes"),
    });

    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    revalidatePath("/reports");
    return { ok: true, id: invoiceId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to record payment.",
    };
  }
}

// ===================== CLIENTS =====================

export async function createClientAction(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    const name = str(formData, "name");
    const email = str(formData, "email");
    if (!name || !email) return { ok: false, error: "Name and email are required." };

    const client = await erpApi.createClient(ctx.org.id, {
      name,
      email,
      phone: str(formData, "phone"),
      address: str(formData, "address"),
      company: str(formData, "company"),
    });

    revalidatePath("/clients");
    revalidatePath("/dashboard");
    return { ok: true, id: client.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create client.",
    };
  }
}

export async function deleteClient(clientId: string) {
  const ctx = await requireRole("editor");
  await erpApi.deleteClient(ctx.org.id, clientId);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function updateClient(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    const clientId = str(formData, "client_id");
    const name = str(formData, "name");
    const email = str(formData, "email");
    if (!clientId || !name || !email)
      return { ok: false, error: "Name and email are required." };

    await erpApi.updateClient(ctx.org.id, clientId, {
      name,
      email,
      phone: str(formData, "phone"),
      address: str(formData, "address"),
      company: str(formData, "company"),
      status: str(formData, "status", "active") === "inactive" ? "inactive" : "active",
    });

    revalidatePath("/clients");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update client." };
  }
}

// ===================== PRODUCTS / INVENTORY =====================

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    const name = str(formData, "name");
    if (!name) return { ok: false, error: "Product name is required." };

    const product = await erpApi.createProduct(ctx.org.id, {
      name,
      description: str(formData, "description"),
      unit_price: num(formData, "unit_price"),
      currency: str(formData, "currency", "USD"),
      category: str(formData, "category"),
      unit: str(formData, "unit", "item"),
      sku: str(formData, "sku"),
      stock_quantity: Math.trunc(num(formData, "stock_quantity")),
      low_stock_threshold: Math.trunc(num(formData, "low_stock_threshold", 5)),
      track_stock: formData.get("track_stock") === "on",
    });

    revalidatePath("/products");
    revalidatePath("/dashboard");
    return { ok: true, id: product.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create product.",
    };
  }
}

export async function updateProductStock(productId: string, quantity: number) {
  const ctx = await requireRole("editor");
  await erpApi.updateProduct(ctx.org.id, productId, {
    stock_quantity: Math.max(0, Math.trunc(quantity)),
  });
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const ctx = await requireRole("editor");
  await erpApi.updateProduct(ctx.org.id, productId, { is_active: isActive });
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function updateProductAction(formData: FormData) {
  const ctx = await requireRole("editor");
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!id || !name) return;

  await erpApi.updateProduct(ctx.org.id, id, {
    name,
    description: str(formData, "description"),
    unit_price: num(formData, "unit_price"),
    currency: str(formData, "currency", "USD"),
    category: str(formData, "category"),
    unit: str(formData, "unit", "item"),
    sku: str(formData, "sku"),
    stock_quantity: Math.trunc(num(formData, "stock_quantity")),
    low_stock_threshold: Math.trunc(num(formData, "low_stock_threshold", 5)),
    track_stock: formData.get("track_stock") === "on",
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function deleteProduct(productId: string) {
  const ctx = await requireRole("editor");
  await erpApi.deleteProduct(ctx.org.id, productId);
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

// ===================== SETTINGS / PROFILE =====================

export async function updateProfile(formData: FormData) {
  await authApi.updateProfile({
    full_name: str(formData, "full_name"),
    company_name: str(formData, "company_name"),
    company_email: str(formData, "company_email"),
    company_address: str(formData, "company_address"),
    company_phone: str(formData, "company_phone"),
    default_currency: str(formData, "default_currency", "USD"),
    default_tax_rate: num(formData, "default_tax_rate"),
    default_notes: str(formData, "default_notes"),
    default_terms: str(formData, "default_terms"),
  });

  revalidatePath("/settings");
}

// ===================== TEAM =====================

export async function inviteTeamMember(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    const email = str(formData, "email").toLowerCase();
    const name = str(formData, "name", email.split("@")[0] ?? "Member");
    if (!email.includes("@")) return { ok: false, error: "Enter a valid email." };

    const role = str(formData, "role", "viewer");

    await orgsApi.inviteMember(ctx.org.id, {
      email,
      name,
      role: ["owner", "admin", "editor", "viewer"].includes(role) ? role : "viewer",
      department: str(formData, "department"),
    });

    revalidatePath("/team");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to send invite." };
  }
}

export async function updateTeamMemberRole(
  memberId: string,
  role: TeamRole,
): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    await orgsApi.updateMemberRole(ctx.org.id, memberId, role);
    revalidatePath("/team");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update member." };
  }
}

export async function removeTeamMember(memberId: string): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    await orgsApi.removeMember(ctx.org.id, memberId);
    revalidatePath("/team");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to remove member." };
  }
}

// ===================== SEARCH =====================

export async function searchWorkspaceData() {
  const ctx = await requireRole("viewer");
  try {
    const [results, members] = await Promise.all([
      erpApi.search(ctx.org.id, "").catch(() => ({ clients: [], products: [], invoices: [], expenses: [] })),
      orgsApi.listMembers(ctx.org.id).catch(() => []),
    ]);
    return {
      clientsData: results.clients || [],
      productsData: results.products || [],
      invoicesData: results.invoices || [],
      teamData: members || [],
    };
  } catch {
    return {
      clientsData: [],
      productsData: [],
      invoicesData: [],
      teamData: [] as TeamMember[],
    };
  }
}

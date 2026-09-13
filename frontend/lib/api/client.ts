import type {
  AuthResponse,
  Client,
  ClientWithStats,
  DashboardStats,
  Expense,
  Invoice,
  InvoiceWithItems,
  Organization,
  Product,
  PlanDetail,
  PriceMapping,
  Profile,
  ReportData,
  Subscription,
  TeamMember,
  User,
} from "./types";

const DEFAULT_API_BASE = "http://127.0.0.1:8000/api/v1";

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return DEFAULT_API_BASE;
}

export interface ApiErrorPayload {
  detail?: string;
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorPayload;

  constructor(status: number, data: ApiErrorPayload) {
    const msg = data.detail || data.message || `API error ${status}`;
    super(msg);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    // Server environment (Server Actions, SSR, Route Handlers)
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get("bp_access_token")?.value ?? null;
    } catch {
      return null;
    }
  } else {
    // Browser environment
    const match = document.cookie.match(/(?:^|; )bp_access_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get("bp_refresh_token")?.value ?? null;
    } catch {
      return null;
    }
  } else {
    const match = document.cookie.match(/(?:^|; )bp_refresh_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access?: string };
    if (data.access) {
      if (typeof window === "undefined") {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          cookieStore.set("bp_access_token", data.access, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
          });
        } catch {
          // ignore cookie set failure outside action context
        }
      } else {
        document.cookie = `bp_access_token=${encodeURIComponent(data.access)}; path=/; max-age=86400; SameSite=Lax`;
      }
      return data.access;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  tokenOverride?: string | null,
): Promise<T> {
  const base = getApiBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  let token = tokenOverride !== undefined ? tokenOverride : await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, attempt one refresh
  if (res.status === 401 && !tokenOverride) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      token = newToken;
      headers["Authorization"] = `Bearer ${token}`;
      res = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  if (!res.ok) {
    let errData: ApiErrorPayload = {};
    try {
      errData = (await res.json()) as ApiErrorPayload;
    } catch {
      errData = { detail: res.statusText };
    }
    throw new ApiError(res.status, errData);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  return (await res.json()) as T;
}

// ==================== AUTH API ====================

export const authApi = {
  async signup(data: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/signup/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async googleAuth(data: {
    code?: string;
    redirect_uri?: string;
    id_token?: string;
  }): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/google/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getGoogleConfig(): Promise<{ client_id: string }> {
    return apiClient<{ client_id: string }>("/auth/google/");
  },

  async logout(refreshToken?: string): Promise<{ detail: string }> {
    const refresh = refreshToken || (await getRefreshToken());
    return apiClient<{ detail: string }>("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh: refresh || "" }),
    });
  },

  async getMe(): Promise<User> {
    return apiClient<User>("/me/");
  },

  async getProfile(): Promise<Profile> {
    return apiClient<Profile>("/me/profile/");
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    return apiClient<Profile>("/profile/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async requestPasswordReset(email: string): Promise<{ detail: string }> {
    return apiClient<{ detail: string }>("/auth/password/reset/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async confirmPasswordReset(data: { uid: string; token: string; password: string }): Promise<{ detail: string }> {
    return apiClient<{ detail: string }>("/auth/password/reset/confirm/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async claimPendingInvites(): Promise<{ claimed: number }> {
    return apiClient<{ claimed: number }>("/auth/invites/claim/", {
      method: "POST",
    });
  },
};

// ==================== ORGANIZATIONS API ====================

export const orgsApi = {
  async list(): Promise<Organization[]> {
    const res = await apiClient<{ results?: Organization[] } | Organization[]>("/orgs/");
    if (Array.isArray(res)) return res;
    return res.results ?? [];
  },

  async get(id: string): Promise<Organization> {
    return apiClient<Organization>(`/orgs/${id}/`);
  },

  async create(data: Partial<Organization>): Promise<Organization> {
    return apiClient<Organization>("/orgs/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    return apiClient<Organization>(`/orgs/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`/orgs/${id}/`, {
      method: "DELETE",
    });
  },

  async listMembers(orgId: string): Promise<TeamMember[]> {
    const res = await apiClient<{ results?: TeamMember[] } | TeamMember[]>(`/orgs/${orgId}/members/`);
    if (Array.isArray(res)) return res;
    return res.results ?? [];
  },

  async inviteMember(
    orgId: string,
    data: { email: string; role?: string; roleIds?: string[]; name?: string; department?: string },
  ): Promise<TeamMember> {
    return apiClient<TeamMember>(`/orgs/${orgId}/invites/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateMemberRole(orgId: string, memberId: string, role: string | string[]): Promise<TeamMember> {
    return apiClient<TeamMember>(`/orgs/${orgId}/members/${memberId}/roles/`, {
      method: "PATCH",
      body: JSON.stringify(Array.isArray(role) ? { role_ids: role } : { role }),
    });
  },

  async removeMember(orgId: string, memberId: string): Promise<void> {
    await apiClient<void>(`/orgs/${orgId}/members/${memberId}/`, {
      method: "DELETE",
    });
  },

  async getMyPermissions(orgId: string): Promise<string[]> {
    const res = await apiClient<{ permissions: string[] }>(`/orgs/me/permissions/?org=${encodeURIComponent(orgId)}`);
    return res.permissions;
  },
};

// ==================== ERP API ====================

export const erpApi = {
  // --- Invoices ---
  async listInvoices(orgId: string): Promise<Invoice[]> {
    const res = await apiClient<{ results?: Invoice[] } | Invoice[]>(`/orgs/${orgId}/invoices/`);
    if (Array.isArray(res)) return res;
    return res.results ?? [];
  },

  async getInvoice(orgId: string, id: string): Promise<InvoiceWithItems> {
    return apiClient<InvoiceWithItems>(`/orgs/${orgId}/invoices/${id}/`);
  },

  async createInvoice(orgId: string, data: Partial<Invoice> & { items?: Partial<InvoiceWithItems["items"][0]>[] }): Promise<InvoiceWithItems> {
    return apiClient<InvoiceWithItems>(`/orgs/${orgId}/invoices/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateInvoice(orgId: string, id: string, data: Partial<Invoice> & { items?: Partial<InvoiceWithItems["items"][0]>[] }): Promise<InvoiceWithItems> {
    return apiClient<InvoiceWithItems>(`/orgs/${orgId}/invoices/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteInvoice(orgId: string, id: string): Promise<void> {
    await apiClient<void>(`/orgs/${orgId}/invoices/${id}/`, {
      method: "DELETE",
    });
  },

  async recordPayment(orgId: string, invoiceId: string, data: { amount: number; payment_method: string; reference?: string; notes?: string }): Promise<void> {
    await apiClient<void>(`/orgs/${orgId}/invoices/${invoiceId}/payments/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async sendInvoice(orgId: string, id: string): Promise<InvoiceWithItems> {
    return apiClient<InvoiceWithItems>(`/orgs/${orgId}/invoices/${id}/send/`, {
      method: "POST",
    });
  },

  async getPublicInvoice(id: string): Promise<InvoiceWithItems> {
    return apiClient<InvoiceWithItems>(`/public/invoices/${id}/`, {}, null);
  },

  // --- Clients ---
  async listClients(orgId: string): Promise<ClientWithStats[]> {
    const res = await apiClient<{ results?: ClientWithStats[] } | ClientWithStats[]>(`/orgs/${orgId}/clients/?with_stats=true`);
    if (Array.isArray(res)) return res;
    return res.results ?? [];
  },

  async getClient(orgId: string, id: string): Promise<Client> {
    return apiClient<Client>(`/orgs/${orgId}/clients/${id}/`);
  },

  async createClient(orgId: string, data: Partial<Client>): Promise<Client> {
    return apiClient<Client>(`/orgs/${orgId}/clients/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateClient(orgId: string, id: string, data: Partial<Client>): Promise<Client> {
    return apiClient<Client>(`/orgs/${orgId}/clients/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteClient(orgId: string, id: string): Promise<void> {
    await apiClient<void>(`/orgs/${orgId}/clients/${id}/`, {
      method: "DELETE",
    });
  },

  // --- Products ---
  async listProducts(orgId: string): Promise<Product[]> {
    const res = await apiClient<{ results?: Product[] } | Product[]>(`/orgs/${orgId}/products/`);
    if (Array.isArray(res)) return res;
    return res.results ?? [];
  },

  async getProduct(orgId: string, id: string): Promise<Product> {
    return apiClient<Product>(`/orgs/${orgId}/products/${id}/`);
  },

  async createProduct(orgId: string, data: Partial<Product>): Promise<Product> {
    return apiClient<Product>(`/orgs/${orgId}/products/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateProduct(orgId: string, id: string, data: Partial<Product>): Promise<Product> {
    return apiClient<Product>(`/orgs/${orgId}/products/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(orgId: string, id: string): Promise<void> {
    await apiClient<void>(`/orgs/${orgId}/products/${id}/`, {
      method: "DELETE",
    });
  },

  // --- Expenses ---
  async listExpenses(orgId: string): Promise<Expense[]> {
    const res = await apiClient<{ results?: Expense[] } | Expense[]>(`/orgs/${orgId}/expenses/`);
    if (Array.isArray(res)) return res;
    return res.results ?? [];
  },

  async getExpense(orgId: string, id: string): Promise<Expense> {
    return apiClient<Expense>(`/orgs/${orgId}/expenses/${id}/`);
  },

  async createExpense(orgId: string, data: Partial<Expense>): Promise<Expense> {
    return apiClient<Expense>(`/orgs/${orgId}/expenses/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateExpense(orgId: string, id: string, data: Partial<Expense>): Promise<Expense> {
    return apiClient<Expense>(`/orgs/${orgId}/expenses/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteExpense(orgId: string, id: string): Promise<void> {
    await apiClient<void>(`/orgs/${orgId}/expenses/${id}/`, {
      method: "DELETE",
    });
  },

  // --- Dashboard & Reports ---
  async getDashboardStats(orgId: string): Promise<DashboardStats> {
    return apiClient<DashboardStats>(`/orgs/${orgId}/dashboard/stats/`);
  },

  async getReportData(orgId: string): Promise<ReportData> {
    return apiClient<ReportData>(`/orgs/${orgId}/reports/`);
  },

  async search(orgId: string, query: string): Promise<{
    invoices: Invoice[];
    clients: Client[];
    products: Product[];
    expenses: Expense[];
  }> {
    return apiClient(`/orgs/${orgId}/search/?q=${encodeURIComponent(query)}`);
  },
};

// ==================== BILLING API ====================

export const billingApi = {
  async getPlans(): Promise<{ count: number; results: PlanDetail[] }> {
    return apiClient<{ count: number; results: PlanDetail[] }>("/billing/plans/");
  },

  async getSubscription(orgId: string): Promise<Subscription> {
    return apiClient<Subscription>(`/orgs/${orgId}/subscription/`);
  },

  async createCheckoutSession(
    orgId: string,
    data: { priceId: string; successUrl: string; cancelUrl: string },
  ): Promise<{ checkout_url: string; session_id: string; url?: string }> {
    const res = await apiClient<{ checkout_url?: string; session_id: string; url?: string }>(
      `/orgs/${orgId}/billing/checkout/`,
      {
        method: "POST",
        body: JSON.stringify({
          price_id: data.priceId,
          success_url: data.successUrl,
          cancel_url: data.cancelUrl,
        }),
      },
    );
    const resolvedUrl = res.checkout_url || res.url || "";
    return {
      session_id: res.session_id,
      checkout_url: resolvedUrl,
      url: resolvedUrl,
    };
  },

  async createCustomerPortalSession(
    orgId: string,
    returnUrl: string,
  ): Promise<{ portal_url: string; url?: string }> {
    const res = await apiClient<{ portal_url?: string; url?: string }>(
      `/orgs/${orgId}/billing/portal/`,
      {
        method: "POST",
        body: JSON.stringify({ return_url: returnUrl }),
      },
    );
    const resolvedUrl = res.portal_url || res.url || "";
    return {
      portal_url: resolvedUrl,
      url: resolvedUrl,
    };
  },

  async syncCheckoutSession(
    orgId: string,
    sessionId: string,
  ): Promise<{ status: string; plan?: string }> {
    return apiClient<{ status: string; plan?: string }>(
      `/orgs/${orgId}/billing/sync-checkout/`,
      {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId }),
      },
    );
  },
};

// ==================== AI API ====================

export const aiApi = {
  async generateInvoiceItems(orgId: string, prompt: string, currency?: string): Promise<{ items: { description: string; quantity: number; rate: number }[] }> {
    return apiClient<{ items: { description: string; quantity: number; rate: number }[] }>(`/orgs/${orgId}/ai/generate-items/`, {
      method: "POST",
      body: JSON.stringify({ prompt, currency }),
    });
  },

  async askBizPilot(orgId: string, question: string): Promise<{ answer: string }> {
    return apiClient<{ answer: string }>(`/orgs/${orgId}/ai/assistant/`, {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  },

  async categorizeExpense(orgId: string, title: string, vendor?: string): Promise<{ category: string; confidence: number }> {
    return apiClient<{ category: string; confidence: number }>(`/orgs/${orgId}/ai/categorize-expense/`, {
      method: "POST",
      body: JSON.stringify({ title, vendor }),
    });
  },

  async draftPaymentReminder(orgId: string, invoiceId: string, tone = "professional"): Promise<{ subject: string; body: string }> {
    return apiClient<{ subject: string; body: string }>(`/orgs/${orgId}/ai/draft-reminder/`, {
      method: "POST",
      body: JSON.stringify({ invoice_id: invoiceId, tone }),
    });
  },
};

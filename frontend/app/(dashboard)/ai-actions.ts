"use server";

import { requireOrg, requireRole } from "@/lib/erp/org";
import { aiApi } from "@/lib/api/client";

export interface GeneratedItem {
  description: string;
  quantity: number;
  rate: number;
}

interface GenerateResult {
  ok: boolean;
  error?: string;
  items?: GeneratedItem[];
}

/**
 * AI invoice line-item generator.
 * Editors and above.
 */
export async function generateInvoiceItems(
  prompt: string,
  currency: string,
): Promise<GenerateResult> {
  try {
    const ctx = await requireRole("editor");
    const trimmed = prompt.trim();
    if (trimmed.length < 4)
      return { ok: false, error: "Describe what you'd like to bill." };
    if (trimmed.length > 600)
      return { ok: false, error: "Please keep the description under 600 characters." };

    const res = await aiApi.generateInvoiceItems(ctx.org.id, trimmed, currency);

    if (!res.items || res.items.length === 0)
      return { ok: false, error: "No usable line items were generated." };

    return { ok: true, items: res.items };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "AI request failed.",
    };
  }
}

interface AskResult {
  ok: boolean;
  error?: string;
  answer?: string;
}

/**
 * Ask BizPilot — answers business questions using the org's live report data.
 * Any org member (including viewers).
 */
export async function askBizPilot(question: string): Promise<AskResult> {
  try {
    const ctx = await requireOrg();
    const trimmed = question.trim();
    if (!trimmed) return { ok: false, error: "Ask a question first." };
    if (trimmed.length > 500)
      return { ok: false, error: "Keep questions under 500 characters." };

    const res = await aiApi.askBizPilot(ctx.org.id, trimmed);
    return { ok: true, answer: res.answer };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "AI request failed.",
    };
  }
}

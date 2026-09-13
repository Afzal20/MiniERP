import "server-only";

/**
 * OpenRouter client — server-side only (the key never reaches the browser).
 * Uses free-tier models; falls back across the chain if one is unavailable.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Free models (":free" tier on OpenRouter), tried in order. */
const MODEL_CHAIN = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "z-ai/glm-5.2:free",
  "google/gemma-4-31b-it:free",
];

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AiUnavailableError extends Error {}

export async function chatCompletion(
  messages: ChatMessage[],
  opts: { json?: boolean; maxTokens?: number } = {},
): Promise<string> {
  const key = process.env.OPEN_ROUTER_API_KEY;
  if (!key)
    throw new AiUnavailableError(
      "AI is not configured. Add OPEN_ROUTER_API_KEY to .env.",
    );

  let lastError = "Unknown error";

  for (const model of MODEL_CHAIN) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: opts.maxTokens ?? 1200,
          temperature: 0.4,
          ...(opts.json ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: AbortSignal.timeout(45_000),
      });

      if (!res.ok) {
        lastError = `${model}: HTTP ${res.status}`;
        continue;
      }

      const data = await res.json();
      const content: string | undefined =
        data?.choices?.[0]?.message?.content;
      if (!content || !content.trim()) {
        lastError = `${model}: empty response`;
        continue;
      }
      return content.trim();
    } catch (err) {
      lastError = `${model}: ${err instanceof Error ? err.message : "failed"}`;
    }
  }

  throw new AiUnavailableError(`All AI models are unavailable (${lastError}).`);
}

/** Best-effort extraction of a JSON array from a model response. */
export function extractJsonArray<T>(text: string): T[] | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(candidate.slice(start, end + 1));
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

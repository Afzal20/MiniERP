"use client";

import * as React from "react";
import { IconSparkles, IconSend } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { askBizPilot } from "@/app/(dashboard)/ai-actions";

const SUGGESTIONS = [
  "Which expenses are eating my profit?",
  "Who are my best clients?",
  "How is revenue trending vs last month?",
];

export function AskBizPilot({ orgName }: { orgName: string }) {
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleAsk(q?: string) {
    const query = (q ?? question).trim();
    if (!query || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await askBizPilot(query);
      if (!res.ok || !res.answer) {
        setError(res.error ?? "Couldn't answer that. Try again.");
        return;
      }
      setAnswer(res.answer);
      setQuestion("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconSparkles className="size-4 text-primary" />
          Ask BizPilot
          <span className="text-sm font-normal text-muted-foreground">
            about {orgName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <Textarea
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="e.g. What's my profit margin this month, and what should I cut?"
            maxLength={500}
            className="min-h-0 flex-1"
          />
          <Button size="icon" disabled={loading || !question.trim()} onClick={() => handleAsk()}>
            {loading ? (
              <span className="animate-pulse">…</span>
            ) : (
              <IconSend className="size-4" />
            )}
          </Button>
        </div>

        {!answer && !error && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Button
                key={s}
                variant="outline"
                size="sm"
                className="h-auto py-1 text-xs text-muted-foreground"
                disabled={loading}
                onClick={() => handleAsk(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        )}

        {loading && (
          <p className="text-sm animate-pulse text-muted-foreground">
            Analyzing your business data…
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {answer && (
          <div className="rounded-lg border bg-muted/40 p-3 text-sm whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

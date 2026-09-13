"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconRefresh, IconHome } from "@tabler/icons-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error cleanly without crashing
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="size-16 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
          <IconAlertTriangle className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            An unexpected error occurred. You can try refreshing the action or return to safety.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-neutral-400">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button onClick={() => reset()}>
            <IconRefresh className="size-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <IconHome className="size-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

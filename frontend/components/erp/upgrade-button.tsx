"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/(dashboard)/actions/stripe";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";

interface UpgradeButtonProps {
  priceId: string;
  className?: string;
  label?: React.ReactNode;
  showIcon?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

export function UpgradeButton({
  priceId,
  className,
  label,
  showIcon = false,
  variant,
  disabled = false,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    try {
      setLoading(true);
      const { url } = await createCheckoutSession(priceId);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading || disabled}
      variant={variant}
      className={className || "w-full sm:w-auto"}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : showIcon ? (
        <Zap className="mr-2 h-4 w-4" />
      ) : null}
      {label || "Upgrade to Pro"}
    </Button>
  );
}

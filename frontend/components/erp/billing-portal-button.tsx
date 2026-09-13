"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCustomerPortalSession } from "@/app/(dashboard)/actions/stripe";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  async function handleManageBilling() {
    try {
      setLoading(true);
      const { url } = await createCustomerPortalSession();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open billing portal");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleManageBilling} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Manage Subscription
    </Button>
  );
}

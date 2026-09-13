"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconPrinter, IconDownload, IconCopy, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

export function PublicInvoiceActions({
  invoiceId,
  invoiceNumber,
}: {
  invoiceId: string;
  invoiceNumber: string;
}) {
  const [copied, setCopied] = React.useState(false);

  function handlePrint() {
    window.print();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Invoice link copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  }

  function handleDownloadPdf() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    window.open(`${backendUrl}/public/invoices/${invoiceId}/pdf/`, "_blank");
  }

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <IconCheck className="size-4 mr-1 text-emerald-500" />
        ) : (
          <IconCopy className="size-4 mr-1" />
        )}
        {copied ? "Copied" : "Copy Link"}
      </Button>

      <Button variant="outline" size="sm" onClick={handlePrint}>
        <IconPrinter className="size-4 mr-1" />
        Print
      </Button>

      <Button size="sm" onClick={handleDownloadPdf}>
        <IconDownload className="size-4 mr-1" />
        Download PDF
      </Button>
    </div>
  );
}

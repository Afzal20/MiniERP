import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/footer";
import { IconHelpCircle, IconMessageQuestion } from "@tabler/icons-react";

export const metadata = {
  title: "Frequently Asked Questions · BizPilot",
  description: "Find answers to frequently asked questions about BizPilot invoicing, inventory tracking, payments, pricing, and security.",
};

const faqData = [
  {
    category: "General & Invoicing",
    items: [
      {
        q: "Do I need an account to create an invoice?",
        a: "No! You can generate, preview, and download professional PDF invoices immediately from the /create page without signing up. An account is only required when you want cloud saving, client history, inventory management, and expense tracking.",
      },
      {
        q: "Can I send invoices directly to my client by email?",
        a: "Yes. From your dashboard invoice detail view, you can click 'Send via Email'. BizPilot immediately delivers a branded email with the PDF attached directly to your client's email inbox.",
      },
      {
        q: "Can my clients view their invoices online without logging in?",
        a: "Yes. Every invoice has a secure public link (e.g. /view/[id]) that you can copy and share. Your clients can view the itemized breakdown, bank transfer details, and download the PDF without creating an account.",
      },
      {
        q: "Which currencies and tax formats are supported?",
        a: "BizPilot supports over 15 global currencies including USD, EUR, GBP, CAD, AUD, JPY, and BDT. You can set custom tax percentages and default currency rules in your Organization Settings.",
      },
    ],
  },
  {
    category: "Inventory & Expense Tracking",
    items: [
      {
        q: "How does the inventory stock tracking work?",
        a: "You can create products with SKU, unit price, and stock levels. When you issue invoices selecting those catalog products, your stock adjusts automatically. You can also define low-stock thresholds to be notified when items run low.",
      },
      {
        q: "Can I categorize my business expenses?",
        a: "Yes. You can record expenses across categories such as Software, Marketing, Office, Travel, Utilities, and more, specifying payment method and receipt reference numbers.",
      },
      {
        q: "Can I export my financial data?",
        a: "Absolutely. BizPilot provides one-click CSV export on Invoices, Clients, Products, and Expenses tables so you can import your numbers into Excel, Google Sheets, or QuickBooks anytime.",
      },
    ],
  },
  {
    category: "Team & Security",
    items: [
      {
        q: "Can I invite team members and control what they see?",
        a: "Yes. Organizations support role-based access control with Owner, Admin, Editor, and Viewer permission roles. Viewers have read-only access, Editors can manage invoices and inventory, and Admins can configure settings and manage team seats.",
      },
      {
        q: "Is my financial and client data secure?",
        a: "All data is isolated per organization, transmitted using 256-bit TLS encryption, stored in enterprise-grade databases, and protected by strict authentication guards.",
      },
      {
        q: "Can I manage multiple businesses under one account?",
        a: "Yes. BizPilot provides an instant Organization Switcher in the top navigation allowing you to seamlessly hop between different businesses or legal entities.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col justify-between pt-24">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <IconHelpCircle className="size-4" /> Got Questions?
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            Everything you need to know about BizPilot, invoicing, team collaboration, and security.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {faqData.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {cat.category}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {cat.items.map((item, idx) => (
                  <AccordionItem
                    key={item.q}
                    value={`cat-${catIdx}-item-${idx}`}
                    className="border-neutral-200 dark:border-neutral-800"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still have questions banner */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center space-y-4 shadow-sm">
          <div className="size-12 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <IconMessageQuestion className="size-6" />
          </div>
          <h3 className="text-xl font-bold">Have a question not listed here?</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Our support engineers are ready to assist you. Reach out and we will respond within 24 hours.
          </p>
          <div className="pt-2">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

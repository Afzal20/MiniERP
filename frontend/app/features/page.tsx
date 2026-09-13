import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import {
  IconFileInvoice,
  IconUsers,
  IconBox,
  IconReceipt2,
  IconRobot,
  IconChartPie,
  IconShieldLock,
  IconDownload,
  IconWorld,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";

export const metadata = {
  title: "Features · BizPilot",
  description: "Explore all the capabilities of BizPilot mini ERP: invoicing, inventory, expense tracking, client CRM, AI insights, and team collaboration.",
};

const featureList = [
  {
    icon: IconFileInvoice,
    title: "Instant Invoicing & PDF Generation",
    badge: "Core Feature",
    desc: "Create beautiful, branded invoices in under 30 seconds. Download vector-sharp PDFs instantly or generate secure public links for your clients.",
    highlights: ["Live visual preview", "Automated invoice numbering", "Custom notes and payment terms"],
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    icon: IconUsers,
    title: "Client CRM & Transaction History",
    badge: "CRM",
    desc: "Keep all client relationships, contact details, outstanding balances, and historical invoices neatly organized in one accessible directory.",
    highlights: ["Lifetime invoiced vs paid stats", "One-click invoice creation per client", "CSV export for accounting"],
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: IconBox,
    title: "Inventory & Stock Tracking",
    badge: "Operations",
    desc: "Catalog your products, manage SKU numbers, monitor live stock levels, and receive automatic alerts when inventory falls below threshold.",
    highlights: ["Inline quantity adjustments", "Low stock indicator badges", "Direct line-item picker on invoices"],
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: IconReceipt2,
    title: "Expense Management & Categorization",
    badge: "Finance",
    desc: "Track company expenditures across customizable categories (Software, Office, Travel, Utilities) to see where your money goes.",
    highlights: ["Multiple payment methods (card, bank, cash)", "Receipt notes & reference numbers", "Real-time cost subtraction"],
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: IconRobot,
    title: "BizPilot AI Assistant",
    badge: "AI Powered",
    desc: "Generate complete invoice line items from a plain-text prompt, and query your financial reports using conversational AI.",
    highlights: ["Natural language line item generation", "Live financial query answering", "Automated pricing recommendations"],
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: IconChartPie,
    title: "Financial Analytics & Reports",
    badge: "Analytics",
    desc: "Gain comprehensive visibility into your cash flow with real-time revenue graphs, expense breakdowns, and outstanding collections.",
    highlights: ["Total revenue & net profit KPIs", "Monthly collection charts", "Overdue invoice prioritization"],
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    icon: IconShieldLock,
    title: "Multi-Tenant & Role-Based Access",
    badge: "Enterprise",
    desc: "Switch between multiple company organizations effortlessly with strict workspace isolation and role permissions (Owner, Admin, Editor, Viewer).",
    highlights: ["Organization switcher", "Granular RBAC enforcement", "Team invitation system"],
    color: "text-cyan-500 bg-cyan-500/10",
  },
  {
    icon: IconWorld,
    title: "Global Multi-Currency & Taxes",
    badge: "Global",
    desc: "Invoice international clients in USD, EUR, GBP, CAD, AUD, BDT, and more with configurable default tax percentages and discounts.",
    highlights: ["Over 15 international currencies", "Flexible tax rate settings", "Automatic currency formatting"],
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: IconDownload,
    title: "Data Portability & One-Click Exports",
    badge: "Freedom",
    desc: "Your data belongs to you. Export invoices, client records, inventory lists, and expenses to CSV spreadsheets anytime with a single click.",
    highlights: ["One-click CSV exports", "Complete record compatibility", "Zero vendor lock-in"],
    color: "text-teal-500 bg-teal-500/10",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col justify-between pt-24">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Comprehensive Mini ERP
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Everything You Need to Run and Scale Your Business
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Eliminate tedious paperwork. BizPilot combines quick invoicing, inventory management, expense tracking, and intelligent analytics in one cohesive suite.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start Free Today <IconArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/create">Try Invoice Generator</Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card
                key={feat.title}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`size-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feat.badge}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                    {feat.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <IconCheck className="size-3.5 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Callout */}
        <div className="bg-gradient-to-br from-indigo-900/50 via-neutral-900 to-purple-950/50 border border-indigo-500/20 rounded-2xl p-8 md:p-12 text-center text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Built for Modern Freelancers, Agencies & Small Businesses
          </h2>
          <p className="text-neutral-300 max-w-2xl mx-auto text-base">
            No complex installations, no per-module upgrade fees, and no steep learning curves. Access your workspace from any browser on any device.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100" asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link href="/get-started">Explore Platform Demo</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

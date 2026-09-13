import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import {
  IconBuildingStore,
  IconShieldCheck,
  IconSparkles,
  IconUsers,
  IconRocket,
  IconChartBar,
} from "@tabler/icons-react";

export const metadata = {
  title: "About Us · BizPilot",
  description: "Learn about BizPilot's mission to simplify business operations for small businesses and freelancers worldwide.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col justify-between pt-24">
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Our Mission & Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Empowering Modern Businesses to Operate on Autopilot
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            BizPilot was born from a simple realization: small businesses spend too much time wrestling with spreadsheets, disconnected invoicing apps, and messy paper trails. We built BizPilot to replace the chaos with effortless automation.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 space-y-3">
              <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <IconRocket className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Speed & Simplicity</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Generate professional, tax-compliant invoices in 30 seconds. No bloated setup or weeks of onboarding required.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 space-y-3">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <IconShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Enterprise-Grade Security</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Multi-tenant data isolation, AES-256 encrypted communication, secure cloud database backups, and strict RBAC authorization.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6 space-y-3">
              <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <IconSparkles className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Intelligent Automation</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                AI-driven line item drafting and conversational financial insights so you always know your cash flow and upcoming dues.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-12 items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Why We Built BizPilot
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Traditional ERP systems are expensive, clunky, and engineered for corporations with thousands of staff. Freelancers and small studios get left with basic invoice templates that cannot track actual expenses, inventory, or payment history.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              BizPilot bridges the gap. It is light enough to fire up an invoice in half a minute without an account, yet robust enough to manage multiple organizations, track stock levels, and coordinate team members with permission controls.
            </p>
            <div className="flex gap-4 pt-2">
              <Button asChild>
                <Link href="/create">Try Invoice Generator</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-950/50">
              <div className="flex items-center gap-3 font-semibold text-sm mb-1">
                <IconBuildingStore className="size-5 text-indigo-500" />
                Designed for Growing Teams
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Invite team members with Owner, Admin, Editor, and Viewer permission roles.
              </p>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-950/50">
              <div className="flex items-center gap-3 font-semibold text-sm mb-1">
                <IconChartBar className="size-5 text-emerald-500" />
                Real-Time Financial Visibility
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Instant profit & loss breakdown, expense categorizations, and automated overdue tracking.
              </p>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-950/50">
              <div className="flex items-center gap-3 font-semibold text-sm mb-1">
                <IconUsers className="size-5 text-purple-500" />
                Dedicated Customer Support
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Our support team is available via direct chat and email within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Take Back Your Time?
          </h2>
          <p className="max-w-xl mx-auto text-indigo-100 text-base md:text-lg">
            Join hundreds of businesses managing their finances smoothly. Start for free with no credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-neutral-100" asChild>
              <Link href="/auth/sign-up">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

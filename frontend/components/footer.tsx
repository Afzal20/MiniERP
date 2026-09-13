"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-sm text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold tracking-tight">BizPilot</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The modern all-in-one mini ERP for growing businesses. Create invoices,
              manage inventory, track expenses, and get paid faster.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider uppercase">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="text-muted-foreground hover:text-foreground transition-colors">
                  Take the Tour
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider uppercase">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider uppercase">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-xs text-muted-foreground">
                  Security: 256-bit SSL encrypted & GDPR compliant
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; 2026 BizPilot Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Button } from "../ui/button";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600">Perfect for trying out</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>10 invoices per month</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>3 templates</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>PDF download</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <span className="mt-1">✗</span>
                <span>Cloud storage</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/create">Get Started</Link>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl border-2 border-indigo-500 relative scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="text-white/70">For serious freelancers</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-white/90">
                <span className="text-green-300 mt-1">✓</span>
                <span>Unlimited invoices</span>
              </li>
              <li className="flex items-start gap-2 text-white/90">
                <span className="text-green-300 mt-1">✓</span>
                <span>20+ templates</span>
              </li>
              <li className="flex items-start gap-2 text-white/90">
                <span className="text-green-300 mt-1">✓</span>
                <span>Cloud storage</span>
              </li>
              <li className="flex items-start gap-2 text-white/90">
                <span className="text-green-300 mt-1">✓</span>
                <span>Email delivery</span>
              </li>
              <li className="flex items-start gap-2 text-white/90">
                <span className="text-green-300 mt-1">✓</span>
                <span>Payment tracking</span>
              </li>
            </ul>
            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50" asChild>
              <Link href="/create">Start Free Trial</Link>
            </Button>
          </div>

          {/* Business Tier */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600">For teams & agencies</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>5 team members</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>API access</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>White-label</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-green-500 mt-1">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/create">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
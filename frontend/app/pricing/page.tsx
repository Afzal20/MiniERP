import { PricingCardSection } from "@/components/pricing/pricing-card-section";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { PricingFAQ } from "@/components/pricing/pricing-faq";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Zap } from "lucide-react";
import { Footer } from "@/components/footer";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white relative">
            {/* Primary Pricing Section matching the uploaded design */}
            <section className="pt-8 pb-12">
                <PricingCardSection inDashboard={false} />
            </section>

            {/* Trust Indicators */}
            <section className="pb-16 px-4 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="pt-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                                <Check className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold mb-2">14-Day Free Trial</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Try any Pro feature risk-free. Cancel anytime.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="pt-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold mb-2">Secure Payments</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Encrypted 256-bit SSL checkout powered by Stripe.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="pt-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold mb-2">Cancel Anytime</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage billing directly from the Stripe customer portal.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16 px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
                            Compare Plans in Detail
                        </h2>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400">
                            See exactly what&apos;s included in each plan
                        </p>
                    </div>
                    <PricingComparison />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 relative z-10">
                <PricingFAQ />
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 mt-10 relative z-10 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg mb-8 text-neutral-500 dark:text-neutral-400">
                        Join thousands of freelancers and businesses creating professional invoices.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/create"
                            className="inline-flex items-center justify-center px-8 py-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                        >
                            Start Free Trial
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
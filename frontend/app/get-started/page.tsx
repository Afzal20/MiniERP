import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Shield, Clock, LayoutDashboard, Users, BarChart3, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

function GetStartedPage() {
    return (
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
            {/* Decorative dots - top right */}
            <div className="absolute top-20 right-20 grid grid-cols-3 gap-2 opacity-30">
                {Array.from({ length: 27 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                ))}
            </div>

            {/* Decorative dots - bottom left */}
            <div className="absolute bottom-40 left-20 grid grid-cols-3 gap-2 opacity-30">
                {Array.from({ length: 27 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                ))}
            </div>

            {/* Floating elements */}
            <div className="absolute top-32 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

            {/* Hero Section */}
            <div className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-start pt-20 pb-12">
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Start creating invoices in seconds</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
                        Choose Your Path to
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
                        <span className="bg-gradient-to-r from-[#4ade80] via-[#86efac] to-[#d9f99d] bg-clip-text text-transparent">
                            Professional Invoicing
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        Whether you need a quick invoice or full business management,
                        we&apos;ve got you covered. Pick what works best for you.
                    </p>
                </div>

                {/* Two Options Cards */}
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
                    {/* Option 1: Create Invoice (No Login) */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Create Invoice Now
                            </CardTitle>
                            <div className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium mt-2">
                                <Zap className="w-3 h-3" />
                                No signup required
                            </div>
                            <CardDescription className="text-blue-100 mt-3">
                                Perfect for quick, one-time invoices
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>Create professional invoices instantly</span>
                                </li>
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>Beautiful templates ready to use</span>
                                </li>
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>Download PDF in one click</span>
                                </li>
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span>100% free, no hidden fees</span>
                                </li>
                            </ul>

                            <RainbowButton
                                size="lg"
                                className="w-full text-background group-hover:scale-[1.02] transition-transform"
                                asChild
                            >
                                <Link href="/create" className="flex items-center justify-center gap-2">
                                    Start Creating
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </RainbowButton>

                            <p className="text-center text-sm text-blue-200">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Takes less than 30 seconds
                            </p>
                        </CardContent>
                    </Card>

                    {/* Option 2: Login for Dashboard */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group relative overflow-hidden">
                        {/* Premium badge */}
                        <div className="absolute top-4 right-4">
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                RECOMMENDED
                            </span>
                        </div>

                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <LayoutDashboard className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Access Full Dashboard
                            </CardTitle>
                            <div className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium mt-2">
                                <Shield className="w-3 h-3" />
                                Full features unlocked
                            </div>
                            <CardDescription className="text-blue-100 mt-3">
                                Complete invoicing & business management
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    <span>Save & manage all your invoices</span>
                                </li>
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    <span>Client database & history</span>
                                </li>
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    <span>Analytics & payment tracking</span>
                                </li>
                                <li className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    <span>AI-powered automation</span>
                                </li>
                            </ul>

                            <Button
                                size="lg"
                                className="w-full bg-white text-indigo-700 hover:bg-blue-50 font-semibold group-hover:scale-[1.02] transition-transform"
                                asChild
                            >
                                <Link href="/auth/login" className="flex items-center justify-center gap-2">
                                    Login to Dashboard
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <p className="text-center text-sm text-blue-200">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/sign-up" className="text-white underline hover:text-green-300 transition-colors">
                                    Sign up free
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature Highlights */}
                <div className="mt-20 w-full max-w-5xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
                        Why Choose Our Platform?
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center group">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                                <Zap className="w-7 h-7 text-yellow-300" />
                            </div>
                            <h3 className="font-semibold mb-1">Lightning Fast</h3>
                            <p className="text-sm text-blue-100">Create invoices in under 30 seconds</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                                <Users className="w-7 h-7 text-green-300" />
                            </div>
                            <h3 className="font-semibold mb-1">Client Management</h3>
                            <p className="text-sm text-blue-100">Keep all client info organized</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                                <BarChart3 className="w-7 h-7 text-blue-300" />
                            </div>
                            <h3 className="font-semibold mb-1">Smart Analytics</h3>
                            <p className="text-sm text-blue-100">Track payments & revenue</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                                <Shield className="w-7 h-7 text-purple-300" />
                            </div>
                            <h3 className="font-semibold mb-1">Secure & Private</h3>
                            <p className="text-sm text-blue-100">Your data is always protected</p>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 text-center">
                    <p className="text-blue-200 text-sm mb-4">Trusted by thousands of freelancers & businesses</p>
                    <div className="flex items-center justify-center gap-8 text-white/60">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">10K+</p>
                            <p className="text-xs">Invoices Created</p>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">5K+</p>
                            <p className="text-xs">Happy Users</p>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">99%</p>
                            <p className="text-xs">Satisfaction</p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <p className="text-blue-100 mb-4">
                        Not sure which option to choose?
                    </p>
                    <Button
                        variant="outline"
                        className="border-white/30 text-foreground hover:bg-white/10"
                        asChild
                    >
                        <Link href="/pricing">Compare Plans →</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}

export default GetStartedPage;

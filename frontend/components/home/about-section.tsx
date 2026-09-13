import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Zap, Heart, Award, TrendingUp } from "lucide-react";


export function HeroSection() {
    return (
        <section className="pt-20 pb-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0">
                    About Us
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-background">
                    Your Business, on Autopilot
                </h1>
                <p className="text-xl text-background leading-relaxed">
                    We&apos;re on a mission to give small businesses the tools big companies take for
                    granted — invoicing, clients, inventory, expenses and insights in one place.
                    No enterprise price tags. No complexity. Just results.
                </p>
            </div>
        </section>
    )
}

export function Values() {
    return (
        <section className="py-16 px-4 bg-white rounded-xl">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
                    <p className="text-lg text-gray-600">The principles that guide everything we do</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-indigo-600" />
                            </div>
                            <CardTitle>Simplicity First</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                We believe great tools should be intuitive. Every feature is designed to save you
                                time and remove complexity.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <CardTitle>User-Focused</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Your feedback shapes our roadmap. We listen to our community and build features
                                that solve real problems.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>Lightning Fast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Time is money. Our platform is optimized for speed, so you can create invoices
                                and get back to your work.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <Heart className="h-6 w-6 text-pink-600" />
                            </div>
                            <CardTitle>Built with Care</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Every pixel, every interaction is crafted with attention to detail. We&apos;re
                                perfectionists who care about your experience.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Award className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>Professional Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Your invoices represent your brand. We ensure they always look polished and
                                professional.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                            <CardTitle>Continuous Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                We&apos;re constantly improving and adding features. Your success drives our
                                innovation.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}


export function CallToAction() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready for Takeoff?
                </h2>
                <p className="text-xl text-background mb-8">
                    Join thousands of owners who run their business on BizPilot
                </p>
                <a
                    href="/get-started"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                    Get Started Free
                </a>
            </div>
        </section>
    )
}


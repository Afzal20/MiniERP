"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/footer";

export default function ContactsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Get in Touch
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        We&apos;d Love to Hear From You
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Have a question, feedback, or need help? Our team is here to assist you.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Your Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData({ ...formData, subject: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <textarea
                                            id="message"
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Mail className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email me</h3>
                                        <p className="text-sm text-gray-600">afzalhossen2019@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Phone className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Whatsapp</h3>
                                        <p className="text-sm text-gray-600">+880 1771932019</p>
                                        <p className="text-sm text-gray-600">Just Message your Problem and details with your user Name or email</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Business Hours</h3>
                                        <p className="text-sm text-gray-600">
                                            Sunday-Wednesday, 9am-6pm EST<br />
                                            Thursday: 11am - 2pm<br />
                                            Friday: Closed
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-lg mb-2">Need Immediate Help?</h3>
                                <p className="text-indigo-100 text-sm mb-4">
                                    Check out our FAQ section for quick answers to common questions.
                                </p>
                                <Button variant="secondary" className="w-full" asChild>
                                    <a href="/pricing#faq">View FAQ</a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Preview */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Find answers to common questions about BizPilot
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">How do I create an invoice?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm">
                                    Simply click &quot;Get Started&quot; and fill in your business details, add line items,
                                    and download your professional invoice as a PDF.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Is there a free plan?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm">
                                    Yes! Our free plan includes 10 invoices per month with 3 templates and PDF export.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Can I customize templates?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm">
                                    Absolutely! Add your logo, brand colors, and custom fields to match your business
                                    identity.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Is my data secure?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm">
                                    Yes, we use bank-level encryption to ensure your data is always safe and secure.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
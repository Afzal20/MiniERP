import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    Palette,
    Download,
    Cloud,
    Mail,
    CreditCard,
    BarChart,
    Lock,
    Smartphone,
    Clock,
    Globe,
    Users,
    Repeat,
    Calculator,
    Sparkles,
    Zap,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Professional Templates",
        description: "Choose from 20+ beautifully designed invoice templates that make your business look professional.",
        color: "bg-blue-100 text-blue-600",
    },
    {
        icon: Zap,
        title: "30-Second Creation",
        description: "Create a complete, professional invoice in just 30 seconds. No learning curve required.",
        color: "bg-yellow-100 text-yellow-600",
    },
    {
        icon: Download,
        title: "Instant PDF Export",
        description: "Download your invoices as high-quality PDFs, ready to send to clients immediately.",
        color: "bg-green-100 text-green-600",
    },
    {
        icon: Cloud,
        title: "Cloud Storage",
        description: "Securely store all your invoices in the cloud. Access them anytime, anywhere.",
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        icon: Mail,
        title: "Email Delivery",
        description: "Send invoices directly to clients via email with automated delivery tracking.",
        color: "bg-purple-100 text-purple-600",
    },
    {
        icon: CreditCard,
        title: "Payment Tracking",
        description: "Track which invoices are paid, pending, or overdue with our payment management system.",
        color: "bg-pink-100 text-pink-600",
    },
    {
        icon: Repeat,
        title: "Recurring Invoices",
        description: "Set up automatic recurring invoices for regular clients and subscriptions.",
        color: "bg-orange-100 text-orange-600",
    },
    {
        icon: Calculator,
        title: "Auto Calculations",
        description: "Automatic tax, discount, and total calculations. No math errors, ever.",
        color: "bg-teal-100 text-teal-600",
    },
    {
        icon: Palette,
        title: "Custom Branding",
        description: "Add your logo, brand colors, and custom fields to match your business identity.",
        color: "bg-red-100 text-red-600",
    },
    {
        icon: Globe,
        title: "Multi-Currency",
        description: "Support for 150+ currencies with automatic conversion rates.",
        color: "bg-cyan-100 text-cyan-600",
    },
    {
        icon: BarChart,
        title: "Analytics Dashboard",
        description: "Track your revenue, outstanding payments, and business insights in real-time.",
        color: "bg-violet-100 text-violet-600",
    },
    {
        icon: Lock,
        title: "Secure & Private",
        description: "Bank-level encryption ensures your data is always safe and secure.",
        color: "bg-gray-100 text-gray-600",
    },
    {
        icon: Smartphone,
        title: "Mobile Friendly",
        description: "Create and manage invoices on the go with our mobile-optimized interface.",
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        icon: Users,
        title: "Client Management",
        description: "Save and manage client information for faster invoice creation.",
        color: "bg-rose-100 text-rose-600",
    },
    {
        icon: Clock,
        title: "Time Tracking",
        description: "Log hours for projects and automatically add them to your invoices.",
        color: "bg-amber-100 text-amber-600",
    },
    {
        icon: Sparkles,
        title: "AI-Powered Suggestions",
        description: "Get smart suggestions for line items and descriptions based on your industry.",
        color: "bg-fuchsia-100 text-fuchsia-600",
    },
];

export function FeaturesSection() {
    return (
        <section className="w-full py-20 px-4 bg-white text-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Everything You Need, Nothing You Don&apos;t
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our feature set is designed for one purpose: to make your invoicing process as fast and
                        painless as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Clock, Globe, Shield, Smartphone, Sparkles, Zap } from "lucide-react";

export function Features() {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Powerful features to help you invoice faster and get paid quicker
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
                        <p className="text-gray-600">Create invoices in 30 seconds. No more 5-minute waits.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered</h3>
                        <p className="text-gray-600">Smart suggestions and auto-fill to speed up your workflow.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8 border border-pink-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
                        <p className="text-gray-600">Your data is encrypted and never shared with third parties.</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Currency</h3>
                        <p className="text-gray-600">Support for 150+ currencies with automatic conversion.</p>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Friendly</h3>
                        <p className="text-gray-600">Works perfectly on any device. Create invoices on the go.</p>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Tracking</h3>
                        <p className="text-gray-600">Track which invoices are paid, pending, or overdue.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
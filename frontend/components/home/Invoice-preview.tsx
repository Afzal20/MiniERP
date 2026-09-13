

export function InvoicePreview() {
    return (
        <div className="w-full max-w-5xl mt-8 px-4 relative mb-20 ">
            <div className="rounded-lg p-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
                <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-white/20 bg-white">
                    <div className="p-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">INVOICE</h3>
                                    <p className="text-gray-600 mt-1">#INV-2024-001</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">December 31, 2024</p>
                                    <p className="text-sm text-gray-600">Due: January 30, 2025</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">From</p>
                                    <p className="text-gray-900 font-medium">Your Company</p>
                                    <p className="text-gray-600 text-sm">San Francisco, CA 94102</p>
                                    <p className="text-gray-600 text-sm">United States</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">To</p>
                                    <p className="text-gray-900 font-medium">Acme Corporation</p>
                                    <p className="text-gray-600 text-sm">New York, NY 10001</p>
                                    <p className="text-gray-600 text-sm">United States</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-700 mb-2">
                                    <div className="col-span-2">Description</div>
                                    <div className="text-right">Qty</div>
                                    <div className="text-right">Amount</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                                        <div className="col-span-2">Web Development Services</div>
                                        <div className="text-right">40 hrs</div>
                                        <div className="text-right">$4,000.00</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                                        <div className="col-span-2">UI/UX Design</div>
                                        <div className="text-right">20 hrs</div>
                                        <div className="text-right">$2,000.00</div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal:</span>
                                            <span>$6,000.00</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Tax (10%):</span>
                                            <span>$600.00</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                            <span>Total:</span>
                                            <span>$6,600.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Thank you!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2 rounded-full shadow-lg">
                <p className="text-sm font-semibold">✨ Real-time Preview</p>
            </div>
        </div>
    );
}
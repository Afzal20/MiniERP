"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, ArrowLeft } from "lucide-react";
import {
    type InvoiceData,
    type InvoiceItem,
} from "@/lib/invoice";
import { BusinessForm } from "@/components/invoice/BusinessForm";
import { ClientForm } from "@/components/invoice/ClientForm";
import { InvoiceDetailsForm } from "@/components/invoice/InvoiceDetailsForm";
import { LineItemsEditor } from "@/components/invoice/LineItemsEditor";
import { NotesField } from "@/components/invoice/NotesField";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { DownloadInvoicePDF } from "@/components/invoice/DownloadInvoicePDF";

export default function CreateInvoicePage() {
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        businessName: "",
        businessEmail: "",
        businessAddress: "",
        businessPhone: "",
        clientName: "",
        clientEmail: "",
        clientAddress: "",
        invoiceNumber: "", // Initialized in useEffect
        invoiceDate: "",   // Initialized in useEffect
        dueDate: "",       // Initialized in useEffect
        currency: "USD",
        items: [{ id: "1", description: "", quantity: 1, rate: 0 }],
        taxRate: 0,
        notes: "",
    });

    useEffect(() => {
        setInvoiceData(prev => ({
            ...prev,
            invoiceNumber: `INV-${new Date().getFullYear()}-001`,
            invoiceDate: new Date().toISOString().split("T")[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
        }));
    }, []);

    const updateField = (field: keyof InvoiceData, value: string | number) => {
        setInvoiceData((prev) => ({ ...prev, [field]: value }));
    };

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            description: "",
            quantity: 1,
            rate: 0,
        };
        setInvoiceData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const removeItem = (id: string) => {
        if (invoiceData.items.length > 1) {
            setInvoiceData((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.id !== id),
            }));
        }
    };

    const updateItem = (
        id: string,
        field: keyof InvoiceItem,
        value: string | number
    ) => {
        setInvoiceData((prev) => ({
            ...prev,
            items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-6 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            asChild
                        >
                            <Link href="/">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Create Invoice
                            </h1>
                            <p className="text-blue-100 text-sm">
                                Fill in the details and watch your invoice come to life
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm">Real-time Preview</span>
                        </div>
                        <DownloadInvoicePDF
                            data={invoiceData}
                            className="bg-white text-indigo-700 hover:bg-blue-50 font-semibold px-4 py-2 rounded-md"
                            label="Download PDF"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="space-y-6">
                        <BusinessForm data={invoiceData} updateField={updateField} />
                        <ClientForm data={invoiceData} updateField={updateField} />
                        <InvoiceDetailsForm data={invoiceData} updateField={updateField} />
                        <LineItemsEditor
                            items={invoiceData.items}
                            currency={invoiceData.currency}
                            taxRate={invoiceData.taxRate}
                            addItem={addItem}
                            removeItem={removeItem}
                            updateItem={updateItem}
                            updateField={updateField}
                        />
                        <NotesField value={invoiceData.notes} onChange={(v) => updateField("notes", v)} />
                    </div>

                    {/* Preview Section */}
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <div className="relative">
                            {/* Preview Badge */}
                            <div className="absolute -top-3 left-4 z-10">
                                <span className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Live Preview
                                </span>
                            </div>

                            {/* Invoice Preview */}
                            <InvoicePreview data={invoiceData} />
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex gap-3">
                            <DownloadInvoicePDF
                                data={invoiceData}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                                label="Download PDF"
                            />
                        </div>

                        {/* Pro Tip */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-800">
                                <span className="font-semibold">💡 Pro Tip:</span> Sign up for free
                                to save your invoices, manage clients, and track payments!
                            </p>
                            <Link
                                href="/auth/sign-up"
                                className="text-sm text-amber-700 underline hover:text-amber-900 mt-1 inline-block"
                            >
                                Create free account →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
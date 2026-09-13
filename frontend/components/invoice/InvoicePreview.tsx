"use client";

import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
  formatDate,
  type InvoiceData,
} from "@/lib/invoice";

type Props = {
  data: InvoiceData;
};

export function InvoicePreview({ data }: Props) {
  return (
    <div className="rounded-xl p-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
      <div className="rounded-xl overflow-hidden bg-white print:shadow-none">
        <div className="p-8">
          <div className="max-w-full">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">INVOICE</h3>
                <p className="text-gray-600 mt-1 font-mono">{data.invoiceNumber || "#INV-000"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{formatDate(data.invoiceDate) || "Invoice Date"}</p>
                <p className="text-sm text-gray-500">Due: {formatDate(data.dueDate) || "Due Date"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2 tracking-wider">From</p>
                <p className="text-gray-900 font-semibold">{data.businessName || "Your Business Name"}</p>
                {data.businessEmail && <p className="text-gray-600 text-sm">{data.businessEmail}</p>}
                {data.businessPhone && <p className="text-gray-600 text-sm">{data.businessPhone}</p>}
                {data.businessAddress && <p className="text-gray-600 text-sm">{data.businessAddress}</p>}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2 tracking-wider">To</p>
                <p className="text-gray-900 font-semibold">{data.clientName || "Client Name"}</p>
                {data.clientEmail && <p className="text-gray-600 text-sm">{data.clientEmail}</p>}
                {data.clientAddress && <p className="text-gray-600 text-sm">{data.clientAddress}</p>}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              <div className="space-y-2">
                {data.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 text-sm text-gray-600 py-1">
                    <div className="col-span-6 truncate">{item.description || "Item description"}</div>
                    <div className="col-span-2 text-right">{item.quantity}</div>
                    <div className="col-span-2 text-right">{formatCurrency(item.rate, data.currency)}</div>
                    <div className="col-span-2 text-right font-medium">
                      {formatCurrency(item.quantity * item.rate, data.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal(data.items), data.currency)}</span>
                  </div>
                  {data.taxRate > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax ({data.taxRate}%):</span>
                      <span>
                        {formatCurrency(
                          calculateTax(calculateSubtotal(data.items), data.taxRate),
                          data.currency
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-indigo-600">
                      {formatCurrency(calculateTotal(data.items, data.taxRate), data.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {data.notes && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Notes</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

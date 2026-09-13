"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/invoice";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
  formatDate,
} from "@/lib/invoice";

type Props = {
  data: InvoiceData;
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    color: "#111827",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
  mono: {
    fontFamily: "Helvetica",
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
    fontWeight: 700,
    marginBottom: 4,
  },
  sectionRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  section: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    paddingTop: 4,
    paddingBottom: 4,
  },
  colDesc: { flex: 6 },
  colQty: { flex: 2, textAlign: "right" as const },
  colRate: { flex: 2, textAlign: "right" as const },
  colAmt: { flex: 2, textAlign: "right" as const, fontWeight: 600 },
  totalsWrap: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 8,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 240,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsLabel: { color: "#6B7280" },
  totalsTotal: { fontSize: 16, fontWeight: 700, color: "#1F2937" },
  notes: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 16,
    paddingTop: 12,
    fontSize: 11,
    color: "#4B5563",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 16,
    paddingTop: 12,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 10,
  },
});

export function InvoicePDF({ data }: Props) {
  const subtotal = calculateSubtotal(data.items);
  const tax = calculateTax(subtotal, data.taxRate);
  const total = calculateTotal(data.items, data.taxRate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.mono}>{data.invoiceNumber || "#INV-000"}</Text>
          </View>
          <View>
            <Text>{formatDate(data.invoiceDate) || "Invoice Date"}</Text>
            <Text>Due: {formatDate(data.dueDate) || "Due Date"}</Text>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.label}>From</Text>
            <Text>{data.businessName || "Your Business Name"}</Text>
            {data.businessEmail ? <Text>{data.businessEmail}</Text> : null}
            {data.businessPhone ? <Text>{data.businessPhone}</Text> : null}
            {data.businessAddress ? <Text>{data.businessAddress}</Text> : null}
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>To</Text>
            <Text>{data.clientName || "Client Name"}</Text>
            {data.clientEmail ? <Text>{data.clientEmail}</Text> : null}
            {data.clientAddress ? <Text>{data.clientAddress}</Text> : null}
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colAmt}>Amount</Text>
        </View>

        {data.items.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.colDesc}>{item.description || "Item description"}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colRate}>{formatCurrency(item.rate, data.currency)}</Text>
            <Text style={styles.colAmt}>
              {formatCurrency(item.quantity * item.rate, data.currency)}
            </Text>
          </View>
        ))}

        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal:</Text>
              <Text>{formatCurrency(subtotal, data.currency)}</Text>
            </View>
            {data.taxRate > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Tax ({data.taxRate}%):</Text>
                <Text>{formatCurrency(tax, data.currency)}</Text>
              </View>
            ) : null}
            <View style={[styles.totalsRow, { borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 8 }] }>
              <Text style={styles.totalsTotal}>Total:</Text>
              <Text style={styles.totalsTotal}>{formatCurrency(total, data.currency)}</Text>
            </View>
          </View>
        </View>

        {data.notes ? (
          <View style={styles.notes}>
            <Text>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
}

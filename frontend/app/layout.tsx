import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ConditionalNavbar } from "@/components/conditional-navbar";
import { GoogleAuthProvider } from "@/components/google-provider";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "BizPilot — Your Business, on Autopilot",
    template: "%s · BizPilot",
  },
  description:
    "BizPilot is the mini ERP for small businesses: send professional invoices, track clients, manage inventory and expenses, and watch your numbers — all from one dashboard.",
  applicationName: "BizPilot",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleAuthProvider>
            <Suspense fallback={null}>
              <ConditionalNavbar />
            </Suspense>
            {children}
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

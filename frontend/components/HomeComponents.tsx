import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Button } from "@/components/ui/button";
import { InvoicePreview } from "./home/Invoice-preview";
import { FeaturesSection } from "./home/features-section";

import { CallToAction, HeroSection, Values } from "./home/about-section";

export default function HomeComponents() {
  return (
    <>
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-start pt-16 pb-12">
        <div className="text-center space-y-6 mb-12">
          <p className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium tracking-wide text-blue-100">
            BizPilot — Your Business, on Autopilot
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            Run your whole business from one dashboard.
          </h1>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            <span className="bg-gradient-to-r from-[#4ade80] via-[#86efac] to-[#d9f99d] bg-clip-text text-transparent">
              On autopilot.
            </span>
          </h1>



          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Invoices out the door in seconds. Inventory, expenses and payments
            tracked for you. BizPilot is the mini ERP built for small businesses —
            no spreadsheets, no chaos.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <RainbowButton
              size="lg"
              className="text-background"
              asChild
            >
              <Link href="/create">Create Your First Invoice </Link>
            </RainbowButton>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-foreground hover:bg-white/10 px-8"
              asChild
            >
              <Link href="/get-started">Take the Tour</Link>
            </Button>
          </div>
        </div>
      </div>
      <InvoicePreview />
      {/* How It Works Section */}
      <div id="how-it-works" className="w-full max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter Details</h3>
            <p className="text-blue-100">
              Add your business info, client details, and line items
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">See Live Preview</h3>
            <p className="text-blue-100">
              Watch your invoice update in real-time as you type
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Download PDF</h3>
            <p className="text-blue-100">
              Get a professional PDF ready to send to your client
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50 px-8"
            asChild
          >
            <Link href="/create">Try It Now - It&apos;s Free →</Link>
          </Button>
        </div>
      </div>
      <FeaturesSection />
      {/* Hero Section */}
      <HeroSection/>
      {/* Mission & Values */}
      <Values/>
      {/* CTA Section */}
      <CallToAction/>
    </>
  )
}

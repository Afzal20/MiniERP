import {
  IconBook,
  IconBrandGithub,
  IconFileDescription,
  IconHeadset,
  IconMail,
  IconMessageCircle,
  IconSearch,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I create my first invoice?",
    answer:
      "Navigate to the Invoices page and click 'New Invoice'. Fill in your client details, add line items with descriptions and amounts, then save or send the invoice directly to your client.",
  },
  {
    question: "Can I customize my invoice template?",
    answer:
      "Yes! Go to Settings > Invoice Defaults to customize your invoice number prefix, default payment terms, notes, and more. You can also upload your business logo.",
  },
  {
    question: "How do I add a new client?",
    answer:
      "Go to the Clients page and click 'Add Client'. Enter their business name, email, phone, and address. You can also add clients directly while creating an invoice.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We support bank transfers, credit/debit cards, and popular payment gateways. You can configure your preferred payment methods in Settings > Billing.",
  },
  {
    question: "Can I send recurring invoices?",
    answer:
      "Yes, you can set up recurring invoices from the Invoices page. Choose the frequency (weekly, monthly, quarterly) and we'll automatically generate and send invoices on schedule.",
  },
  {
    question: "How do I export my data?",
    answer:
      "You can export invoices, client lists, and financial reports from each respective page. We support CSV, PDF, and Excel formats.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption, secure cloud storage, and regular backups. Your financial data is protected with bank-level security.",
  },
]

export default function HelpPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6 text-center">
            <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
            <p className="text-muted-foreground mb-4">
              Search our knowledge base or browse common questions
            </p>
            <div className="relative max-w-md mx-auto">
              <IconSearch className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <a href="/dashboard" className="block rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <Card className="border-0 shadow-none hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <IconBook className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Getting Started</p>
                    <p className="text-xs text-muted-foreground">Quick setup guide</p>
                  </div>
                </CardContent>
              </Card>
            </a>
            <a href="/settings" className="block rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <Card className="border-0 shadow-none hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <IconFileDescription className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Documentation</p>
                    <p className="text-xs text-muted-foreground">Full feature docs</p>
                  </div>
                </CardContent>
              </Card>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="block rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <Card className="border-0 shadow-none hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <IconMessageCircle className="size-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Community</p>
                    <p className="text-xs text-muted-foreground">Join discussions</p>
                  </div>
                </CardContent>
              </Card>
            </a>
            <a href="/help" className="block rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <Card className="border-0 shadow-none hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-orange-500/10 p-2">
                    <IconBrandGithub className="size-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Changelog</p>
                    <p className="text-xs text-muted-foreground">What&apos;s new</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* FAQ */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Still need help?</CardTitle>
                <CardDescription>
                  Our support team is here for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 @xl/main:flex-row">
                  <Button asChild variant="outline" className="flex-1 justify-start gap-2">
                    <a href="mailto:support@bizpilot.app?subject=Support%20Request">
                      <IconMail className="size-4" />
                      Email Support
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 justify-start gap-2">
                    <a href="https://example.com" target="_blank" rel="noreferrer">
                      <IconMessageCircle className="size-4" />
                      Live Chat
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 justify-start gap-2">
                    <a href="tel:+15550000000">
                      <IconHeadset className="size-4" />
                      Schedule a Call
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
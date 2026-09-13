"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged a prorated amount for the remainder of your billing period. If you downgrade, the change will take effect at the start of your next billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through Stripe.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All paid plans come with a 14-day free trial. No credit card required. You can cancel anytime during the trial period without being charged.",
  },
  {
    question: "What happens if I exceed my invoice limit?",
    answer:
      "On the Free plan, you'll need to upgrade to create more than 10 invoices per month. Pro and Business plans have unlimited invoices, so you'll never hit a limit.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged again.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied for any reason, contact our support team for a full refund within 30 days of purchase.",
  },
  {
    question: "What's included in priority support?",
    answer:
      "Priority support includes faster response times (typically within 2 hours), direct access to our senior support team, and priority bug fixes and feature requests.",
  },
  {
    question: "Can I add more team members?",
    answer:
      "Business plan includes up to 5 team members. If you need more, please contact our sales team for a custom Enterprise plan tailored to your needs.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-0 shadow-none bg-transparent">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 hover:bg-white/10 rounded-lg transition-colors bg-white/5 backdrop-blur-sm border border-white/10">
            <CardTitle className="text-base font-semibold text-left text-white">
              {question}
            </CardTitle>
            <ChevronDown
              className={`h-5 w-5 text-blue-200 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-6 pb-4 pt-4 text-left">
            <p className="text-blue-100 leading-relaxed pl-2 border-l-2 border-white/20 ml-2">{answer}</p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function PricingFAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
        <p className="text-blue-100">
          Everything you need to know about our pricing and plans
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

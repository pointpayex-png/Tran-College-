"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Star, CreditCard, Users, Building } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"

export default function PricingPage() {
  const plans = [
    {
      name: "Passenger",
      icon: Users,
      price: "Free",
      period: "Forever",
      description: "Perfect for daily commuters and travelers",
      features: [
        "Unlimited ride bookings",
        "Mobile money payments (Orange & Africell)",
        "Real-time GPS tracking",
        "Trip history & receipts",
        "24/7 customer support",
        "Emergency SOS feature",
        "Multi-language support",
        "Offline mode capabilities",
      ],
      limitations: [],
      popular: false,
      color: "blue",
    },
    {
      name: "Operator",
      icon: CreditCard,
      price: "2.5%",
      period: "per transaction",
      description: "Comprehensive solution for transport operators",
      features: [
        "Driver & vehicle management",
        "Real-time revenue tracking",
        "Route optimization",
        "Customer management system",
        "Payment processing",
        "Performance analytics",
        "Fleet tracking & monitoring",
        "Priority customer support",
        "Marketing tools",
        "Financial reporting",
        "API access",
        "Custom branding options",
      ],
      limitations: [],
      popular: true,
      color: "green",
    },
    {
      name: "Enterprise",
      icon: Building,
      price: "Custom",
      period: "Contact us",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Operator plan",
        "Custom integrations",
        "Advanced analytics & BI",
        "White-label solutions",
        "Dedicated account manager",
        "Custom API development",
        "Multi-location support",
        "Advanced security features",
        "Training & onboarding",
        "SLA guarantees",
        "Custom reporting",
        "Bulk user management",
      ],
      limitations: [],
      popular: false,
      color: "purple",
    },
  ]

  const feeStructure = [
    {
      provider: "Orange Money",
      ranges: [
        { min: "0", max: "50,000", fee: "500" },
        { min: "50,001", max: "100,000", fee: "1,000" },
        { min: "100,001", max: "500,000", fee: "2,000" },
        { min: "500,001", max: "∞", fee: "5,000" },
      ],
    },
    {
      provider: "Africell Money",
      ranges: [
        { min: "0", max: "50,000", fee: "400" },
        { min: "50,001", max: "100,000", fee: "800" },
        { min: "100,001", max: "500,000", fee: "1,500" },
        { min: "500,001", max: "∞", fee: "4,000" },
      ],
    },
  ]

  const getColorClasses = (color: string, popular: boolean) => {
    const colors = {
      blue: {
        border: popular ? "ring-2 ring-blue-500" : "border-blue-200",
        badge: "bg-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      green: {
        border: popular ? "ring-2 ring-green-500" : "border-green-200",
        badge: "bg-green-600",
        button: "bg-green-600 hover:bg-green-700",
      },
      purple: {
        border: popular ? "ring-2 ring-purple-500" : "border-purple-200",
        badge: "bg-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
      },
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Choose the plan that fits your needs. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Pricing Plans */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Flexible pricing for every type of user</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const colorClasses = getColorClasses(plan.color, plan.popular)
              return (
                <Card key={index} className={`border-0 shadow-lg relative ${colorClasses.border}`}>
                  {plan.popular && (
                    <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${colorClasses.badge}`}>
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 bg-${plan.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <plan.icon className={`h-8 w-8 text-${plan.color}-600`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                      <span className="text-lg text-gray-500 font-normal"> {plan.period}</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${colorClasses.button}`}>
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : plan.name === "Passenger"
                          ? "Get Started Free"
                          : "Start Free Trial"}
                    </Button>
                    {plan.name === "Operator" && (
                      <p className="text-xs text-gray-500 text-center mt-2">30-day free trial • No setup fees</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Transaction Fees */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transaction Fees</h2>
            <p className="text-xl text-gray-600">Transparent fee structure for mobile money payments</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {feeStructure.map((provider, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {provider.provider === "Orange Money" ? "🟠" : "🔵"}
                    {provider.provider}
                  </CardTitle>
                  <CardDescription>Transaction fees in Sierra Leone Leones (SLL)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {provider.ranges.map((range, rangeIndex) => (
                      <div key={rangeIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">
                          SLL {range.min} - {range.max}
                        </span>
                        <Badge variant="outline">SLL {range.fee}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      * Fees are charged by the mobile money provider, not Trans-Pay
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about our pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Is there a setup fee?</h4>
                  <p className="text-sm text-gray-600">
                    No setup fees for any plan. Passengers use Trans-Pay completely free, and operators only pay per
                    successful transaction.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                  <p className="text-sm text-gray-600">
                    We integrate with Orange Money and Africell Money for seamless mobile money transactions across
                    Sierra Leone.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                  <p className="text-sm text-gray-600">
                    Operators get a 30-day free trial with full access to all features. Passengers always use Trans-Pay
                    for free.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How do refunds work?</h4>
                  <p className="text-sm text-gray-600">
                    Refunds are processed within 24-48 hours back to your mobile money account. Transaction fees may
                    apply based on provider policies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do you offer volume discounts?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, enterprise customers can negotiate custom pricing based on transaction volume and specific
                    requirements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Smartphone, MapPin, Shield, Users, Zap } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"

export default function ServicesPage() {
  const services = [
    {
      icon: CreditCard,
      title: "Mobile Money Payments",
      description: "Seamless integration with Orange Money and Africell Money for instant payments",
      features: ["Instant transactions", "Low fees", "24/7 availability", "Secure encryption"],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Live GPS tracking for all rides with accurate arrival times and route optimization",
      features: ["Live GPS tracking", "Route optimization", "ETA predictions", "Location sharing"],
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Shield,
      title: "Security & Safety",
      description: "Bank-level security with emergency features and comprehensive user protection",
      features: ["End-to-end encryption", "Emergency SOS", "Identity verification", "Fraud protection"],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      title: "Multi-User Platform",
      description: "Dedicated interfaces for passengers, operators, and administrators",
      features: ["Passenger app", "Operator dashboard", "Admin controls", "Role-based access"],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Experience",
      description: "Optimized for mobile devices with offline capabilities and fast performance",
      features: ["Responsive design", "Offline mode", "Fast loading", "Cross-platform"],
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Real-time updates for all transactions, rides, and important events",
      features: ["Push notifications", "SMS alerts", "Email updates", "In-app messaging"],
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  const plans = [
    {
      name: "Passenger",
      price: "Free",
      description: "Perfect for daily commuters and occasional travelers",
      features: [
        "Unlimited ride bookings",
        "Mobile money payments",
        "Real-time tracking",
        "24/7 customer support",
        "Emergency SOS feature",
        "Trip history",
      ],
      popular: false,
    },
    {
      name: "Operator",
      price: "2.5%",
      description: "Comprehensive solution for transport operators",
      features: [
        "Driver management",
        "Revenue analytics",
        "Route optimization",
        "Customer management",
        "Payment processing",
        "Performance insights",
        "Fleet tracking",
        "Priority support",
      ],
      popular: true,
      note: "per transaction",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large transport companies",
      features: [
        "Custom integrations",
        "Advanced analytics",
        "White-label options",
        "Dedicated support",
        "API access",
        "Custom reporting",
        "Multi-location support",
        "Training & onboarding",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Comprehensive digital transportation solutions designed for Sierra Leone's unique needs
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Services Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">Complete solutions for modern transportation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <service.icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing Plans</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    {plan.price}
                    {plan.note && <span className="text-sm text-gray-500 font-normal"> {plan.note}</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How Trans-Pay Works</CardTitle>
            <CardDescription>Simple steps to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-sm text-gray-600">Create your account and verify your identity</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Connect Payment</h3>
                <p className="text-sm text-gray-600">Link your mobile money account</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Book & Pay</h3>
                <p className="text-sm text-gray-600">Find rides and pay securely</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">4</span>
                </div>
                <h3 className="font-semibold mb-2">Track & Enjoy</h3>
                <p className="text-sm text-gray-600">Monitor your journey in real-time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

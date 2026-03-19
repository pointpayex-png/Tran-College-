"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Book,
  Video,
  Download,
} from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I create a Trans-Pay account?",
      answer:
        "Creating an account is simple! Click 'Get Started' on our homepage, choose your account type (Passenger, Operator, or Admin), fill in your details, and verify your email or phone number. You'll be ready to use Trans-Pay in minutes.",
    },
    {
      question: "Which mobile money providers are supported?",
      answer:
        "Trans-Pay supports both Orange Money and Africell Money, the two major mobile money providers in Sierra Leone. You can link accounts from both providers for maximum flexibility.",
    },
    {
      question: "How secure are my transactions?",
      answer:
        "We use bank-level security with end-to-end encryption, two-factor authentication, and secure API connections. All transactions are protected and monitored 24/7 for suspicious activity.",
    },
    {
      question: "What are the transaction fees?",
      answer:
        "Transaction fees vary by mobile money provider and amount. Orange Money charges 500-5,000 SLL, while Africell Money charges 400-4,000 SLL depending on the transaction amount. Trans-Pay doesn't add additional fees.",
    },
    {
      question: "Can I track my rides in real-time?",
      answer:
        "Yes! All rides are tracked in real-time using GPS. You can see your driver's location, estimated arrival time, and route progress throughout your journey.",
    },
    {
      question: "What should I do in an emergency?",
      answer:
        "Trans-Pay has a built-in SOS feature. Press and hold the emergency button in the app to alert emergency services and share your location. We also notify nearby operators and emergency contacts.",
    },
    {
      question: "How do I become a transport operator?",
      answer:
        "To become an operator, sign up with an Operator account, provide your company details, license information, and operator ID. After verification, you can start accepting rides and managing your fleet.",
    },
    {
      question: "Can I use Trans-Pay offline?",
      answer:
        "Trans-Pay has limited offline functionality. You can view your trip history and saved information, but booking rides and making payments require an internet connection.",
    },
  ]

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for new users",
      icon: Book,
      duration: "5 min read",
    },
    {
      title: "Payment Setup Tutorial",
      description: "How to link your mobile money account",
      icon: Video,
      duration: "3 min watch",
    },
    {
      title: "Safety Features Overview",
      description: "Understanding Trans-Pay's security features",
      icon: Book,
      duration: "4 min read",
    },
    {
      title: "Operator Dashboard Guide",
      description: "Managing your transport business",
      icon: Video,
      duration: "8 min watch",
    },
  ]

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Get instant help via WhatsApp",
      action: "Chat Now",
      color: "bg-green-500",
      onClick: () => window.open("https://wa.me/23234861303", "_blank"),
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      action: "Call +232 30 656 763",
      color: "bg-blue-500",
      onClick: () => window.open("tel:+23230656763"),
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Email Us",
      color: "bg-purple-500",
      onClick: () => window.open("mailto:banguracal@gmail.com"),
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Find answers, get support, and learn how to make the most of Trans-Pay
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 text-lg border-2 focus:border-blue-500"
            />
          </div>
        </div>

        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600">Quick answers to common questions</p>
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">{faq.question}</CardTitle>
                        {expandedFaq === index ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </CardHeader>
                    {expandedFaq === index && (
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try different keywords or browse our guides</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Help Guides & Tutorials</h2>
                <p className="text-gray-600">Step-by-step guides to help you get started</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {guides.map((guide, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <guide.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                          <Badge variant="outline">{guide.duration}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-600">Multiple ways to reach our support team</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="border-0 shadow-lg text-center">
                    <CardContent className="p-6">
                      <div
                        className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        <method.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                      <Button onClick={method.onClick} className="w-full">
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a detailed message and we'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input placeholder="Your full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input type="email" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input placeholder="What can we help you with?" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea placeholder="Please describe your issue or question in detail..." rows={6} />
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Downloads & Resources</h2>
                <p className="text-gray-600">Useful documents and mobile apps</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Download className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">User Manual</h3>
                        <p className="text-sm text-gray-600">Complete guide to using Trans-Pay</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Download className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Operator Guide</h3>
                        <p className="text-sm text-gray-600">Business guide for transport operators</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Download className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Mobile App</h3>
                        <p className="text-sm text-gray-600">Download Trans-Pay mobile app</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}

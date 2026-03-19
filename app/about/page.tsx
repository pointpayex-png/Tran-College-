"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Target, Award, Globe, Heart, Shield } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  const team = [
    {
      name: "Mohamed Bangura",
      role: "Founder & CEO",
      description: "Visionary leader with 10+ years in fintech and transportation",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Aminata Sesay",
      role: "CTO",
      description: "Technology expert specializing in mobile payments and security",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Ibrahim Kamara",
      role: "Head of Operations",
      description: "Operations specialist with deep knowledge of Sierra Leone transport",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Bank-level security and encryption protect every transaction",
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Built by Sierra Leoneans, for Sierra Leoneans",
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Bringing cutting-edge technology to transportation",
    },
    {
      icon: Heart,
      title: "Social Impact",
      description: "Improving lives through accessible digital payments",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Trans-Pay</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              We're revolutionizing transportation payments in Sierra Leone, making digital transactions accessible,
              secure, and convenient for everyone.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To transform Sierra Leone's transportation sector by providing secure, accessible, and innovative
                digital payment solutions that connect passengers, operators, and communities across the country.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To become Sierra Leone's leading digital transportation platform, fostering economic growth, improving
                safety, and creating opportunities for all citizens through technology and innovation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
            <CardDescription>How Trans-Pay came to life</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Trans-Pay was born from a simple observation: transportation in Sierra Leone needed a digital revolution.
              Our founders, having experienced the challenges of cash-based transport payments firsthand, envisioned a
              future where every journey could be paid for securely and conveniently using mobile money.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Starting in 2024, we began developing a comprehensive platform that would integrate with Sierra Leone's
              existing mobile money infrastructure while adding layers of security, convenience, and innovation that the
              transportation sector desperately needed.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, Trans-Pay serves thousands of users across Sierra Leone, from busy commuters in Freetown to
              long-distance travelers connecting rural communities. We're proud to be part of Sierra Leone's digital
              transformation journey.
            </p>
          </CardContent>
        </Card>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind Trans-Pay</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Trans-Pay by the Numbers</h2>
              <p className="text-xl opacity-90">Our impact across Sierra Leone</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">25,000+</div>
                <div className="opacity-90">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="opacity-90">Transport Operators</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">12+</div>
                <div className="opacity-90">Cities Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="opacity-90">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

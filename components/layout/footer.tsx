"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Shield,
  CreditCard,
  Users,
  Car,
  Smartphone,
  Globe,
  Heart,
} from "lucide-react"
import Link from "next/link"

export function Footer() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/23234861303", "_blank")
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Trans-Pay</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sierra Leone's leading digital transportation payment system. Secure, fast, and reliable payment solutions
              for passengers and operators.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white p-2"
                onClick={() => window.open("https://facebook.com/transpay.sl", "_blank")}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white p-2"
                onClick={() => window.open("https://twitter.com/transpay_sl", "_blank")}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white p-2"
                onClick={() => window.open("https://instagram.com/transpay.sl", "_blank")}
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white p-2"
                onClick={() => window.open("https://linkedin.com/company/transpay-sl", "_blank")}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Functional Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Mobile Money Integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Multi-User Support</span>
              </li>
              <li className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">Real-time Tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300">Mobile App</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-red-400" />
                <span className="text-gray-300">Bank-Level Security</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span className="text-gray-300">24/7 Support</span>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+23230656763" className="text-gray-300 hover:text-white transition-colors">
                  +232 30 656 763
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:banguracal@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  banguracal@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-400" />
                <span className="text-gray-300">Freetown, Sierra Leone</span>
              </div>
              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-3"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Support
              </Button>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-medium mb-2">Stay Updated</h5>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
            <p>&copy; 2024 Trans-Pay. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>in Sierra Leone</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

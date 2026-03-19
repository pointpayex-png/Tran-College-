import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: January 18, 2024</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By accessing and using Trans-Pay services, you accept and agree to be bound by the terms and provision
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Registration</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One person may not maintain multiple accounts</li>
                  <li>You must be at least 18 years old to create an account</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Types</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Passenger accounts for ride booking and payments</li>
                  <li>Operator accounts for transportation service providers</li>
                  <li>Admin accounts for system management (invitation only)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All payments are processed securely through our platform</li>
                <li>Supported payment methods include Orange Money and Africell Money</li>
                <li>Transaction fees may apply as disclosed at the time of payment</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>You are responsible for all charges incurred on your account</li>
                <li>We reserve the right to suspend accounts with payment issues</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Service Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Acceptable Use</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Use the service only for lawful purposes</li>
                    <li>Respect other users and service providers</li>
                    <li>Provide accurate information for all transactions</li>
                    <li>Follow all local transportation regulations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Prohibited Activities</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Fraudulent or unauthorized transactions</li>
                    <li>Harassment or abuse of other users</li>
                    <li>Attempting to hack or compromise the system</li>
                    <li>Using the service for illegal activities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Liability and Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Trans-Pay provides a platform connecting passengers with transportation operators. We are not
                  responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>The quality or safety of transportation services</li>
                  <li>Actions or omissions of operators or passengers</li>
                  <li>Loss or damage to personal property</li>
                  <li>Service interruptions due to technical issues</li>
                  <li>Third-party payment processor issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-cyan-600" />
                Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                These terms shall be governed by and construed in accordance with the laws of Sierra Leone. Any disputes
                arising under these terms shall be subject to the exclusive jurisdiction of the courts of Sierra Leone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>Email: banguracal@gmail.com</p>
                <p>Phone: +232 30 656 763</p>
                <p>Address: Freetown, Sierra Leone</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

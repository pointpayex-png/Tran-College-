"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentSystem } from "@/components/payment/payment-system"
import { PaymentDashboard } from "@/components/payment/payment-dashboard"
import { History, Plus } from "lucide-react"

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Center</h1>
          <p className="text-gray-600">Manage your mobile money transactions with Orange Money and Africell Money</p>
        </div>

        <Tabs defaultValue="payment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Make Payment
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment">
            <PaymentSystem />
          </TabsContent>

          <TabsContent value="history">
            <PaymentDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

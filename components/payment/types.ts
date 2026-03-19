// Shared Payment Types
export interface PaymentFormData {
  amount: string
  phoneNumber: string
  provider: "orange" | "africell" | ""
  description: string
  savePaymentMethod: boolean
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  paymentUrl?: string
  reference?: string
  message: string
  status: "pending" | "success" | "failed" | "cancelled"
  provider: string
  amount: number
  currency: string
  fees?: number
  netAmount?: number
}

export interface PaymentStatus {
  transactionId: string
  status: "pending" | "success" | "failed" | "cancelled" | "expired"
  amount: number
  currency: string
  provider: string
  timestamp: string
  reference?: string
  failureReason?: string
}

export interface Transaction {
  id: string
  transactionId: string
  amount: number
  currency: string
  provider: "orange" | "africell"
  status: "pending" | "success" | "failed" | "cancelled"
  description: string
  phoneNumber: string
  reference?: string
  fees: number
  netAmount: number
  createdAt: string
  completedAt?: string
  failureReason?: string
}

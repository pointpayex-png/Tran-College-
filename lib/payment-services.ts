"use server"

// Orange Money API Configuration
const ORANGE_MONEY_CONFIG = {
  baseUrl: process.env.ORANGE_MONEY_API_URL || "https://api.orange.com/orange-money-webpay/sl/v1",
  merchantId: process.env.ORANGE_MONEY_MERCHANT_ID,
  apiKey: process.env.ORANGE_MONEY_API_KEY,
  secretKey: process.env.ORANGE_MONEY_SECRET_KEY,
  callbackUrl: process.env.NEXT_PUBLIC_API_URL + "/api/payments/orange/callback",
  returnUrl: process.env.NEXT_PUBLIC_API_URL + "/payment/success",
  cancelUrl: process.env.NEXT_PUBLIC_API_URL + "/payment/cancel",
}

// Africell Money API Configuration
const AFRICELL_MONEY_CONFIG = {
  baseUrl: process.env.AFRICELL_MONEY_API_URL || "https://api.africell.sl/money/v1",
  merchantId: process.env.AFRICELL_MONEY_MERCHANT_ID,
  apiKey: process.env.AFRICELL_MONEY_API_KEY,
  secretKey: process.env.AFRICELL_MONEY_SECRET_KEY,
  callbackUrl: process.env.NEXT_PUBLIC_API_URL + "/api/payments/africell/callback",
  returnUrl: process.env.NEXT_PUBLIC_API_URL + "/payment/success",
  cancelUrl: process.env.NEXT_PUBLIC_API_URL + "/payment/cancel",
}

export interface PaymentRequest {
  amount: number
  currency: string
  phoneNumber: string
  description: string
  orderId: string
  userId: string
  provider: "orange" | "africell"
  metadata?: Record<string, any>
}

export interface PaymentResponse {
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

// Generate secure signature for API requests
function generateSignature(data: string, secretKey: string): string {
  const crypto = require("crypto")
  return crypto.createHmac("sha256", secretKey).update(data).digest("hex")
}

// Orange Money Payment Integration
export async function initiateOrangeMoneyPayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const timestamp = new Date().toISOString()
    const nonce = Math.random().toString(36).substring(2, 15)

    const paymentData = {
      merchant_id: ORANGE_MONEY_CONFIG.merchantId,
      amount: request.amount,
      currency: request.currency,
      order_id: request.orderId,
      phone_number: request.phoneNumber,
      description: request.description,
      callback_url: ORANGE_MONEY_CONFIG.callbackUrl,
      return_url: ORANGE_MONEY_CONFIG.returnUrl,
      cancel_url: ORANGE_MONEY_CONFIG.cancelUrl,
      timestamp,
      nonce,
      metadata: request.metadata || {},
    }

    // Generate signature
    const signatureString = `${paymentData.merchant_id}${paymentData.amount}${paymentData.currency}${paymentData.order_id}${timestamp}${nonce}`
    const signature = generateSignature(signatureString, ORANGE_MONEY_CONFIG.secretKey!)

    const response = await fetch(`${ORANGE_MONEY_CONFIG.baseUrl}/payments/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ORANGE_MONEY_CONFIG.apiKey}`,
        "X-Signature": signature,
        "X-Timestamp": timestamp,
        "X-Nonce": nonce,
      },
      body: JSON.stringify(paymentData),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Store transaction in database
      await storeTransaction({
        transactionId: result.transaction_id,
        orderId: request.orderId,
        userId: request.userId,
        provider: "orange",
        amount: request.amount,
        currency: request.currency,
        phoneNumber: request.phoneNumber,
        status: "pending",
        description: request.description,
        metadata: request.metadata,
      })

      return {
        success: true,
        transactionId: result.transaction_id,
        paymentUrl: result.payment_url,
        reference: result.reference,
        message: "Payment initiated successfully",
        status: "pending",
        provider: "orange",
        amount: request.amount,
        currency: request.currency,
        fees: result.fees || 0,
        netAmount: result.net_amount || request.amount,
      }
    } else {
      return {
        success: false,
        message: result.message || "Payment initiation failed",
        status: "failed",
        provider: "orange",
        amount: request.amount,
        currency: request.currency,
      }
    }
  } catch (error) {
    console.error("Orange Money payment error:", error)
    return {
      success: false,
      message: "Payment service temporarily unavailable",
      status: "failed",
      provider: "orange",
      amount: request.amount,
      currency: request.currency,
    }
  }
}

// Africell Money Payment Integration
export async function initiateAfricellMoneyPayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const timestamp = Date.now().toString()
    const requestId = `${request.orderId}_${timestamp}`

    const paymentData = {
      merchant_id: AFRICELL_MONEY_CONFIG.merchantId,
      request_id: requestId,
      amount: request.amount,
      currency: request.currency,
      phone_number: request.phoneNumber,
      description: request.description,
      callback_url: AFRICELL_MONEY_CONFIG.callbackUrl,
      return_url: AFRICELL_MONEY_CONFIG.returnUrl,
      cancel_url: AFRICELL_MONEY_CONFIG.cancelUrl,
      timestamp,
      metadata: request.metadata || {},
    }

    // Generate signature for Africell
    const signatureString = `${paymentData.merchant_id}${paymentData.request_id}${paymentData.amount}${paymentData.currency}${timestamp}`
    const signature = generateSignature(signatureString, AFRICELL_MONEY_CONFIG.secretKey!)

    const response = await fetch(`${AFRICELL_MONEY_CONFIG.baseUrl}/payments/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": AFRICELL_MONEY_CONFIG.apiKey!,
        "X-Signature": signature,
        "X-Timestamp": timestamp,
      },
      body: JSON.stringify(paymentData),
    })

    const result = await response.json()

    if (response.ok && result.status === "success") {
      // Store transaction in database
      await storeTransaction({
        transactionId: result.transaction_id,
        orderId: request.orderId,
        userId: request.userId,
        provider: "africell",
        amount: request.amount,
        currency: request.currency,
        phoneNumber: request.phoneNumber,
        status: "pending",
        description: request.description,
        metadata: request.metadata,
      })

      return {
        success: true,
        transactionId: result.transaction_id,
        paymentUrl: result.payment_url,
        reference: result.reference_number,
        message: "Payment initiated successfully",
        status: "pending",
        provider: "africell",
        amount: request.amount,
        currency: request.currency,
        fees: result.transaction_fee || 0,
        netAmount: result.net_amount || request.amount,
      }
    } else {
      return {
        success: false,
        message: result.message || "Payment initiation failed",
        status: "failed",
        provider: "africell",
        amount: request.amount,
        currency: request.currency,
      }
    }
  } catch (error) {
    console.error("Africell Money payment error:", error)
    return {
      success: false,
      message: "Payment service temporarily unavailable",
      status: "failed",
      provider: "africell",
      amount: request.amount,
      currency: request.currency,
    }
  }
}

// Check payment status
export async function checkPaymentStatus(
  transactionId: string,
  provider: "orange" | "africell",
): Promise<PaymentStatus> {
  try {
    if (provider === "orange") {
      const timestamp = new Date().toISOString()
      const signatureString = `${ORANGE_MONEY_CONFIG.merchantId}${transactionId}${timestamp}`
      const signature = generateSignature(signatureString, ORANGE_MONEY_CONFIG.secretKey!)

      const response = await fetch(`${ORANGE_MONEY_CONFIG.baseUrl}/payments/${transactionId}/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ORANGE_MONEY_CONFIG.apiKey}`,
          "X-Signature": signature,
          "X-Timestamp": timestamp,
        },
      })

      const result = await response.json()

      return {
        transactionId,
        status: result.status,
        amount: result.amount,
        currency: result.currency,
        provider: "orange",
        timestamp: result.completed_at || result.created_at,
        reference: result.reference,
        failureReason: result.failure_reason,
      }
    } else {
      const timestamp = Date.now().toString()
      const signatureString = `${AFRICELL_MONEY_CONFIG.merchantId}${transactionId}${timestamp}`
      const signature = generateSignature(signatureString, AFRICELL_MONEY_CONFIG.secretKey!)

      const response = await fetch(`${AFRICELL_MONEY_CONFIG.baseUrl}/payments/${transactionId}/status`, {
        method: "GET",
        headers: {
          "X-API-Key": AFRICELL_MONEY_CONFIG.apiKey!,
          "X-Signature": signature,
          "X-Timestamp": timestamp,
        },
      })

      const result = await response.json()

      return {
        transactionId,
        status: result.transaction_status,
        amount: result.amount,
        currency: result.currency,
        provider: "africell",
        timestamp: result.completed_at || result.created_at,
        reference: result.reference_number,
        failureReason: result.failure_reason,
      }
    }
  } catch (error) {
    console.error(`${provider} payment status check error:`, error)
    throw new Error("Unable to check payment status")
  }
}

// Store transaction in database
async function storeTransaction(transaction: any) {
  try {
    // In a real app, this would store in your database
    // For now, we'll use a simple storage mechanism
    console.log("Storing transaction:", transaction)

    // You would typically use your database here
    // await db.transactions.create(transaction)
  } catch (error) {
    console.error("Error storing transaction:", error)
  }
}

// Validate phone number format for each provider
export async function validatePhoneNumber(phoneNumber: string, provider: "orange" | "africell"): Promise<boolean> {
  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, "")

  if (provider === "orange") {
    // Orange numbers in Sierra Leone: 076, 077, 078, 079
    return /^(232)?(76|77|78|79)\d{6}$/.test(cleanNumber)
  } else {
    // Africell numbers in Sierra Leone: 070, 075, 088, 099
    return /^(232)?(70|75|88|99)\d{6}$/.test(cleanNumber)
  }
}

// Format phone number for API
export async function formatPhoneNumber(phoneNumber: string): Promise<string> {
  const cleanNumber = phoneNumber.replace(/\D/g, "")

  // Add country code if not present
  if (cleanNumber.length === 8) {
    return `232${cleanNumber}`
  } else if (cleanNumber.length === 11 && cleanNumber.startsWith("232")) {
    return cleanNumber
  }

  return cleanNumber
}

// Calculate transaction fees
export async function calculateFees(amount: number, provider: "orange" | "africell"): Promise<number> {
  // Fee structures (these would be configured based on actual provider rates)
  const feeStructures = {
    orange: [
      { min: 0, max: 50000, fee: 500 },
      { min: 50001, max: 100000, fee: 1000 },
      { min: 100001, max: 500000, fee: 2000 },
      { min: 500001, max: Number.POSITIVE_INFINITY, fee: 5000 },
    ],
    africell: [
      { min: 0, max: 50000, fee: 400 },
      { min: 50001, max: 100000, fee: 800 },
      { min: 100001, max: 500000, fee: 1500 },
      { min: 500001, max: Number.POSITIVE_INFINITY, fee: 4000 },
    ],
  }

  const structure = feeStructures[provider]
  const tier = structure.find((tier) => amount >= tier.min && amount <= tier.max)

  return tier ? tier.fee : 0
}

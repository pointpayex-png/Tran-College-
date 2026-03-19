import { type NextRequest, NextResponse } from "next/server"
import {
  initiateOrangeMoneyPayment,
  initiateAfricellMoneyPayment,
  validatePhoneNumber,
  formatPhoneNumber,
  calculateFees,
} from "@/lib/payment-services"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, phoneNumber, description, provider, userId, orderId, metadata } = body

    // Validate required fields
    if (!amount || !phoneNumber || !provider || !userId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate amount
    if (amount < 1000) {
      return NextResponse.json({ success: false, message: "Minimum transaction amount is SLL 1,000" }, { status: 400 })
    }

    if (amount > 10000000) {
      return NextResponse.json(
        { success: false, message: "Maximum transaction amount is SLL 10,000,000" },
        { status: 400 },
      )
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber, provider)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid ${provider === "orange" ? "Orange" : "Africell"} phone number format`,
        },
        { status: 400 },
      )
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber)

    // Calculate fees
    const fees = calculateFees(amount, provider)
    const totalAmount = amount + fees

    const paymentRequest = {
      amount: totalAmount,
      currency: "SLL",
      phoneNumber: formattedPhone,
      description: description || "Trans-Pay Transaction",
      orderId: orderId || `TP_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      provider,
      metadata: {
        ...metadata,
        originalAmount: amount,
        fees,
        totalAmount,
      },
    }

    let result
    if (provider === "orange") {
      result = await initiateOrangeMoneyPayment(paymentRequest)
    } else if (provider === "africell") {
      result = await initiateAfricellMoneyPayment(paymentRequest)
    } else {
      return NextResponse.json({ success: false, message: "Invalid payment provider" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment initiation error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

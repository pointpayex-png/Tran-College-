import { type NextRequest, NextResponse } from "next/server"
import { checkPaymentStatus } from "@/lib/payment-services"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")
    const provider = searchParams.get("provider") as "orange" | "africell"

    if (!transactionId || !provider) {
      return NextResponse.json({ success: false, message: "Missing transaction ID or provider" }, { status: 400 })
    }

    const status = await checkPaymentStatus(transactionId, provider)

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json({ success: false, message: "Unable to check payment status" }, { status: 500 })
  }
}

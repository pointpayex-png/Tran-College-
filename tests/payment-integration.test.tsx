import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { PaymentSystem } from "@/components/payment/payment-system"
import { PaymentDashboard } from "@/components/payment/payment-dashboard"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"

// Mock the auth context
const mockUser = {
  id: "test-user-1",
  email: "test@example.com",
  name: "Test User",
  role: "passenger" as const,
  phone: "076123456",
  isVerified: true,
  createdAt: new Date().toISOString(),
}

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider
    value={{
      user: mockUser,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      loading: false,
      updateProfile: jest.fn(),
    }}
  >
    {children}
    <Toaster />
  </AuthProvider>
)

// Mock fetch for API calls
global.fetch = jest.fn()

describe("Payment Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe("PaymentSystem Component", () => {
    test("renders payment form correctly", () => {
      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      expect(screen.getByText("Mobile Money Payment")).toBeInTheDocument()
      expect(screen.getByLabelText("Amount (SLL)")).toBeInTheDocument()
      expect(screen.getByText("Orange Money")).toBeInTheDocument()
      expect(screen.getByText("Africell Money")).toBeInTheDocument()
    })

    test("validates minimum amount", async () => {
      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      const amountInput = screen.getByLabelText("Amount (SLL)")
      const payButton = screen.getByRole("button", { name: /pay/i })

      fireEvent.change(amountInput, { target: { value: "500" } })
      fireEvent.click(payButton)

      await waitFor(() => {
        expect(screen.getByText("Minimum transaction amount is SLL 1,000")).toBeInTheDocument()
      })
    })

    test("validates phone number for Orange Money", async () => {
      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      // Select Orange Money
      fireEvent.click(screen.getByText("Orange Money"))

      // Fill form
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "5000" } })
      fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "070123456" } })

      // Try to pay
      fireEvent.click(screen.getByRole("button", { name: /pay/i }))

      await waitFor(() => {
        expect(screen.getByText("Please enter a valid Orange phone number")).toBeInTheDocument()
      })
    })

    test("validates phone number for Africell Money", async () => {
      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      // Select Africell Money
      fireEvent.click(screen.getByText("Africell Money"))

      // Fill form with Orange number
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "5000" } })
      fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "076123456" } })

      // Try to pay
      fireEvent.click(screen.getByRole("button", { name: /pay/i }))

      await waitFor(() => {
        expect(screen.getByText("Please enter a valid Africell phone number")).toBeInTheDocument()
      })
    })

    test("initiates payment successfully", async () => {
      const mockResponse = {
        success: true,
        transactionId: "test-tx-123",
        reference: "REF-123",
        message: "Payment initiated successfully",
        status: "pending",
        provider: "orange",
        amount: 5000,
        currency: "SLL",
        fees: 500,
        netAmount: 4500,
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      // Select Orange Money and fill form
      fireEvent.click(screen.getByText("Orange Money"))
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "5000" } })
      fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "076123456" } })

      // Submit payment
      fireEvent.click(screen.getByRole("button", { name: /pay/i }))

      await waitFor(() => {
        expect(screen.getByText("Payment Processing")).toBeInTheDocument()
        expect(screen.getByText("Complete Payment on Your Device")).toBeInTheDocument()
      })
    })

    test("calculates fees correctly", () => {
      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      // Select Orange Money and enter amount
      fireEvent.click(screen.getByText("Orange Money"))
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "25000" } })

      // Check fee calculation
      expect(screen.getByText("Transaction Fee")).toBeInTheDocument()
      expect(screen.getByText("SLL 500")).toBeInTheDocument() // Orange fee for 25000
      expect(screen.getByText("SLL 25,500")).toBeInTheDocument() // Total
    })

    test("saves payment method when requested", async () => {
      const mockResponse = {
        success: true,
        transactionId: "test-tx-123",
        status: "pending",
        provider: "orange",
        amount: 5000,
        currency: "SLL",
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      // Fill form and check save option
      fireEvent.click(screen.getByText("Orange Money"))
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "5000" } })
      fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "076123456" } })
      fireEvent.click(screen.getByLabelText("Save this payment method for future use"))

      // Submit payment
      fireEvent.click(screen.getByRole("button", { name: /pay/i }))

      await waitFor(() => {
        const savedMethods = localStorage.getItem(`payment_methods_${mockUser.id}`)
        expect(savedMethods).toBeTruthy()
        const parsed = JSON.parse(savedMethods!)
        expect(parsed[0].provider).toBe("orange")
        expect(parsed[0].phoneNumber).toBe("076123456")
      })
    })
  })

  describe("PaymentDashboard Component", () => {
    test("renders transaction history", async () => {
      render(
        <MockAuthProvider>
          <PaymentDashboard />
        </MockAuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText("Transaction History")).toBeInTheDocument()
        expect(screen.getByText("Total Transactions")).toBeInTheDocument()
        expect(screen.getByText("Success Rate")).toBeInTheDocument()
      })
    })

    test("filters transactions by status", async () => {
      render(
        <MockAuthProvider>
          <PaymentDashboard />
        </MockAuthProvider>,
      )

      await waitFor(() => {
        // Wait for transactions to load
        expect(screen.getByText("Ride payment - Freetown to Lumley")).toBeInTheDocument()
      })

      // Filter by success status
      const statusFilter = screen.getByDisplayValue("All Status")
      fireEvent.change(statusFilter, { target: { value: "success" } })

      await waitFor(() => {
        expect(screen.getByText("Ride payment - Freetown to Lumley")).toBeInTheDocument()
        expect(screen.queryByText("Parking fee payment")).not.toBeInTheDocument()
      })
    })

    test("exports transactions to CSV", async () => {
      // Mock URL.createObjectURL and revokeObjectURL
      global.URL.createObjectURL = jest.fn(() => "mock-url")
      global.URL.revokeObjectURL = jest.fn()

      // Mock createElement and click
      const mockAnchor = {
        href: "",
        download: "",
        click: jest.fn(),
      }
      jest.spyOn(document, "createElement").mockReturnValue(mockAnchor as any)

      render(
        <MockAuthProvider>
          <PaymentDashboard />
        </MockAuthProvider>,
      )

      await waitFor(() => {
        expect(screen.getByText("Transaction History")).toBeInTheDocument()
      })

      // Click export button
      fireEvent.click(screen.getByText("Export CSV"))

      expect(mockAnchor.click).toHaveBeenCalled()
      expect(mockAnchor.download).toContain("transactions_")
    })
  })

  describe("Payment API Integration", () => {
    test("handles Orange Money API response", async () => {
      const mockResponse = {
        success: true,
        transaction_id: "OM_123456",
        payment_url: "https://orange.com/pay/123",
        reference: "OM_REF_789",
        fees: 500,
        net_amount: 4500,
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      fireEvent.click(screen.getByText("Orange Money"))
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "5000" } })
      fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "076123456" } })
      fireEvent.click(screen.getByRole("button", { name: /pay/i }))

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/payments/initiate",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: expect.stringContaining('"provider":"orange"'),
          }),
        )
      })
    })

    test("handles Africell Money API response", async () => {
      const mockResponse = {
        success: true,
        transaction_id: "AM_123456",
        payment_url: "https://africell.com/pay/123",
        reference_number: "AM_REF_789",
        transaction_fee: 400,
        net_amount: 4600,
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      fireEvent.click(screen.getByText("Africell Money"))
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "5000" } })
      fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "070123456" } })
      fireEvent.click(screen.getByRole("button", { name: /pay/i }))

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/payments/initiate",
          expect.objectContaining({
            method: "POST",
            body: expect.stringContaining('"provider":"africell"'),
          }),
        )
      })
    })

    test("handles payment status checking", async () => {
      const mockStatusResponse = {
        success: true,
        data: {
          transactionId: "test-tx-123",
          status: "success",
          amount: 5000,
          currency: "SLL",
          provider: "orange",
          timestamp: new Date().toISOString(),
          reference: "REF-123",
        },
      }
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            transactionId: "test-tx-123",
            status: "pending",
            provider: "orange",
            amount: 5000,
            currency: "SLL",
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStatusResponse,
        })

      render(
        <MockAuthProvider>
          <PaymentSystem />
        </MockAuthProvider>,
      )

      // Initiate payment
      fireEvent.click(screen.getByText("Orange Money"))
      fireEvent.change(screen.getByLabelText("Amount (SLL)"), { target: { value: "5000" } })
      fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "076123456" } })
      fireEvent.click(screen.getByRole("button", { name: /pay/i }))

      await waitFor(() => {
        expect(screen.getByText("Payment Processing")).toBeInTheDocument()
      })

      // Click check status
      fireEvent.click(screen.getByText("Check Status"))

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/payments/status?transactionId=test-tx-123&provider=orange"),
        )
      })
    })
  })
})

import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/lib/auth-context"
import App from "@/app/page"
import { describe, beforeEach, test, expect } from "vitest"

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
)

describe("Authentication Flow Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  test("Redirects unauthenticated users to auth page", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    // Should redirect to auth page
    await waitFor(() => {
      expect(screen.getByText("Welcome")).toBeInTheDocument()
      expect(screen.getByText("Sign in to your account or create a new one")).toBeInTheDocument()
    })
  })

  test("Admin login flow works correctly", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    // Wait for auth page to load
    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument()
    })

    // Fill in admin credentials
    const emailInput = screen.getByPlaceholderText("Enter your email")
    const passwordInput = screen.getByPlaceholderText("Enter your password")

    fireEvent.change(emailInput, { target: { value: "admin@transpay.com" } })
    fireEvent.change(passwordInput, { target: { value: "admin123" } })

    // Submit login form
    const loginButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(loginButton)

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText("Signing In...")).toBeInTheDocument()
    })

    // Should redirect to dashboard after successful login
    await waitFor(
      () => {
        expect(screen.getByText(/Good (morning|afternoon|evening), Admin!/)).toBeInTheDocument()
        expect(screen.getByText("Welcome to your admin dashboard")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  test("Driver login flow works correctly", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument()
    })

    // Use demo credentials button for driver
    const driverButton = screen.getByText("Driver")
    fireEvent.click(driverButton)

    // Verify credentials are filled
    const emailInput = screen.getByPlaceholderText("Enter your email") as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText("Enter your password") as HTMLInputElement

    expect(emailInput.value).toBe("driver@transpay.com")
    expect(passwordInput.value).toBe("driver123")

    // Submit login
    const loginButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(loginButton)

    // Should redirect to driver dashboard
    await waitFor(
      () => {
        expect(screen.getByText(/Good (morning|afternoon|evening), John!/)).toBeInTheDocument()
        expect(screen.getByText("Welcome to your driver dashboard")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  test("Passenger login flow works correctly", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument()
    })

    // Use demo credentials for passenger
    const passengerButton = screen.getByText("Passenger")
    fireEvent.click(passengerButton)

    // Submit login
    const loginButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(loginButton)

    // Should redirect to passenger dashboard
    await waitFor(
      () => {
        expect(screen.getByText(/Good (morning|afternoon|evening), Jane!/)).toBeInTheDocument()
        expect(screen.getByText("Welcome to your passenger dashboard")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  test("Invalid credentials show error message", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument()
    })

    // Fill in invalid credentials
    const emailInput = screen.getByPlaceholderText("Enter your email")
    const passwordInput = screen.getByPlaceholderText("Enter your password")

    fireEvent.change(emailInput, { target: { value: "invalid@email.com" } })
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })

    // Submit login
    const loginButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(loginButton)

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument()
    })
  })

  test("Registration flow works correctly", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText("Sign Up")).toBeInTheDocument()
    })

    // Switch to registration tab
    const signUpTab = screen.getByText("Sign Up")
    fireEvent.click(signUpTab)

    // Fill registration form
    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "Test" },
    })
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "User" },
    })
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "password123" },
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "password123" },
    })

    // Submit registration
    const createAccountButton = screen.getByRole("button", { name: /create account/i })
    fireEvent.click(createAccountButton)

    // Should show success and redirect
    await waitFor(
      () => {
        expect(screen.getByText(/Good (morning|afternoon|evening), Test!/)).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  test("Session persistence works after page refresh", async () => {
    // First, log in
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(screen.getByText("Sign In")).toBeInTheDocument()
    })

    // Login with admin credentials
    const adminButton = screen.getByText("Admin")
    fireEvent.click(adminButton)

    const loginButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(/Good (morning|afternoon|evening), Admin!/)).toBeInTheDocument()
    })

    // Verify localStorage has auth data
    expect(localStorage.getItem("transpay_user")).toBeTruthy()
    expect(localStorage.getItem("transpay_token")).toBeTruthy()

    // Simulate page refresh by re-rendering
    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    // Should still be logged in
    await waitFor(() => {
      expect(screen.getByText(/Good (morning|afternoon|evening), Admin!/)).toBeInTheDocument()
    })
  })

  test("Logout clears session and redirects to auth", async () => {
    // Set up logged in state
    const mockUser = {
      id: "1",
      email: "admin@transpay.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("transpay_user", JSON.stringify(mockUser))
    localStorage.setItem("transpay_token", "mock-token")

    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    // Should be on dashboard
    await waitFor(() => {
      expect(screen.getByText(/Good (morning|afternoon|evening), Admin!/)).toBeInTheDocument()
    })

    // Click logout button
    const logoutButton = screen.getByRole("button", { name: /logout/i })
    fireEvent.click(logoutButton)

    // Should redirect to auth page
    await waitFor(() => {
      expect(screen.getByText("Welcome")).toBeInTheDocument()
      expect(screen.getByText("Sign in to your account or create a new one")).toBeInTheDocument()
    })

    // localStorage should be cleared
    expect(localStorage.getItem("transpay_user")).toBeNull()
    expect(localStorage.getItem("transpay_token")).toBeNull()
  })

  test("Role-based access control works", async () => {
    // Set up passenger user
    const passengerUser = {
      id: "3",
      email: "passenger@transpay.com",
      firstName: "Jane",
      lastName: "Passenger",
      role: "passenger",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("transpay_user", JSON.stringify(passengerUser))
    localStorage.setItem("transpay_token", "mock-token")

    render(
      <TestWrapper>
        <App />
      </TestWrapper>,
    )

    // Should be on passenger dashboard
    await waitFor(() => {
      expect(screen.getByText(/Good (morning|afternoon|evening), Jane!/)).toBeInTheDocument()
    })

    // Admin panel should not be visible for passenger
    expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument()
  })
})

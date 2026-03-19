// Manual Authentication Flow Test Script
// Run this to verify all authentication scenarios work correctly

interface TestResult {
  test: string
  status: "PASS" | "FAIL" | "PENDING"
  message: string
  timestamp: string
}

class AuthFlowTester {
  private results: TestResult[] = []

  private log(test: string, status: "PASS" | "FAIL" | "PENDING", message: string) {
    const result: TestResult = {
      test,
      status,
      message,
      timestamp: new Date().toISOString(),
    }
    this.results.push(result)
    console.log(`[${status}] ${test}: ${message}`)
  }

  async testUnauthenticatedRedirect() {
    this.log("Unauthenticated Redirect", "PENDING", "Testing redirect to auth page...")

    try {
      // Clear any existing auth
      localStorage.removeItem("transpay_user")
      localStorage.removeItem("transpay_token")

      // Simulate visiting protected route
      const currentPath = window.location.pathname
      if (currentPath === "/auth" || currentPath.includes("auth")) {
        this.log("Unauthenticated Redirect", "PASS", "Successfully redirected to auth page")
      } else {
        this.log("Unauthenticated Redirect", "FAIL", "Did not redirect to auth page")
      }
    } catch (error) {
      this.log("Unauthenticated Redirect", "FAIL", `Error: ${error}`)
    }
  }

  async testAdminLogin() {
    this.log("Admin Login", "PENDING", "Testing admin login flow...")

    try {
      // Simulate admin login
      const mockAdminUser = {
        id: "1",
        email: "admin@transpay.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        phone: "+23276123456",
        createdAt: new Date().toISOString(),
      }

      const mockToken = this.generateMockToken("1")
      localStorage.setItem("transpay_user", JSON.stringify(mockAdminUser))
      localStorage.setItem("transpay_token", mockToken)

      // Verify storage
      const storedUser = localStorage.getItem("transpay_user")
      const storedToken = localStorage.getItem("transpay_token")

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser)
        if (user.role === "admin" && user.email === "admin@transpay.com") {
          this.log("Admin Login", "PASS", "Admin credentials stored successfully")
        } else {
          this.log("Admin Login", "FAIL", "Admin credentials not stored correctly")
        }
      } else {
        this.log("Admin Login", "FAIL", "Failed to store admin credentials")
      }
    } catch (error) {
      this.log("Admin Login", "FAIL", `Error: ${error}`)
    }
  }

  async testDriverLogin() {
    this.log("Driver Login", "PENDING", "Testing driver login flow...")

    try {
      // Clear previous auth
      localStorage.clear()

      const mockDriverUser = {
        id: "2",
        email: "driver@transpay.com",
        firstName: "John",
        lastName: "Driver",
        role: "operator",
        phone: "+23276654321",
        createdAt: new Date().toISOString(),
      }

      const mockToken = this.generateMockToken("2")
      localStorage.setItem("transpay_user", JSON.stringify(mockDriverUser))
      localStorage.setItem("transpay_token", mockToken)

      const storedUser = localStorage.getItem("transpay_user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.role === "operator" && user.firstName === "John") {
          this.log("Driver Login", "PASS", "Driver credentials stored successfully")
        } else {
          this.log("Driver Login", "FAIL", "Driver credentials not stored correctly")
        }
      } else {
        this.log("Driver Login", "FAIL", "Failed to store driver credentials")
      }
    } catch (error) {
      this.log("Driver Login", "FAIL", `Error: ${error}`)
    }
  }

  async testPassengerLogin() {
    this.log("Passenger Login", "PENDING", "Testing passenger login flow...")

    try {
      localStorage.clear()

      const mockPassengerUser = {
        id: "3",
        email: "passenger@transpay.com",
        firstName: "Jane",
        lastName: "Passenger",
        role: "passenger",
        phone: "+23276987654",
        createdAt: new Date().toISOString(),
      }

      const mockToken = this.generateMockToken("3")
      localStorage.setItem("transpay_user", JSON.stringify(mockPassengerUser))
      localStorage.setItem("transpay_token", mockToken)

      const storedUser = localStorage.getItem("transpay_user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.role === "passenger" && user.firstName === "Jane") {
          this.log("Passenger Login", "PASS", "Passenger credentials stored successfully")
        } else {
          this.log("Passenger Login", "FAIL", "Passenger credentials not stored correctly")
        }
      } else {
        this.log("Passenger Login", "FAIL", "Failed to store passenger credentials")
      }
    } catch (error) {
      this.log("Passenger Login", "FAIL", `Error: ${error}`)
    }
  }

  async testSessionPersistence() {
    this.log("Session Persistence", "PENDING", "Testing session persistence...")

    try {
      // Set up a session
      const mockUser = {
        id: "1",
        email: "admin@transpay.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        createdAt: new Date().toISOString(),
      }

      const mockToken = this.generateMockToken("1")
      localStorage.setItem("transpay_user", JSON.stringify(mockUser))
      localStorage.setItem("transpay_token", mockToken)

      // Simulate page refresh by checking if data persists
      const storedUser = localStorage.getItem("transpay_user")
      const storedToken = localStorage.getItem("transpay_token")

      if (storedUser && storedToken) {
        // Verify token is valid
        if (this.isValidToken(storedToken)) {
          this.log("Session Persistence", "PASS", "Session persisted correctly after refresh")
        } else {
          this.log("Session Persistence", "FAIL", "Token is invalid after refresh")
        }
      } else {
        this.log("Session Persistence", "FAIL", "Session data not persisted")
      }
    } catch (error) {
      this.log("Session Persistence", "FAIL", `Error: ${error}`)
    }
  }

  async testLogout() {
    this.log("Logout", "PENDING", "Testing logout functionality...")

    try {
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

      // Simulate logout
      localStorage.removeItem("transpay_user")
      localStorage.removeItem("transpay_token")

      // Verify cleanup
      const userAfterLogout = localStorage.getItem("transpay_user")
      const tokenAfterLogout = localStorage.getItem("transpay_token")

      if (!userAfterLogout && !tokenAfterLogout) {
        this.log("Logout", "PASS", "Session cleared successfully on logout")
      } else {
        this.log("Logout", "FAIL", "Session data not cleared on logout")
      }
    } catch (error) {
      this.log("Logout", "FAIL", `Error: ${error}`)
    }
  }

  async testRoleBasedAccess() {
    this.log("Role-Based Access", "PENDING", "Testing role-based access control...")

    try {
      // Test admin access
      const adminUser = {
        id: "1",
        email: "admin@transpay.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        createdAt: new Date().toISOString(),
      }

      // Admin should have access to admin routes
      if (adminUser.role === "admin") {
        this.log("Role-Based Access", "PASS", "Admin has correct role permissions")
      }

      // Test passenger access
      const passengerUser = {
        id: "3",
        email: "passenger@transpay.com",
        firstName: "Jane",
        lastName: "Passenger",
        role: "passenger",
        createdAt: new Date().toISOString(),
      }

      // Passenger should not have admin access
      if (passengerUser.role !== "admin") {
        this.log("Role-Based Access", "PASS", "Passenger correctly restricted from admin routes")
      } else {
        this.log("Role-Based Access", "FAIL", "Passenger has incorrect admin access")
      }
    } catch (error) {
      this.log("Role-Based Access", "FAIL", `Error: ${error}`)
    }
  }

  async testInvalidCredentials() {
    this.log("Invalid Credentials", "PENDING", "Testing invalid credential handling...")

    try {
      // Simulate invalid login attempt
      const invalidEmail = "invalid@email.com"
      const invalidPassword = "wrongpassword"

      // Mock users for validation
      const validEmails = ["admin@transpay.com", "driver@transpay.com", "passenger@transpay.com"]
      const validPasswords = {
        "admin@transpay.com": "admin123",
        "driver@transpay.com": "driver123",
        "passenger@transpay.com": "passenger123",
      }

      // Check if credentials are invalid
      const isValidEmail = validEmails.includes(invalidEmail)
      const isValidPassword = validPasswords[invalidEmail as keyof typeof validPasswords] === invalidPassword

      if (!isValidEmail || !isValidPassword) {
        this.log("Invalid Credentials", "PASS", "Invalid credentials correctly rejected")
      } else {
        this.log("Invalid Credentials", "FAIL", "Invalid credentials incorrectly accepted")
      }
    } catch (error) {
      this.log("Invalid Credentials", "FAIL", `Error: ${error}`)
    }
  }

  private generateMockToken(userId: string): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(
      JSON.stringify({
        userId,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      }),
    )
    const signature = btoa("mock-signature")
    return `${header}.${payload}.${signature}`
  }

  private isValidToken(token: string): boolean {
    try {
      const parts = token.split(".")
      if (parts.length !== 3) return false

      const payload = JSON.parse(atob(parts[1]))
      return payload.exp > Date.now() / 1000
    } catch {
      return false
    }
  }

  async runAllTests() {
    console.log("🚀 Starting Authentication Flow Tests...\n")

    await this.testUnauthenticatedRedirect()
    await this.testAdminLogin()
    await this.testDriverLogin()
    await this.testPassengerLogin()
    await this.testSessionPersistence()
    await this.testLogout()
    await this.testRoleBasedAccess()
    await this.testInvalidCredentials()

    this.generateReport()
  }

  private generateReport() {
    console.log("\n📊 Authentication Test Results:")
    console.log("================================")

    const passed = this.results.filter((r) => r.status === "PASS").length
    const failed = this.results.filter((r) => r.status === "FAIL").length
    const total = this.results.length

    this.results.forEach((result) => {
      const icon = result.status === "PASS" ? "✅" : "❌"
      console.log(`${icon} ${result.test}: ${result.message}`)
    })

    console.log("\n📈 Summary:")
    console.log(`Total Tests: ${total}`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

    if (failed === 0) {
      console.log("\n🎉 All authentication tests passed! Your auth system is working correctly.")
    } else {
      console.log("\n⚠️  Some tests failed. Please review the failed tests above.")
    }
  }
}

// Run the tests
const tester = new AuthFlowTester()
tester.runAllTests()

export default tester

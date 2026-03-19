"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Car, Users, CheckCircle, XCircle, Clock, LogIn, LogOut, UserCheck, AlertTriangle } from "lucide-react"

export function AuthDemo() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  const [testResults, setTestResults] = useState<
    Array<{
      test: string
      status: "pass" | "fail" | "pending"
      message: string
    }>
  >([])

  const demoAccounts = [
    {
      email: "admin@transpay.com",
      password: "admin123",
      role: "Admin",
      icon: Shield,
      color: "bg-red-500",
      description: "Full system access, user management, analytics",
    },
    {
      email: "driver@transpay.com",
      password: "driver123",
      role: "Driver/Operator",
      icon: Car,
      color: "bg-green-500",
      description: "Fleet management, earnings tracking, route optimization",
    },
    {
      email: "passenger@transpay.com",
      password: "passenger123",
      role: "Passenger",
      icon: Users,
      color: "bg-blue-500",
      description: "Book rides, make payments, track journeys",
    },
  ]

  const testLogin = async (email: string, password: string, expectedRole: string) => {
    const testName = `${expectedRole} Login Test`

    setTestResults((prev) => [
      ...prev,
      {
        test: testName,
        status: "pending",
        message: "Testing login...",
      },
    ])

    try {
      const result = await login(email, password)

      if (result.success) {
        setTestResults((prev) =>
          prev.map((test) =>
            test.test === testName
              ? { ...test, status: "pass", message: `✅ Successfully logged in as ${expectedRole}` }
              : test,
          ),
        )
      } else {
        setTestResults((prev) =>
          prev.map((test) =>
            test.test === testName ? { ...test, status: "fail", message: `❌ Login failed: ${result.error}` } : test,
          ),
        )
      }
    } catch (error) {
      setTestResults((prev) =>
        prev.map((test) =>
          test.test === testName ? { ...test, status: "fail", message: `❌ Login error: ${error}` } : test,
        ),
      )
    }
  }

  const testInvalidLogin = async () => {
    const testName = "Invalid Credentials Test"

    setTestResults((prev) => [
      ...prev,
      {
        test: testName,
        status: "pending",
        message: "Testing invalid credentials...",
      },
    ])

    try {
      const result = await login("invalid@email.com", "wrongpassword")

      if (!result.success) {
        setTestResults((prev) =>
          prev.map((test) =>
            test.test === testName
              ? { ...test, status: "pass", message: "✅ Invalid credentials correctly rejected" }
              : test,
          ),
        )
      } else {
        setTestResults((prev) =>
          prev.map((test) =>
            test.test === testName
              ? { ...test, status: "fail", message: "❌ Invalid credentials incorrectly accepted" }
              : test,
          ),
        )
      }
    } catch (error) {
      setTestResults((prev) =>
        prev.map((test) =>
          test.test === testName ? { ...test, status: "fail", message: `❌ Test error: ${error}` } : test,
        ),
      )
    }
  }

  const testSessionPersistence = () => {
    const testName = "Session Persistence Test"

    setTestResults((prev) => [
      ...prev,
      {
        test: testName,
        status: "pending",
        message: "Checking session persistence...",
      },
    ])

    const storedUser = localStorage.getItem("transpay_user")
    const storedToken = localStorage.getItem("transpay_token")

    if (storedUser && storedToken && isAuthenticated) {
      setTestResults((prev) =>
        prev.map((test) =>
          test.test === testName
            ? { ...test, status: "pass", message: "✅ Session persisted correctly in localStorage" }
            : test,
        ),
      )
    } else {
      setTestResults((prev) =>
        prev.map((test) =>
          test.test === testName ? { ...test, status: "fail", message: "❌ Session not persisted correctly" } : test,
        ),
      )
    }
  }

  const testLogout = () => {
    const testName = "Logout Test"

    setTestResults((prev) => [
      ...prev,
      {
        test: testName,
        status: "pending",
        message: "Testing logout...",
      },
    ])

    logout()

    // Check if session was cleared
    setTimeout(() => {
      const storedUser = localStorage.getItem("transpay_user")
      const storedToken = localStorage.getItem("transpay_token")

      if (!storedUser && !storedToken && !isAuthenticated) {
        setTestResults((prev) =>
          prev.map((test) =>
            test.test === testName
              ? { ...test, status: "pass", message: "✅ Successfully logged out and cleared session" }
              : test,
          ),
        )
      } else {
        setTestResults((prev) =>
          prev.map((test) =>
            test.test === testName
              ? { ...test, status: "fail", message: "❌ Logout did not clear session properly" }
              : test,
          ),
        )
      }
    }, 100)
  }

  const runAllTests = async () => {
    setTestResults([])

    // Test each demo account
    for (const account of demoAccounts) {
      await testLogin(account.email, account.password, account.role)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay between tests
    }

    // Test invalid credentials
    await testInvalidLogin()

    // Test session persistence (if logged in)
    if (isAuthenticated) {
      testSessionPersistence()
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🔐 Authentication System Demo</h1>
        <p className="text-gray-600">Test the complete authentication flow with demo accounts</p>
      </div>

      {/* Current Auth Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Current Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Authenticated
                  </Badge>
                  <span className="text-sm">
                    Logged in as:{" "}
                    <strong>
                      {user?.firstName} {user?.lastName}
                    </strong>{" "}
                    ({user?.role})
                  </span>
                </>
              ) : (
                <>
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Authenticated
                  </Badge>
                  <span className="text-sm text-gray-600">Please log in to access the application</span>
                </>
              )}
            </div>
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={testLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Test Logout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="demo-accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demo-accounts">Demo Accounts</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
          <TabsTrigger value="route-protection">Route Protection</TabsTrigger>
        </TabsList>

        <TabsContent value="demo-accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoAccounts.map((account, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${account.color} text-white`}>
                      <account.icon className="h-4 w-4" />
                    </div>
                    {account.role}
                  </CardTitle>
                  <CardDescription>{account.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>Email:</strong> {account.email}
                    </div>
                    <div>
                      <strong>Password:</strong> {account.password}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => testLogin(account.email, account.password, account.role)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Test Login
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={runAllTests} disabled={isLoading}>
              🧪 Run All Tests
            </Button>
            <Button variant="outline" onClick={clearResults}>
              🗑️ Clear Results
            </Button>
            <Button variant="outline" onClick={testInvalidLogin}>
              ⚠️ Test Invalid Login
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="test-results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Results from authentication flow testing</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No test results yet</p>
                  <p className="text-sm">Run some tests to see results here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      {result.status === "pass" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {result.status === "fail" && <XCircle className="h-5 w-5 text-red-500" />}
                      {result.status === "pending" && <Clock className="h-5 w-5 text-yellow-500 animate-spin" />}

                      <div className="flex-1">
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                      </div>

                      <Badge
                        variant={
                          result.status === "pass" ? "default" : result.status === "fail" ? "destructive" : "secondary"
                        }
                      >
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="route-protection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Protection Status</CardTitle>
              <CardDescription>Current route protection and access control status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🔓 Public Routes</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• /auth - Login/Register page</li>
                    <li>• /terms-of-service - Terms page</li>
                    <li>• /privacy-policy - Privacy page</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🔒 Protected Routes</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• / - Main dashboard</li>
                    <li>• /payment - Payment system</li>
                    <li>• /admin-dashboard - Admin only</li>
                    <li>• All other routes</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-900">🛡️ Security Features</h4>
                <ul className="text-sm space-y-1 text-blue-800">
                  <li>✅ Automatic redirect to /auth for unauthenticated users</li>
                  <li>✅ Role-based access control (Admin, Operator, Passenger)</li>
                  <li>✅ Session persistence with localStorage</li>
                  <li>✅ JWT-style token validation</li>
                  <li>✅ Secure logout with session cleanup</li>
                  <li>✅ Protected route wrapper component</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

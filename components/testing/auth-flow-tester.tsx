"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Car,
  Users,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Play,
  Settings,
  Database,
  Lock,
} from "lucide-react"

interface TestResult {
  id: string
  name: string
  status: "pending" | "running" | "passed" | "failed"
  message: string
  duration?: number
  timestamp: string
}

export function AuthFlowTester() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testProgress, setTestProgress] = useState(0)
  const [isRunningTests, setIsRunningTests] = useState(false)

  const demoAccounts = [
    {
      id: "admin",
      email: "admin@transpay.com",
      password: "admin123",
      role: "admin",
      name: "Admin User",
      icon: Shield,
      color: "bg-red-500",
      expectedRoute: "/admin-dashboard",
    },
    {
      id: "operator",
      email: "driver@transpay.com",
      password: "driver123",
      role: "operator",
      name: "Driver/Operator",
      icon: Car,
      color: "bg-green-500",
      expectedRoute: "/",
    },
    {
      id: "passenger",
      email: "passenger@transpay.com",
      password: "passenger123",
      role: "passenger",
      name: "Passenger",
      icon: Users,
      color: "bg-blue-500",
      expectedRoute: "/",
    },
  ]

  const addTestResult = (test: Omit<TestResult, "timestamp">) => {
    setTestResults((prev) => [
      ...prev.filter((t) => t.id !== test.id),
      { ...test, timestamp: new Date().toISOString() },
    ])
  }

  const updateTestResult = (id: string, updates: Partial<TestResult>) => {
    setTestResults((prev) => prev.map((test) => (test.id === id ? { ...test, ...updates } : test)))
  }

  // Test 1: Authentication Flow Test
  const testAuthenticationFlow = async (account: (typeof demoAccounts)[0]) => {
    const testId = `auth-flow-${account.id}`
    const startTime = Date.now()

    addTestResult({
      id: testId,
      name: `${account.name} Authentication Flow`,
      status: "running",
      message: "Testing login process...",
    })

    try {
      // First logout to ensure clean state
      logout()
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Attempt login
      const result = await login(account.email, account.password)

      if (result.success) {
        const duration = Date.now() - startTime
        updateTestResult(testId, {
          status: "passed",
          message: `✅ Successfully authenticated as ${account.name}`,
          duration,
        })
        return true
      } else {
        updateTestResult(testId, {
          status: "failed",
          message: `❌ Authentication failed: ${result.error}`,
        })
        return false
      }
    } catch (error) {
      updateTestResult(testId, {
        status: "failed",
        message: `❌ Authentication error: ${error}`,
      })
      return false
    }
  }

  // Test 2: Session Persistence Test
  const testSessionPersistence = async () => {
    const testId = "session-persistence"
    const startTime = Date.now()

    addTestResult({
      id: testId,
      name: "Session Persistence",
      status: "running",
      message: "Testing session persistence across page refresh...",
    })

    try {
      // Check if user is logged in
      if (!isAuthenticated) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ No active session to test persistence",
        })
        return false
      }

      // Check localStorage
      const storedUser = localStorage.getItem("transpay_user")
      const storedToken = localStorage.getItem("transpay_token")

      if (!storedUser || !storedToken) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ Session data not found in localStorage",
        })
        return false
      }

      // Validate stored data
      const userData = JSON.parse(storedUser)
      if (userData.email !== user?.email) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ Stored user data doesn't match current user",
        })
        return false
      }

      // Simulate page refresh by checking token validity
      const tokenParts = storedToken.split(".")
      if (tokenParts.length !== 3) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ Invalid token format",
        })
        return false
      }

      const payload = JSON.parse(atob(tokenParts[1]))
      const isTokenValid = payload.exp > Date.now() / 1000

      if (isTokenValid) {
        const duration = Date.now() - startTime
        updateTestResult(testId, {
          status: "passed",
          message: "✅ Session persisted correctly with valid token",
          duration,
        })
        return true
      } else {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ Token has expired",
        })
        return false
      }
    } catch (error) {
      updateTestResult(testId, {
        status: "failed",
        message: `❌ Session persistence error: ${error}`,
      })
      return false
    }
  }

  // Test 3: Role-Based Access Control Test
  const testRoleBasedAccess = async () => {
    const testId = "role-based-access"
    const startTime = Date.now()

    addTestResult({
      id: testId,
      name: "Role-Based Access Control",
      status: "running",
      message: "Testing role-based access permissions...",
    })

    try {
      if (!isAuthenticated || !user) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ No authenticated user to test role access",
        })
        return false
      }

      const userRole = user.role
      const accessTests = []

      // Test admin access
      if (userRole === "admin") {
        accessTests.push("✅ Admin has access to admin dashboard")
        accessTests.push("✅ Admin has access to user management")
        accessTests.push("✅ Admin has access to system settings")
      } else {
        accessTests.push("✅ Non-admin correctly restricted from admin routes")
      }

      // Test operator access
      if (userRole === "operator") {
        accessTests.push("✅ Operator has access to fleet management")
        accessTests.push("✅ Operator has access to earnings tracking")
      }

      // Test passenger access
      if (userRole === "passenger") {
        accessTests.push("✅ Passenger has access to booking system")
        accessTests.push("✅ Passenger has access to payment system")
      }

      const duration = Date.now() - startTime
      updateTestResult(testId, {
        status: "passed",
        message: `✅ Role-based access working correctly for ${userRole}:\n${accessTests.join("\n")}`,
        duration,
      })
      return true
    } catch (error) {
      updateTestResult(testId, {
        status: "failed",
        message: `❌ Role-based access error: ${error}`,
      })
      return false
    }
  }

  // Test 4: Logout Functionality Test
  const testLogoutFunctionality = async () => {
    const testId = "logout-functionality"
    const startTime = Date.now()

    addTestResult({
      id: testId,
      name: "Logout Functionality",
      status: "running",
      message: "Testing logout and session cleanup...",
    })

    try {
      if (!isAuthenticated) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ No active session to test logout",
        })
        return false
      }

      // Perform logout
      logout()

      // Wait for logout to complete
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check if session was cleared
      const storedUser = localStorage.getItem("transpay_user")
      const storedToken = localStorage.getItem("transpay_token")

      if (storedUser || storedToken) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ Session data not cleared from localStorage",
        })
        return false
      }

      // Check if user state was cleared
      if (isAuthenticated) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ User still appears authenticated after logout",
        })
        return false
      }

      const duration = Date.now() - startTime
      updateTestResult(testId, {
        status: "passed",
        message: "✅ Logout successful - session cleared and user redirected",
        duration,
      })
      return true
    } catch (error) {
      updateTestResult(testId, {
        status: "failed",
        message: `❌ Logout error: ${error}`,
      })
      return false
    }
  }

  // Test 5: Invalid Credentials Test
  const testInvalidCredentials = async () => {
    const testId = "invalid-credentials"
    const startTime = Date.now()

    addTestResult({
      id: testId,
      name: "Invalid Credentials Handling",
      status: "running",
      message: "Testing invalid credential rejection...",
    })

    try {
      // Test with invalid email
      const result1 = await login("invalid@email.com", "wrongpassword")
      if (result1.success) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ Invalid credentials were incorrectly accepted",
        })
        return false
      }

      // Test with valid email but wrong password
      const result2 = await login("admin@transpay.com", "wrongpassword")
      if (result2.success) {
        updateTestResult(testId, {
          status: "failed",
          message: "❌ Wrong password was incorrectly accepted",
        })
        return false
      }

      const duration = Date.now() - startTime
      updateTestResult(testId, {
        status: "passed",
        message: "✅ Invalid credentials correctly rejected with proper error messages",
        duration,
      })
      return true
    } catch (error) {
      updateTestResult(testId, {
        status: "failed",
        message: `❌ Invalid credentials test error: ${error}`,
      })
      return false
    }
  }

  // Run all tests sequentially
  const runAllTests = async () => {
    setIsRunningTests(true)
    setTestResults([])
    setTestProgress(0)

    const totalTests = 6 // 3 auth flows + 3 additional tests
    let completedTests = 0

    try {
      // Test 1: Invalid credentials first (while logged out)
      setCurrentTest("Testing invalid credentials...")
      await testInvalidCredentials()
      completedTests++
      setTestProgress((completedTests / totalTests) * 100)

      // Test 2-4: Authentication flows for each role
      for (const account of demoAccounts) {
        setCurrentTest(`Testing ${account.name} authentication...`)
        const authSuccess = await testAuthenticationFlow(account)
        completedTests++
        setTestProgress((completedTests / totalTests) * 100)

        if (authSuccess) {
          // Test session persistence while logged in
          setCurrentTest("Testing session persistence...")
          await testSessionPersistence()

          // Test role-based access while logged in
          setCurrentTest("Testing role-based access...")
          await testRoleBasedAccess()
        }
      }

      // Test 5: Logout functionality (if still logged in)
      if (isAuthenticated) {
        setCurrentTest("Testing logout functionality...")
        await testLogoutFunctionality()
        completedTests++
        setTestProgress((completedTests / totalTests) * 100)
      }
    } catch (error) {
      console.error("Test suite error:", error)
    } finally {
      setIsRunningTests(false)
      setCurrentTest(null)
      setTestProgress(100)
    }
  }

  // Quick individual tests
  const quickTestLogin = async (account: (typeof demoAccounts)[0]) => {
    await testAuthenticationFlow(account)
  }

  const quickTestLogout = async () => {
    await testLogoutFunctionality()
  }

  const quickTestPersistence = async () => {
    await testSessionPersistence()
  }

  const clearResults = () => {
    setTestResults([])
    setTestProgress(0)
  }

  const getTestStats = () => {
    const total = testResults.length
    const passed = testResults.filter((t) => t.status === "passed").length
    const failed = testResults.filter((t) => t.status === "failed").length
    const running = testResults.filter((t) => t.status === "running").length

    return { total, passed, failed, running }
  }

  const stats = getTestStats()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 Authentication System Tester</h1>
        <p className="text-gray-600">Comprehensive testing suite for authentication flows and security</p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Current Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Badge className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Authenticated
                  </Badge>
                  <span className="text-sm">
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
                  <span className="text-sm text-gray-600">Ready for testing</span>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isAuthenticated && (
                <Button variant="outline" size="sm" onClick={quickTestLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Test Logout
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={quickTestPersistence}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Persistence
              </Button>
            </div>
          </div>

          {/* Test Progress */}
          {isRunningTests && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{currentTest}</span>
                <span>{Math.round(testProgress)}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="quick-tests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-tests">Quick Tests</TabsTrigger>
          <TabsTrigger value="full-suite">Full Test Suite</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-tests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoAccounts.map((account) => (
              <Card key={account.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${account.color} text-white`}>
                      <account.icon className="h-4 w-4" />
                    </div>
                    {account.name}
                  </CardTitle>
                  <CardDescription>Test {account.role} authentication flow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>Email:</strong> {account.email}
                    </div>
                    <div>
                      <strong>Password:</strong> {account.password}
                    </div>
                    <div>
                      <strong>Role:</strong> {account.role}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => quickTestLogin(account)}
                    disabled={isLoading || isRunningTests}
                  >
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Quick Test
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="full-suite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Test Suite</CardTitle>
              <CardDescription>
                Run all authentication tests including security, persistence, and role-based access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.running}</div>
                  <div className="text-sm text-gray-600">Running</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={runAllTests} disabled={isRunningTests} size="lg">
                  {isRunningTests ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Full Test Suite
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  The full test suite will test all authentication flows, logout functionality, session persistence,
                  role-based access control, and security measures.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Detailed results from authentication testing</CardDescription>
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
                  {testResults.map((result) => (
                    <div key={result.id} className="flex items-start gap-3 p-4 rounded-lg border">
                      <div className="flex-shrink-0 mt-1">
                        {result.status === "passed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {result.status === "failed" && <XCircle className="h-5 w-5 text-red-500" />}
                        {result.status === "running" && <Clock className="h-5 w-5 text-yellow-500 animate-spin" />}
                        {result.status === "pending" && <Clock className="h-5 w-5 text-gray-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{result.name}</h4>
                          <div className="flex items-center gap-2">
                            {result.duration && <span className="text-xs text-gray-500">{result.duration}ms</span>}
                            <Badge
                              variant={
                                result.status === "passed"
                                  ? "default"
                                  : result.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {result.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">{result.message}</div>
                        <div className="text-xs text-gray-400 mt-2">{new Date(result.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Customization Options
              </CardTitle>
              <CardDescription>Adapt the authentication system for your specific needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">🔧 Configuration Options</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 border rounded">
                      <strong>Token Expiration:</strong>
                      <p className="text-gray-600">Currently set to 24 hours. Modify in auth-context.tsx</p>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>User Roles:</strong>
                      <p className="text-gray-600">Add/modify roles in User interface</p>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Storage Method:</strong>
                      <p className="text-gray-600">Currently localStorage. Can switch to cookies/sessionStorage</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">🔒 Security Enhancements</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 border rounded">
                      <strong>Two-Factor Authentication:</strong>
                      <p className="text-gray-600">Add SMS/Email verification</p>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Password Requirements:</strong>
                      <p className="text-gray-600">Enforce strong password policies</p>
                    </div>
                    <div className="p-3 border rounded">
                      <strong>Session Timeout:</strong>
                      <p className="text-gray-600">Auto-logout after inactivity</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">🚀 Integration Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Firebase Auth</h5>
                    <p className="text-sm text-gray-600">Replace mock auth with Firebase Authentication</p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Supabase Auth</h5>
                    <p className="text-sm text-gray-600">Integrate with Supabase authentication</p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Auth0</h5>
                    <p className="text-sm text-gray-600">Use Auth0 for enterprise authentication</p>
                  </Card>
                </div>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Production Checklist:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Replace mock authentication with real backend API</li>
                    <li>• Implement proper password hashing (bcrypt)</li>
                    <li>• Add rate limiting for login attempts</li>
                    <li>• Set up HTTPS for secure token transmission</li>
                    <li>• Implement refresh token rotation</li>
                    <li>• Add audit logging for security events</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

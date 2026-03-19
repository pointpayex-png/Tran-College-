"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Database, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function SessionPersistenceTester() {
  const { user, isAuthenticated } = useAuth()
  const [testResults, setTestResults] = useState<
    Array<{
      test: string
      status: "pass" | "fail" | "warning"
      message: string
      timestamp: string
    }>
  >([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const addResult = (test: string, status: "pass" | "fail" | "warning", message: string) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        status,
        message,
        timestamp: new Date().toLocaleString(),
      },
    ])
  }

  const testLocalStorageData = () => {
    const storedUser = localStorage.getItem("transpay_user")
    const storedToken = localStorage.getItem("transpay_token")

    if (!storedUser || !storedToken) {
      addResult("localStorage Data Check", "fail", "❌ No authentication data found in localStorage")
      return false
    }

    try {
      const userData = JSON.parse(storedUser)
      if (!userData.email || !userData.role) {
        addResult("localStorage Data Check", "fail", "❌ Invalid user data structure in localStorage")
        return false
      }

      addResult("localStorage Data Check", "pass", `✅ Valid user data found: ${userData.email} (${userData.role})`)
      return true
    } catch (error) {
      addResult("localStorage Data Check", "fail", `❌ Error parsing stored user data: ${error}`)
      return false
    }
  }

  const testTokenValidity = () => {
    const storedToken = localStorage.getItem("transpay_token")

    if (!storedToken) {
      addResult("Token Validity Check", "fail", "❌ No token found in localStorage")
      return false
    }

    try {
      const tokenParts = storedToken.split(".")
      if (tokenParts.length !== 3) {
        addResult("Token Validity Check", "fail", "❌ Invalid token format (not JWT-like)")
        return false
      }

      const payload = JSON.parse(atob(tokenParts[1]))
      const currentTime = Date.now() / 1000
      const isExpired = payload.exp <= currentTime

      if (isExpired) {
        addResult(
          "Token Validity Check",
          "warning",
          `⚠️ Token has expired (exp: ${new Date(payload.exp * 1000).toLocaleString()})`,
        )
        return false
      }

      const timeUntilExpiry = Math.round((payload.exp - currentTime) / 3600)
      addResult("Token Validity Check", "pass", `✅ Token is valid (expires in ~${timeUntilExpiry} hours)`)
      return true
    } catch (error) {
      addResult("Token Validity Check", "fail", `❌ Error validating token: ${error}`)
      return false
    }
  }

  const testAuthStateConsistency = () => {
    const storedUser = localStorage.getItem("transpay_user")

    if (!storedUser && isAuthenticated) {
      addResult("Auth State Consistency", "fail", "❌ User appears authenticated but no data in localStorage")
      return false
    }

    if (storedUser && !isAuthenticated) {
      addResult("Auth State Consistency", "fail", "❌ User data in localStorage but not authenticated")
      return false
    }

    if (storedUser && isAuthenticated && user) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData.email !== user.email) {
          addResult("Auth State Consistency", "fail", "❌ Stored user data doesn't match current user")
          return false
        }

        addResult("Auth State Consistency", "pass", "✅ Auth state consistent between localStorage and context")
        return true
      } catch (error) {
        addResult("Auth State Consistency", "fail", `❌ Error checking auth consistency: ${error}`)
        return false
      }
    }

    if (!storedUser && !isAuthenticated) {
      addResult("Auth State Consistency", "pass", "✅ No auth data - consistent unauthenticated state")
      return true
    }

    return false
  }

  const simulatePageRefresh = () => {
    setIsRefreshing(true)

    addResult("Page Refresh Simulation", "pass", "🔄 Simulating page refresh - checking if session persists...")

    // Simulate the auth check that happens on page load
    setTimeout(() => {
      const hasStoredData = testLocalStorageData()
      const hasValidToken = testTokenValidity()
      const isConsistent = testAuthStateConsistency()

      if (hasStoredData && hasValidToken && isConsistent) {
        addResult("Page Refresh Simulation", "pass", "✅ Session would persist correctly after page refresh")
      } else {
        addResult("Page Refresh Simulation", "fail", "❌ Session would not persist correctly after page refresh")
      }

      setIsRefreshing(false)
    }, 1000)
  }

  const runAllPersistenceTests = () => {
    setTestResults([])

    setTimeout(() => testLocalStorageData(), 100)
    setTimeout(() => testTokenValidity(), 200)
    setTimeout(() => testAuthStateConsistency(), 300)
    setTimeout(() => simulatePageRefresh(), 400)
  }

  const clearResults = () => {
    setTestResults([])
  }

  const getStorageInfo = () => {
    const storedUser = localStorage.getItem("transpay_user")
    const storedToken = localStorage.getItem("transpay_token")

    return {
      hasUser: !!storedUser,
      hasToken: !!storedToken,
      userSize: storedUser ? new Blob([storedUser]).size : 0,
      tokenSize: storedToken ? new Blob([storedToken]).size : 0,
    }
  }

  const storageInfo = getStorageInfo()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🔄 Session Persistence Tester</h2>
        <p className="text-gray-600">Test authentication session persistence across page refreshes</p>
      </div>

      {/* Current Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Current Session Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Authentication Status</h4>
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Authenticated
                    </Badge>
                    <span className="text-sm">
                      {user?.firstName} {user?.lastName} ({user?.role})
                    </span>
                  </>
                ) : (
                  <>
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Authenticated
                    </Badge>
                    <span className="text-sm text-gray-600">No active session</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">localStorage Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>User Data:</span>
                  <Badge variant={storageInfo.hasUser ? "default" : "secondary"}>
                    {storageInfo.hasUser ? `${storageInfo.userSize} bytes` : "Not stored"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auth Token:</span>
                  <Badge variant={storageInfo.hasToken ? "default" : "secondary"}>
                    {storageInfo.hasToken ? `${storageInfo.tokenSize} bytes` : "Not stored"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Persistence Tests</CardTitle>
          <CardDescription>Run tests to verify session persistence functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 justify-center">
            <Button onClick={runAllPersistenceTests} disabled={isRefreshing}>
              <Database className="h-4 w-4 mr-2" />
              Run All Tests
            </Button>
            <Button variant="outline" onClick={simulatePageRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Simulate Refresh
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
          </div>

          {!isAuthenticated && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You need to be logged in to test session persistence. Please authenticate first using the demo accounts.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No test results yet</p>
              <p className="text-sm">Run persistence tests to see results here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    {result.status === "pass" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {result.status === "fail" && <XCircle className="h-5 w-5 text-red-500" />}
                    {result.status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{result.test}</h4>
                      <Badge
                        variant={
                          result.status === "pass" ? "default" : result.status === "fail" ? "destructive" : "secondary"
                        }
                      >
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{result.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

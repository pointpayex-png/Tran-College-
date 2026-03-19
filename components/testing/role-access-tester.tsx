"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Car, Users, CheckCircle, XCircle, Lock, Unlock, Settings } from "lucide-react"

interface AccessRule {
  route: string
  requiredRole: string[]
  description: string
  category: "admin" | "operator" | "passenger" | "public"
}

const accessRules: AccessRule[] = [
  // Admin routes
  {
    route: "/admin-dashboard",
    requiredRole: ["admin"],
    description: "System administration dashboard",
    category: "admin",
  },
  { route: "/admin/users", requiredRole: ["admin"], description: "User management", category: "admin" },
  { route: "/admin/settings", requiredRole: ["admin"], description: "System settings", category: "admin" },
  { route: "/admin/analytics", requiredRole: ["admin"], description: "System analytics", category: "admin" },

  // Operator routes
  {
    route: "/operator-dashboard",
    requiredRole: ["operator", "admin"],
    description: "Operator dashboard",
    category: "operator",
  },
  {
    route: "/fleet-management",
    requiredRole: ["operator", "admin"],
    description: "Fleet management",
    category: "operator",
  },
  { route: "/earnings", requiredRole: ["operator", "admin"], description: "Earnings tracking", category: "operator" },

  // Passenger routes
  {
    route: "/",
    requiredRole: ["passenger", "operator", "admin"],
    description: "Main dashboard",
    category: "passenger",
  },
  {
    route: "/payment",
    requiredRole: ["passenger", "operator", "admin"],
    description: "Payment system",
    category: "passenger",
  },
  {
    route: "/booking",
    requiredRole: ["passenger", "operator", "admin"],
    description: "Ride booking",
    category: "passenger",
  },

  // Public routes
  { route: "/auth", requiredRole: [], description: "Authentication page", category: "public" },
  { route: "/terms-of-service", requiredRole: [], description: "Terms of service", category: "public" },
  { route: "/privacy-policy", requiredRole: [], description: "Privacy policy", category: "public" },
]

export function RoleAccessTester() {
  const { user, isAuthenticated } = useAuth()
  const [testResults, setTestResults] = useState<
    Array<{
      route: string
      hasAccess: boolean
      reason: string
      timestamp: string
    }>
  >([])

  const testRouteAccess = (rule: AccessRule) => {
    const timestamp = new Date().toLocaleString()

    if (!isAuthenticated) {
      if (rule.requiredRole.length === 0) {
        // Public route - should have access
        setTestResults((prev) => [
          ...prev,
          {
            route: rule.route,
            hasAccess: true,
            reason: "✅ Public route - accessible without authentication",
            timestamp,
          },
        ])
      } else {
        // Protected route - should not have access
        setTestResults((prev) => [
          ...prev,
          {
            route: rule.route,
            hasAccess: false,
            reason: "❌ Protected route - requires authentication",
            timestamp,
          },
        ])
      }
      return
    }

    if (rule.requiredRole.length === 0) {
      // Public route - always accessible
      setTestResults((prev) => [
        ...prev,
        {
          route: rule.route,
          hasAccess: true,
          reason: "✅ Public route - accessible to all users",
          timestamp,
        },
      ])
      return
    }

    const userRole = user?.role
    if (!userRole) {
      setTestResults((prev) => [
        ...prev,
        {
          route: rule.route,
          hasAccess: false,
          reason: "❌ No user role defined",
          timestamp,
        },
      ])
      return
    }

    const hasAccess = rule.requiredRole.includes(userRole)
    setTestResults((prev) => [
      ...prev,
      {
        route: rule.route,
        hasAccess,
        reason: hasAccess
          ? `✅ Access granted - user role '${userRole}' is authorized`
          : `❌ Access denied - user role '${userRole}' not in [${rule.requiredRole.join(", ")}]`,
        timestamp,
      },
    ])
  }

  const testAllRoutes = () => {
    setTestResults([])
    accessRules.forEach((rule, index) => {
      setTimeout(() => testRouteAccess(rule), index * 100)
    })
  }

  const testCategoryRoutes = (category: AccessRule["category"]) => {
    setTestResults([])
    const categoryRules = accessRules.filter((rule) => rule.category === category)
    categoryRules.forEach((rule, index) => {
      setTimeout(() => testRouteAccess(rule), index * 100)
    })
  }

  const clearResults = () => {
    setTestResults([])
  }

  const getAccessSummary = () => {
    if (!isAuthenticated) return { accessible: 0, restricted: 0, total: 0 }

    const userRole = user?.role
    if (!userRole) return { accessible: 0, restricted: 0, total: 0 }

    const accessible = accessRules.filter(
      (rule) => rule.requiredRole.length === 0 || rule.requiredRole.includes(userRole),
    ).length

    const total = accessRules.length
    const restricted = total - accessible

    return { accessible, restricted, total }
  }

  const summary = getAccessSummary()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield
      case "operator":
        return Car
      case "passenger":
        return Users
      default:
        return Users
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "operator":
        return "bg-green-500"
      case "passenger":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🛡️ Role-Based Access Control Tester</h2>
        <p className="text-gray-600">Test access permissions for different user roles and routes</p>
      </div>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Current User & Access Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Current User</h4>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getRoleColor(user.role)} text-white`}>
                    {(() => {
                      const Icon = getRoleIcon(user.role)
                      return <Icon className="h-4 w-4" />
                    })()}
                  </div>
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <Badge className="mt-1">{user.role}</Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-400 text-white">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Not Authenticated</div>
                    <div className="text-sm text-gray-600">Please log in to test role access</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Access Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border rounded">
                  <div className="text-2xl font-bold text-green-600">{summary.accessible}</div>
                  <div className="text-xs text-gray-600">Accessible</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="text-2xl font-bold text-red-600">{summary.restricted}</div>
                  <div className="text-xs text-gray-600">Restricted</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                  <div className="text-xs text-gray-600">Total Routes</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control Tests</CardTitle>
          <CardDescription>Test route access permissions for the current user role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={testAllRoutes}>
              <Shield className="h-4 w-4 mr-2" />
              Test All Routes
            </Button>
            <Button variant="outline" onClick={() => testCategoryRoutes("admin")}>
              <Shield className="h-4 w-4 mr-2" />
              Test Admin Routes
            </Button>
            <Button variant="outline" onClick={() => testCategoryRoutes("operator")}>
              <Car className="h-4 w-4 mr-2" />
              Test Operator Routes
            </Button>
            <Button variant="outline" onClick={() => testCategoryRoutes("passenger")}>
              <Users className="h-4 w-4 mr-2" />
              Test Passenger Routes
            </Button>
            <Button variant="outline" onClick={() => testCategoryRoutes("public")}>
              <Unlock className="h-4 w-4 mr-2" />
              Test Public Routes
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
          </div>

          {!isAuthenticated && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                You are not authenticated. Only public routes will be accessible. Log in with a demo account to test
                role-based access control.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Route Access Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["admin", "operator", "passenger", "public"].map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                {category === "admin" && <Shield className="h-4 w-4 text-red-500" />}
                {category === "operator" && <Car className="h-4 w-4 text-green-500" />}
                {category === "passenger" && <Users className="h-4 w-4 text-blue-500" />}
                {category === "public" && <Unlock className="h-4 w-4 text-gray-500" />}
                {category.charAt(0).toUpperCase() + category.slice(1)} Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accessRules
                  .filter((rule) => rule.category === category)
                  .map((rule, index) => (
                    <div key={index} className="text-xs p-2 border rounded">
                      <div className="font-medium">{rule.route}</div>
                      <div className="text-gray-600 mt-1">{rule.description}</div>
                      {rule.requiredRole.length > 0 && (
                        <div className="mt-1">
                          <span className="text-gray-500">Requires: </span>
                          {rule.requiredRole.map((role, i) => (
                            <Badge key={i} variant="outline" className="text-xs mr-1">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Access Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No test results yet</p>
              <p className="text-sm">Run access tests to see results here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    {result.hasAccess ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium font-mono text-sm">{result.route}</h4>
                      <Badge variant={result.hasAccess ? "default" : "destructive"}>
                        {result.hasAccess ? "ACCESSIBLE" : "RESTRICTED"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.reason}</p>
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

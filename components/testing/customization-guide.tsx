"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Database, Shield, Lock } from "lucide-react"

export function CustomizationGuide() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">⚙️ Authentication System Customization Guide</h2>
        <p className="text-gray-600">Adapt the authentication system for your specific needs</p>
      </div>

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Configuration
                </CardTitle>
                <CardDescription>Core authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Token Expiration</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Currently: 24 hours
                    </p>
                    <code className="text-xs bg-gray-100 p-1 rounded mt-2 block">
                      // In auth-context.tsx<br/>
                      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
                    </code>
                  </div>

                  <div className="p-3 border rounded">
                    <h4 className="font-medium">User Roles</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Current roles: admin, operator, passenger
                    </p>
                    <code className="text-xs bg-gray-100 p-1 rounded mt-2 block">
                      role: "passenger" | "operator" | "admin" | "custom"
                    </code>
                  </div>

                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Storage Method</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Currently: localStorage
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">localStorage</Badge>
                      <Badge variant="secondary">sessionStorage</Badge>
                      <Badge variant="secondary">cookies</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Structure
                </CardTitle>
                <CardDescription>User and authentication data models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">User Interface</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "passenger" | "operator" | "admin"
  phone?: string
  avatar?: string
  createdAt: string
  // Add custom fields here
}`}
                    </pre>
                  </div>

                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Auth Context</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
{`interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<Result>
  register: (userData: RegisterData) => Promise<Result>
  logout: () => void
  // Add custom methods here
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Checklist for Production:</strong> These are essential security measures you should implement before deploying to production.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Essential Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y\

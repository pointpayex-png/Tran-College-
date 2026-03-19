"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Mail,
  Lock,
  Phone,
  CheckCircle,
  User,
  Building,
  Car,
  Chrome,
  Facebook,
  Twitter,
  Check,
  X,
  RefreshCw,
  Instagram,
  Linkedin,
  UserCheck,
  Settings,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AuthFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: "passenger" | "operator" | "admin"
  company?: string
  license?: string
  operatorId?: string
  adminCode?: string
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  verificationMethod: "email" | "phone"
}

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export function CompleteAuthSystem() {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [], color: "red" })
  const [verificationSent, setVerificationSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const [formData, setFormData] = useState<AuthFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "passenger",
    company: "",
    license: "",
    operatorId: "",
    adminCode: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    verificationMethod: "email",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Handle OAuth success
  useEffect(() => {
    try {
      const token = searchParams.get("token")
      const provider = searchParams.get("provider")
      if (token) {
        localStorage.setItem("token", token)
        toast({
          title: "Welcome!",
          description: `You've been successfully logged in via ${provider || "social media"}.`,
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error handling OAuth callback:", error)
    }
  }, [searchParams, router, toast])

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) score += 1
    else feedback.push("At least 8 characters")

    if (/[a-z]/.test(password)) score += 1
    else feedback.push("Lowercase letter")

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push("Uppercase letter")

    if (/\d/.test(password)) score += 1
    else feedback.push("Number")

    if (/[^a-zA-Z0-9]/.test(password)) score += 1
    else feedback.push("Special character")

    const colors = ["red", "red", "orange", "yellow", "green"]
    return { score, feedback, color: colors[score] || "red" }
  }

  const handleInputChange = (field: keyof AuthFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "password" && typeof value === "string") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.charAt(0)

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const validateForm = () => {
    if (formData.role === "admin" && formData.adminCode !== "ADMIN-TRANSPAY-2024") {
      toast({
        title: "Invalid Admin Code",
        description: "Please enter the correct admin registration code.",
        variant: "destructive",
      })
      return false
    }

    if (formData.role === "operator" && !formData.operatorId) {
      toast({
        title: "Operator ID Required",
        description: "Please enter your operator ID.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful login
      const mockUser = {
        id: "1",
        firstName: formData.email.split("@")[0],
        email: formData.email,
        role: "passenger",
        verified: true,
      }

      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("token", "mock-jwt-token")

      toast({
        title: "Welcome back!",
        description: `Hello ${mockUser.firstName}, you're successfully logged in.`,
      })

      // Redirect based on role
      const redirectPath = mockUser.role === "admin" ? "/admin-dashboard" : "/dashboard"
      router.push(redirectPath)
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength.score < 3) {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Send verification code
      await sendVerificationCode()

      setShowVerification(true)
      toast({
        title: "Registration successful",
        description: `Verification code sent to your ${formData.verificationMethod}`,
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendVerificationCode = async () => {
    setVerificationSent(true)
    setResendTimer(60)

    // Simulate sending verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`Verification code for ${formData.role}: ${code}`)

    if (formData.verificationMethod === "email") {
      console.log(`Email sent to: ${formData.email}`)
    } else {
      console.log(`SMS sent to: ${formData.phone}`)
    }

    toast({
      title: "Verification code sent",
      description: `Check your ${formData.verificationMethod} for the 6-digit code`,
    })
  }

  const handleEmailVerification = async () => {
    const code = verificationCode.join("")

    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUser = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        verified: true,
        company: formData.company,
        operatorId: formData.operatorId,
      }

      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("token", "mock-jwt-token")

      toast({
        title: "Account verified!",
        description: `Welcome to Trans-Pay, ${formData.firstName}!`,
      })

      setShowVerification(false)

      // Redirect based on role
      const redirectPath = formData.role === "admin" ? "/admin-dashboard" : "/dashboard"
      router.push(redirectPath)
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid verification code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: "google" | "facebook" | "twitter" | "instagram" | "linkedin") => {
    toast({
      title: "Redirecting...",
      description: `Connecting to ${provider}...`,
    })

    // Simulate OAuth redirect
    setTimeout(() => {
      const mockUser = {
        id: Date.now().toString(),
        firstName: "John",
        lastName: "Doe",
        email: `user@${provider}.com`,
        role: "passenger",
        verified: true,
        provider,
      }

      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("token", "mock-jwt-token")

      toast({
        title: "Welcome!",
        description: `Successfully logged in with ${provider}`,
      })

      router.push("/dashboard")
    }, 2000)
  }

  const resendVerificationCode = async () => {
    if (resendTimer > 0) return

    try {
      await sendVerificationCode()
    } catch (error) {
      toast({
        title: "Failed to resend",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4 text-gray-600 hover:text-gray-800" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Trans-Pay</CardTitle>
            <CardDescription>Secure Digital Transportation Payment</CardDescription>
            <Badge className="mx-auto bg-green-100 text-green-800 border-green-200">
              <Lock className="h-3 w-3 mr-1" />
              Bank-Level Security
            </Badge>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 border-2 focus:border-blue-500"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-2 focus:border-blue-500"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={formData.role === "passenger" ? "default" : "outline"}
                        className="h-12 flex-col text-xs"
                        onClick={() => handleInputChange("role", "passenger")}
                      >
                        <User className="h-4 w-4 mb-1" />
                        Passenger
                      </Button>
                      <Button
                        type="button"
                        variant={formData.role === "operator" ? "default" : "outline"}
                        className="h-12 flex-col text-xs"
                        onClick={() => handleInputChange("role", "operator")}
                      >
                        <Car className="h-4 w-4 mb-1" />
                        Operator
                      </Button>
                      <Button
                        type="button"
                        variant={formData.role === "admin" ? "default" : "outline"}
                        className="h-12 flex-col text-xs"
                        onClick={() => handleInputChange("role", "admin")}
                      >
                        <Settings className="h-4 w-4 mb-1" />
                        Admin
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="border-2 focus:border-blue-500"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="border-2 focus:border-blue-500"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10 border-2 focus:border-blue-500"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+232 76 123 4567"
                        className="pl-10 border-2 focus:border-blue-500"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Verification Method */}
                  <div className="space-y-2">
                    <Label>Verification Method</Label>
                    <Select
                      value={formData.verificationMethod}
                      onValueChange={(value: "email" | "phone") => handleInputChange("verificationMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Verification</SelectItem>
                        <SelectItem value="phone">SMS Verification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role-specific fields */}
                  {formData.role === "operator" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="company"
                            placeholder="Transport Company Ltd"
                            className="pl-10 border-2 focus:border-blue-500"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="operatorId">Operator ID</Label>
                        <div className="relative">
                          <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="operatorId"
                            placeholder="OP-12345-SL"
                            className="pl-10 border-2 focus:border-blue-500"
                            value={formData.operatorId}
                            onChange={(e) => handleInputChange("operatorId", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="license">License Number</Label>
                        <Input
                          id="license"
                          placeholder="DL123456789"
                          className="border-2 focus:border-blue-500"
                          value={formData.license}
                          onChange={(e) => handleInputChange("license", e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  {formData.role === "admin" && (
                    <div className="space-y-2">
                      <Label htmlFor="adminCode">Admin Registration Code</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="adminCode"
                          type="password"
                          placeholder="Enter admin code"
                          className="pl-10 border-2 focus:border-blue-500"
                          value={formData.adminCode}
                          onChange={(e) => handleInputChange("adminCode", e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">Contact system administrator for the registration code</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-2 focus:border-blue-500"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress value={(passwordStrength.score / 5) * 100} className="flex-1 h-2" />
                          <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                            {passwordStrength.score < 2 ? "Weak" : passwordStrength.score < 4 ? "Medium" : "Strong"}
                          </span>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <div className="text-xs text-gray-600">Missing: {passwordStrength.feedback.join(", ")}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 border-2 focus:border-blue-500"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <X className="h-3 w-3" />
                        Passwords do not match
                      </div>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <Check className="h-3 w-3" />
                        Passwords match
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                          Terms of Service
                        </Button>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreeToPrivacy}
                        onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked as boolean)}
                      />
                      <Label htmlFor="privacy" className="text-sm">
                        I agree to the{" "}
                        <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                          Privacy Policy
                        </Button>
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading || passwordStrength.score < 3}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  className="border-2 hover:bg-red-50 hover:border-red-200 p-2"
                  title="Continue with Google"
                >
                  <Chrome className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("facebook")}
                  className="border-2 hover:bg-blue-50 hover:border-blue-200 p-2"
                  title="Continue with Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("twitter")}
                  className="border-2 hover:bg-sky-50 hover:border-sky-200 p-2"
                  title="Continue with Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("instagram")}
                  className="border-2 hover:bg-pink-50 hover:border-pink-200 p-2"
                  title="Continue with Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("linkedin")}
                  className="border-2 hover:bg-blue-50 hover:border-blue-200 p-2"
                  title="Continue with LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Your data is protected</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                End-to-end encryption • Two-factor authentication • Bank-level security
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Dialog */}
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              {formData.verificationMethod === "email" ? (
                <Mail className="h-5 w-5 text-blue-600" />
              ) : (
                <Phone className="h-5 w-5 text-green-600" />
              )}
              Verify Your {formData.verificationMethod === "email" ? "Email" : "Phone"}
            </DialogTitle>
            <DialogDescription className="text-center">
              We've sent a 6-digit verification code to your{" "}
              {formData.verificationMethod === "email" ? "email address" : "phone number"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-blue-500"
                  value={digit}
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                />
              ))}
            </div>

            <Button
              onClick={handleEmailVerification}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading || verificationCode.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Account
                </>
              )}
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-sm" onClick={resendVerificationCode} disabled={resendTimer > 0}>
                <RefreshCw className="h-3 w-3 mr-1" />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend verification code"}
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                className="text-sm"
                onClick={() =>
                  handleInputChange("verificationMethod", formData.verificationMethod === "email" ? "phone" : "email")
                }
              >
                Switch to {formData.verificationMethod === "email" ? "SMS" : "Email"} verification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

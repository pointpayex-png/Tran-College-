"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, ArrowLeft, CheckCircle, Loader2, Eye, EyeOff, Shield, Lock, Key, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ForgotPasswordProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ForgotPassword({ isOpen, onClose, onSuccess }: ForgotPasswordProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/\d/.test(password)) strength += 20
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20
    return strength
  }

  const handlePasswordChange = (password: string) => {
    setNewPassword(password)
    setPasswordStrength(calculatePasswordStrength(password))
  }

  const sendResetEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      })

      setStep(2)
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyResetCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Code Verified",
        description: "You can now set a new password",
      })

      setStep(3)
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "The verification code is incorrect or expired",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Password Required",
        description: "Please enter and confirm your new password",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength < 60) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully",
      })

      setStep(4)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    if (passwordStrength < 80) return "bg-blue-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 60) return "Fair"
    if (passwordStrength < 80) return "Good"
    return "Strong"
  }

  const resetForm = () => {
    setStep(1)
    setEmail("")
    setVerificationCode("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordStrength(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter your email to receive reset instructions"}
            {step === 2 && "Enter the verification code sent to your email"}
            {step === 3 && "Create a new secure password"}
            {step === 4 && "Password reset completed successfully"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Forgot Your Password?</h4>
                <p className="text-sm text-gray-600">
                  No worries! Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                />
              </div>

              <Button onClick={sendResetEmail} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Instructions
                  </>
                )}
              </Button>

              <Button variant="ghost" onClick={onClose} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Check Your Email</h4>
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a 6-digit verification code to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={verifyResetCode}
                disabled={verificationCode.length !== 6 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="flex justify-between text-sm">
                <Button variant="link" onClick={resetForm} className="p-0 h-auto">
                  Use Different Email
                </Button>
                <Button variant="link" onClick={sendResetEmail} className="p-0 h-auto">
                  Resend Code
                </Button>
              </div>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Create New Password</h4>
                <p className="text-sm text-gray-600">Choose a strong password to secure your account</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="pr-10"
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

                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength < 40
                              ? "text-red-600"
                              : passwordStrength < 60
                                ? "text-yellow-600"
                                : passwordStrength < 80
                                  ? "text-blue-600"
                                  : "text-green-600"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Password should contain: uppercase, lowercase, numbers, and special characters
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
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

                  {confirmPassword && (
                    <div className="flex items-center gap-1 text-xs">
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                          <span className="text-red-600">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={resetPassword}
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  passwordStrength < 60 ||
                  isLoading
                }
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-medium text-green-900 mb-2">Password Reset Complete!</h4>
              <p className="text-sm text-gray-600 mb-4">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              <div className="animate-pulse text-sm text-gray-500">Redirecting to login...</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

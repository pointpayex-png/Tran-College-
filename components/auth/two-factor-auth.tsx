"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, Mail, Key, CheckCircle, AlertTriangle, RefreshCw, Copy, QrCode } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

interface TwoFactorSetupProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function TwoFactorSetup({ isOpen, onClose, onComplete }: TwoFactorSetupProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState<"sms" | "email" | "app" | "">("")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [qrCode, setQrCode] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateBackupCodes = () => {
    const codes = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    return codes
  }

  const setupTwoFactor = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to setup 2FA
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (method === "app") {
        // Generate QR code and secret for authenticator app
        const secret = Math.random().toString(36).substring(2, 15)
        setSecretKey(secret)
        setQrCode(`otpauth://totp/Trans-Pay:${user?.email}?secret=${secret}&issuer=Trans-Pay`)
      }

      const codes = generateBackupCodes()
      setBackupCodes(codes)
      setStep(2)

      toast({
        title: "Two-Factor Authentication Setup",
        description: `${method.toUpperCase()} method configured successfully`,
      })
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to setup two-factor authentication",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Two-Factor Authentication Enabled",
        description: "Your account is now secured with 2FA",
      })

      setStep(3)
      onComplete()
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    })
  }

  const downloadBackupCodes = () => {
    const content = `Trans-Pay Two-Factor Authentication Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\nUser: ${user?.email}\n\nBackup Codes (use each code only once):\n${backupCodes.map((code, i) => `${i + 1}. ${code}`).join("\n")}\n\nKeep these codes in a safe place. You can use them to access your account if you lose access to your primary 2FA method.`

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transpay-backup-codes-${Date.now()}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Setup Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>Add an extra layer of security to your Trans-Pay account</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <>
              <div className="space-y-3">
                <Label>Choose your preferred 2FA method:</Label>

                <div className="grid gap-3">
                  <Card
                    className={`cursor-pointer transition-all border-2 ${
                      method === "sms" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setMethod("sms")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">SMS Text Message</h4>
                        <p className="text-sm text-gray-600">Receive codes via SMS to {user?.phone || "your phone"}</p>
                      </div>
                      {method === "sms" && <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />}
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all border-2 ${
                      method === "email" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                    onClick={() => setMethod("email")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Email Verification</h4>
                        <p className="text-sm text-gray-600">Receive codes via email to {user?.email}</p>
                      </div>
                      {method === "email" && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all border-2 ${
                      method === "app" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setMethod("app")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Key className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Authenticator App</h4>
                        <p className="text-sm text-gray-600">Use Google Authenticator or similar app</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          Most Secure
                        </Badge>
                      </div>
                      {method === "app" && <CheckCircle className="h-5 w-5 text-purple-600 ml-auto" />}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button onClick={setupTwoFactor} disabled={!method || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Continue Setup"
                )}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              {method === "app" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Scan QR Code</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <QrCode className="h-16 w-16 text-gray-400" />
                      <div className="absolute text-xs text-gray-500">QR Code</div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Or enter this key manually:</div>
                    <div className="flex items-center gap-2 justify-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{secretKey}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(secretKey)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {method === "sms" && (
                <div className="text-center">
                  <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">SMS Verification</h4>
                  <p className="text-sm text-gray-600">
                    We've sent a verification code to your phone number ending in {user?.phone?.slice(-4) || "****"}
                  </p>
                </div>
              )}

              {method === "email" && (
                <div className="text-center">
                  <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Email Verification</h4>
                  <p className="text-sm text-gray-600">We've sent a verification code to {user?.email}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="verification-code">Enter Verification Code</Label>
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

              <Button onClick={verifySetup} disabled={verificationCode.length !== 6 || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Enable 2FA"
                )}
              </Button>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-medium text-green-900 mb-2">Two-Factor Authentication Enabled!</h4>
                <p className="text-sm text-gray-600">Your account is now protected with 2FA</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-900">Save Your Backup Codes</h5>
                    <p className="text-sm text-yellow-700 mb-3">
                      Store these backup codes in a safe place. You can use them to access your account if you lose your
                      primary 2FA device.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="bg-white p-2 rounded border">
                          {index + 1}. {code}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadBackupCodes} className="mt-3">
                      Download Backup Codes
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={onClose} className="w-full">
                Complete Setup
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TwoFactorVerification({
  isOpen,
  onClose,
  onVerified,
}: {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
}) {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const verifyCode = async () => {
    if (!code || (useBackupCode ? code.length !== 8 : code.length !== 6)) {
      toast({
        title: "Invalid Code",
        description: `Please enter a valid ${useBackupCode ? "8-character backup" : "6-digit"} code`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Verification Successful",
        description: "You have been successfully authenticated",
      })

      onVerified()
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    setResendTimer(60)
    try {
      // Simulate resend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent",
      })
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Could not send verification code",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>Enter your verification code to continue</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {useBackupCode ? (
                <Key className="h-8 w-8 text-blue-600" />
              ) : (
                <Smartphone className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <h4 className="font-medium mb-2">{useBackupCode ? "Enter Backup Code" : "Enter Verification Code"}</h4>
            <p className="text-sm text-gray-600">
              {useBackupCode
                ? "Enter one of your 8-character backup codes"
                : "Enter the 6-digit code from your authenticator app or SMS"}
            </p>
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder={useBackupCode ? "XXXXXXXX" : "000000"}
              value={code}
              onChange={(e) =>
                setCode(
                  useBackupCode
                    ? e.target.value.toUpperCase().slice(0, 8)
                    : e.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
              className="text-center text-lg font-mono tracking-widest"
              maxLength={useBackupCode ? 8 : 6}
            />
          </div>

          <Button
            onClick={verifyCode}
            disabled={!code || (useBackupCode ? code.length !== 8 : code.length !== 6) || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          <div className="flex items-center justify-center gap-4 text-sm">
            {!useBackupCode && (
              <Button variant="link" onClick={resendCode} disabled={resendTimer > 0} className="p-0 h-auto">
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </Button>
            )}
            <Button variant="link" onClick={() => setUseBackupCode(!useBackupCode)} className="p-0 h-auto">
              {useBackupCode ? "Use Authenticator Code" : "Use Backup Code"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

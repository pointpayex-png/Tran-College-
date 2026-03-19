"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "passenger" | "operator" | "admin"
  avatar?: string
  isVerified: boolean
  twoFactorEnabled: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string; requiresTwoFactor?: boolean }>
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>
  verifyTwoFactor: (code: string) => Promise<{ success: boolean; message: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: "passenger" | "operator"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // Simulate API call to verify token
        const mockUser: User = {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          role: "passenger",
          isVerified: true,
          twoFactorEnabled: false,
        }
        setUser(mockUser)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser: User = {
        id: "1",
        name: email.split("@")[0],
        email,
        phone: "+1234567890",
        role: email.includes("admin") ? "admin" : email.includes("operator") ? "operator" : "passenger",
        isVerified: true,
        twoFactorEnabled: false,
      }

      setUser(mockUser)
      localStorage.setItem("auth_token", "mock_token_" + Date.now())

      return { success: true, message: "Login successful!" }
    } catch (error) {
      return { success: false, message: "Login failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        isVerified: false,
        twoFactorEnabled: false,
      }

      setUser(newUser)
      localStorage.setItem("auth_token", "mock_token_" + Date.now())

      return { success: true, message: "Registration successful!" }
    } catch (error) {
      return { success: false, message: "Registration failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return { success: false, message: "Not authenticated" }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUser({ ...user, ...data })
      return { success: true, message: "Profile updated successfully!" }
    } catch (error) {
      return { success: false, message: "Failed to update profile." }
    }
  }

  const verifyTwoFactor = async (code: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (code === "123456") {
        return { success: true, message: "Two-factor authentication verified!" }
      }

      return { success: false, message: "Invalid verification code." }
    } catch (error) {
      return { success: false, message: "Verification failed. Please try again." }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return { success: true, message: "Password reset link sent to your email!" }
    } catch (error) {
      return { success: false, message: "Failed to send reset link." }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      return { success: true, message: "Password changed successfully!" }
    } catch (error) {
      return { success: false, message: "Failed to change password." }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    verifyTwoFactor,
    resetPassword,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export individual hook functions for convenience
export const useUser = () => {
  const { user } = useAuth()
  return user
}

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

export const useAuthLoading = () => {
  const { isLoading } = useAuth()
  return isLoading
}

// Re-export everything from the auth context to maintain compatibility
export * from "@/lib/auth-context"
export { useAuth as default } from "@/lib/auth-context"

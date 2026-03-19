"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "passenger" | "operator" | "admin"
  phone?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "passenger" | "operator" | "admin"
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database (in real app, this would be your backend)
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@transpay.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    phone: "+23276123456",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "driver@transpay.com",
    firstName: "John",
    lastName: "Driver",
    role: "operator",
    phone: "+23276654321",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "passenger@transpay.com",
    firstName: "Jane",
    lastName: "Passenger",
    role: "passenger",
    phone: "+23276987654",
    createdAt: new Date().toISOString(),
  },
]

// Mock passwords (in real app, these would be hashed)
const MOCK_PASSWORDS: Record<string, string> = {
  "admin@transpay.com": "admin123",
  "driver@transpay.com": "driver123",
  "passenger@transpay.com": "passenger123",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("transpay_user")
        const storedToken = localStorage.getItem("transpay_token")

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser)
          // Verify token is still valid (mock check)
          if (isValidToken(storedToken)) {
            setUser(userData)
          } else {
            // Token expired, clear storage
            localStorage.removeItem("transpay_user")
            localStorage.removeItem("transpay_token")
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("transpay_user")
        localStorage.removeItem("transpay_token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Mock token validation (in real app, verify with backend)
  const isValidToken = (token: string): boolean => {
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]))
      return tokenData.exp > Date.now() / 1000
    } catch {
      return false
    }
  }

  // Mock token generation
  const generateToken = (userId: string): string => {
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials
      const mockUser = MOCK_USERS.find((u) => u.email === email)
      const mockPassword = MOCK_PASSWORDS[email]

      if (!mockUser || mockPassword !== password) {
        return { success: false, error: "Invalid email or password" }
      }

      // Generate token and store user
      const token = generateToken(mockUser.id)
      localStorage.setItem("transpay_user", JSON.stringify(mockUser))
      localStorage.setItem("transpay_token", token)

      setUser(mockUser)

      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || getDashboardRoute(mockUser.role)
      navigate(from, { replace: true })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      if (MOCK_USERS.find((u) => u.email === userData.email)) {
        return { success: false, error: "User with this email already exists" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
      }

      // Add to mock database
      MOCK_USERS.push(newUser)
      MOCK_PASSWORDS[userData.email] = userData.password

      // Generate token and store user
      const token = generateToken(newUser.id)
      localStorage.setItem("transpay_user", JSON.stringify(newUser))
      localStorage.setItem("transpay_token", token)

      setUser(newUser)

      // Redirect to dashboard
      const dashboardRoute = getDashboardRoute(newUser.role)
      navigate(dashboardRoute, { replace: true })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("transpay_user")
    localStorage.removeItem("transpay_token")
    setUser(null)
    navigate("/auth", { replace: true })
  }

  const getDashboardRoute = (role: string): string => {
    switch (role) {
      case "admin":
        return "/admin-dashboard"
      case "operator":
        return "/operator-dashboard"
      case "passenger":
      default:
        return "/"
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
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

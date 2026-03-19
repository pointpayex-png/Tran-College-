"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Bus,
  Activity,
  CreditCard,
  AlertTriangle,
  Download,
  MapPin,
  DollarSign,
  RefreshCw,
  Ban,
  CheckCircle,
  Search,
  Phone,
  Mail,
  User,
  BarChart3,
  Zap,
  Settings,
  Eye,
  UserCheck,
  Calendar,
  Clock,
  Star,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface DashboardStats {
  users: {
    total: number
    active: number
    newToday: number
    passengers: number
    operators: number
    admins: number
    onlineOperators: number
    blocked: number
    verified: number
    pending: number
  }
  rides: {
    total: number
    today: number
    ongoing: number
    completed: number
    cancelled: number
    cancellationRate: string
    avgRideTime: number
    peakHours: string
    revenue: number
  }
  payments: {
    total: number
    successful: number
    failed: number
    totalRevenue: number
    revenueToday: number
    successRate: string
    avgTransactionValue: number
    topPaymentMethod: string
    orangeMoney: number
    africellMoney: number
    bankCard: number
  }
  alerts: {
    new: number
    critical: number
    resolved: number
    pending: number
  }
  emergencies: {
    total: number
    active: number
    resolved: number
    avgResponseTime: number
  }
  system: {
    uptime: string
    apiResponseTime: number
    activeConnections: number
    serverLoad: number
  }
}

interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  status: string
  createdAt: string
  lastActive: string
  isOnline?: boolean
  verified: boolean
  company?: string
  operatorId?: string
  totalRides?: number
  totalEarnings?: number
  rating?: {
    average: number
    count: number
  }
  location?: {
    lat: number
    lng: number
    address: string
  }
  paymentMethods?: string[]
  emergencyContacts?: string[]
}

interface EmergencyAlert {
  _id: string
  type: "sos" | "accident" | "medical" | "fire" | "other"
  user: {
    firstName: string
    lastName: string
    phone: string
  }
  location: {
    lat: number
    lng: number
    address: string
  }
  description: string
  status: "active" | "responding" | "resolved"
  severity: "low" | "medium" | "high" | "critical"
  createdAt: string
  respondedAt?: string
  resolvedAt?: string
  responders: string[]
}

interface SystemActivity {
  id: string
  type: "user_registration" | "payment_processed" | "ride_completed" | "emergency_alert" | "system_update"
  description: string
  timestamp: string
  severity: "info" | "warning" | "error" | "success"
  user?: string
  details?: any
}

export function AdminDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>([])
  const [activities, setActivities] = useState<SystemActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Filters
  const [userFilter, setUserFilter] = useState({ role: "all", status: "all", search: "" })
  const [emergencyFilter, setEmergencyFilter] = useState({ status: "all", type: "all" })
  const [dateRange, setDateRange] = useState("today")

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "overview") {
        fetchStats()
        fetchActivities()
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [activeTab])

  // Mock data - In real app, this would come from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock comprehensive stats
      setStats({
        users: {
          total: 25847,
          active: 18456,
          newToday: 342,
          passengers: 22203,
          operators: 3544,
          admins: 100,
          onlineOperators: 1892,
          blocked: 45,
          verified: 24567,
          pending: 1280,
        },
        rides: {
          total: 189456,
          today: 2247,
          ongoing: 256,
          completed: 188934,
          cancelled: 266,
          cancellationRate: "0.14%",
          avgRideTime: 22,
          peakHours: "7-9 AM, 5-7 PM",
          revenue: 4567890000,
        },
        payments: {
          total: 256789,
          successful: 255234,
          failed: 1555,
          totalRevenue: 8456789000,
          revenueToday: 18934000,
          successRate: "99.4%",
          avgTransactionValue: 32950,
          topPaymentMethod: "Orange Money",
          orangeMoney: 145678,
          africellMoney: 89456,
          bankCard: 21655,
        },
        alerts: {
          new: 23,
          critical: 5,
          resolved: 456,
          pending: 18,
        },
        emergencies: {
          total: 189,
          active: 3,
          resolved: 186,
          avgResponseTime: 3.8,
        },
        system: {
          uptime: "99.97%",
          apiResponseTime: 125,
          activeConnections: 4847,
          serverLoad: 68,
        },
      })

      // Mock comprehensive users data
      setUsers([
        {
          _id: "1",
          firstName: "John",
          lastName: "Kamara",
          email: "john.kamara@email.com",
          phone: "+232 76 123 4567",
          role: "passenger",
          status: "active",
          verified: true,
          createdAt: "2024-01-15T10:30:00Z",
          lastActive: "2024-01-18T14:22:00Z",
          isOnline: true,
          totalRides: 45,
          location: { lat: 8.484, lng: -13.2299, address: "Freetown, Sierra Leone" },
          paymentMethods: ["Orange Money", "Bank Card"],
          emergencyContacts: ["+232 77 888 9999"],
        },
        {
          _id: "2",
          firstName: "Fatima",
          lastName: "Sesay",
          email: "fatima.sesay@email.com",
          phone: "+232 77 987 6543",
          role: "operator",
          status: "active",
          verified: true,
          createdAt: "2024-01-10T08:15:00Z",
          lastActive: "2024-01-18T16:45:00Z",
          isOnline: true,
          company: "Freetown Transport Co.",
          operatorId: "OP-12345-SL",
          totalRides: 234,
          totalEarnings: 2250000,
          rating: { average: 4.8, count: 189 },
        },
        {
          _id: "3",
          firstName: "Mohamed",
          lastName: "Bangura",
          email: "mohamed.bangura@admin.com",
          phone: "+232 78 555 1234",
          role: "admin",
          status: "active",
          verified: true,
          createdAt: "2024-01-01T00:00:00Z",
          lastActive: "2024-01-18T17:30:00Z",
          isOnline: true,
        },
      ])

      // Mock emergencies
      setEmergencies([
        {
          _id: "1",
          type: "accident",
          user: { firstName: "Mohamed", lastName: "Bangura", phone: "+232 78 555 1234" },
          location: { lat: 8.484, lng: -13.2299, address: "Siaka Stevens Street, Freetown" },
          description: "Minor vehicle collision, no injuries reported",
          status: "responding",
          severity: "medium",
          createdAt: "2024-01-18T15:30:00Z",
          responders: ["Unit 12", "Medic 5"],
        },
        {
          _id: "2",
          type: "sos",
          user: { firstName: "Aminata", lastName: "Koroma", phone: "+232 76 888 9999" },
          location: { lat: 8.49, lng: -13.235, address: "Lumley Beach Road, Freetown" },
          description: "Emergency assistance requested",
          status: "active",
          severity: "high",
          createdAt: "2024-01-18T16:15:00Z",
          responders: [],
        },
      ])

      // Mock system activities
      setActivities([
        {
          id: "1",
          type: "user_registration",
          description: "New passenger registered: John Doe",
          timestamp: "2024-01-18T17:45:00Z",
          severity: "success",
          user: "John Doe",
        },
        {
          id: "2",
          type: "payment_processed",
          description: "Payment of SLL 25,000 processed successfully",
          timestamp: "2024-01-18T17:42:00Z",
          severity: "success",
        },
        {
          id: "3",
          type: "ride_completed",
          description: "Ride from Freetown to Lumley completed",
          timestamp: "2024-01-18T17:40:00Z",
          severity: "info",
        },
        {
          id: "4",
          type: "emergency_alert",
          description: "Emergency SOS activated - Location: Freetown",
          timestamp: "2024-01-18T17:35:00Z",
          severity: "error",
        },
      ])

      setLoading(false)
    }

    fetchData()
  }, [])

  const fetchStats = async () => {
    // In real app, this would fetch updated stats
    console.log("Fetching updated stats...")
  }

  const fetchActivities = async () => {
    // In real app, this would fetch latest activities
    console.log("Fetching latest activities...")
  }

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, status } : user)))

      toast({
        title: "Status Updated",
        description: `User ${status === "blocked" ? "blocked" : "activated"} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      })
    }
  }

  const handleEmergencyResponse = async (emergencyId: string, action: "respond" | "resolve") => {
    try {
      setEmergencies((prev) =>
        prev.map((emergency) =>
          emergency._id === emergencyId
            ? {
                ...emergency,
                status: action === "respond" ? "responding" : "resolved",
                respondedAt: action === "respond" ? new Date().toISOString() : emergency.respondedAt,
                resolvedAt: action === "resolve" ? new Date().toISOString() : undefined,
              }
            : emergency,
        ),
      )

      toast({
        title: action === "respond" ? "Response Dispatched" : "Emergency Resolved",
        description:
          action === "respond"
            ? "Emergency responders have been notified and dispatched."
            : "Emergency has been marked as resolved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update emergency status.",
        variant: "destructive",
      })
    }
  }

  const exportData = async (type: string) => {
    try {
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Export Started",
        description: `${type} data export has been initiated. You'll receive a download link shortly.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <UserCheck className="h-4 w-4 text-green-500" />
      case "payment_processed":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case "ride_completed":
        return <Bus className="h-4 w-4 text-purple-500" />
      case "emergency_alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trans-Pay Admin Dashboard</h1>
            <p className="text-sm text-gray-600">
              Comprehensive System Control Center - All Active Features Monitoring
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              All Systems Online
            </Badge>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <div className="text-sm text-gray-600">Welcome, {user?.firstName || "Admin"}</div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="overview">
              <Activity className="h-4 w-4 mr-2" />
              System Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              All Users ({stats?.users.total.toLocaleString()})
            </TabsTrigger>
            <TabsTrigger value="emergencies">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergencies ({emergencies.filter((e) => e.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="rides">
              <Bus className="h-4 w-4 mr-2" />
              Rides & Tracking
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments & Revenue
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics & Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
                  <Users className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.users.total.toLocaleString()}</div>
                  <p className="text-xs opacity-90">
                    +{stats?.users.newToday} new today • {stats?.users.verified.toLocaleString()} verified
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Rides</CardTitle>
                  <Bus className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.rides.ongoing}</div>
                  <p className="text-xs opacity-90">
                    {stats?.rides.today} rides today • {stats?.rides.cancellationRate} cancel rate
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Revenue Today</CardTitle>
                  <DollarSign className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">SLL {(stats?.payments.revenueToday || 0).toLocaleString()}</div>
                  <p className="text-xs opacity-90">
                    {stats?.payments.successRate} success rate • {stats?.payments.topPaymentMethod}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Emergencies</CardTitle>
                  <AlertTriangle className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.emergencies.active}</div>
                  <p className="text-xs opacity-90">
                    {stats?.emergencies.avgResponseTime}min avg response • {stats?.alerts.critical} critical alerts
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* User Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Passengers</span>
                    <Badge variant="secondary">{stats?.users.passengers.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Operators</span>
                    <Badge variant="secondary">{stats?.users.operators.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Admins</span>
                    <Badge variant="secondary">{stats?.users.admins}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Online Operators</span>
                    <Badge className="bg-green-100 text-green-800">
                      {stats?.users.onlineOperators.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Verification</span>
                    <Badge variant="outline">{stats?.users.pending.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Blocked Users</span>
                    <Badge variant="destructive">{stats?.users.blocked}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Orange Money</span>
                    <div className="text-right">
                      <Badge className="bg-orange-100 text-orange-800">
                        {stats?.payments.orangeMoney.toLocaleString()}
                      </Badge>
                      <div className="text-xs text-gray-500">56.8%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Africell Money</span>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">
                        {stats?.payments.africellMoney.toLocaleString()}
                      </Badge>
                      <div className="text-xs text-gray-500">34.8%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bank Cards</span>
                    <div className="text-right">
                      <Badge className="bg-gray-100 text-gray-800">{stats?.payments.bankCard.toLocaleString()}</Badge>
                      <div className="text-xs text-gray-500">8.4%</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Transactions</span>
                      <Badge variant="secondary">{stats?.payments.total.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">Success Rate</span>
                      <Badge className="bg-green-100 text-green-800">{stats?.payments.successRate}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Uptime</span>
                    <Badge className="bg-green-100 text-green-800">{stats?.system.uptime}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response Time</span>
                    <Badge variant="secondary">{stats?.system.apiResponseTime}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Connections</span>
                    <Badge variant="secondary">{stats?.system.activeConnections.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Load</span>
                    <Badge
                      className={
                        stats?.system.serverLoad > 80 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }
                    >
                      {stats?.system.serverLoad}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backup Status</span>
                    <Badge className="bg-blue-100 text-blue-800">Up to date</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Real-time System Activity
                </CardTitle>
                <CardDescription>Live feed of all system activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${getActivityColor(activity.severity)}`}
                    >
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <span className="text-sm font-medium">{activity.description}</span>
                          {activity.user && <div className="text-xs text-gray-500">User: {activity.user}</div>}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Complete User Management</CardTitle>
                    <CardDescription>View and manage all registered users across all roles</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => exportData("users")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Advanced Filters */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users by name, email, phone..."
                        value={userFilter.search}
                        onChange={(e) => setUserFilter({ ...userFilter, search: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={userFilter.role}
                    onValueChange={(value) => setUserFilter({ ...userFilter, role: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="passenger">Passengers</SelectItem>
                      <SelectItem value="operator">Operators</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={userFilter.status}
                    onValueChange={(value) => setUserFilter({ ...userFilter, status: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comprehensive Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Details</TableHead>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Role & Status</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userData) => (
                        <TableRow key={userData._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {userData.firstName} {userData.lastName}
                                </div>
                                <div className="text-sm text-gray-500">ID: {userData._id}</div>
                                {userData.company && <div className="text-xs text-blue-600">{userData.company}</div>}
                                {userData.operatorId && (
                                  <div className="text-xs text-purple-600">ID: {userData.operatorId}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <a href={`mailto:${userData.email}`} className="hover:text-blue-600">
                                  {userData.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <a href={`tel:${userData.phone}`} className="hover:text-blue-600">
                                  {userData.phone}
                                </a>
                              </div>
                              {userData.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span className="text-gray-600">{userData.location.address}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Badge variant="outline" className="capitalize">
                                {userData.role}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={userData.status === "active" ? "default" : "destructive"}
                                  className="capitalize"
                                >
                                  {userData.status}
                                </Badge>
                                {userData.isOnline && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600">Online</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge
                                variant={userData.verified ? "default" : "destructive"}
                                className={userData.verified ? "bg-green-100 text-green-800" : ""}
                              >
                                {userData.verified ? "Verified" : "Pending"}
                              </Badge>
                              {userData.paymentMethods && (
                                <div className="text-xs text-gray-500">
                                  Payment: {userData.paymentMethods.join(", ")}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span>Joined: {new Date(userData.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span>Last: {new Date(userData.lastActive).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              {userData.role === "operator" ? (
                                <>
                                  <div>Rides: {userData.totalRides}</div>
                                  <div>Earnings: SLL {userData.totalEarnings?.toLocaleString()}</div>
                                  {userData.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span>
                                        {userData.rating.average}/5 ({userData.rating.count})
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div>Rides: {userData.totalRides || 0}</div>
                                  <div className="text-gray-500">Regular user</div>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateUserStatus(
                                    userData._id,
                                    userData.status === "active" ? "blocked" : "active",
                                  )
                                }
                              >
                                {userData.status === "active" ? (
                                  <>
                                    <Ban className="h-3 w-3 mr-1" />
                                    Block
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Activate
                                  </>
                                )}
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergencies Tab */}
          <TabsContent value="emergencies">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Emergency Management System
                    </CardTitle>
                    <CardDescription>Real-time emergency monitoring and response coordination</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="destructive">
                      {emergencies.filter((e) => e.status === "active").length} Active
                    </Badge>
                    <Badge variant="secondary">
                      {emergencies.filter((e) => e.status === "responding").length} Responding
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {emergencies.filter((e) => e.status === "resolved").length} Resolved
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencies.map((emergency) => (
                    <Card
                      key={emergency._id}
                      className={`border-l-4 ${
                        emergency.severity === "critical"
                          ? "border-red-600 bg-red-50"
                          : emergency.severity === "high"
                            ? "border-orange-500 bg-orange-50"
                            : emergency.severity === "medium"
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={emergency.status === "active" ? "destructive" : "secondary"}
                              className={
                                emergency.status === "active"
                                  ? "animate-pulse"
                                  : emergency.status === "responding"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {emergency.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {emergency.type}
                            </Badge>
                            <Badge
                              variant={
                                emergency.severity === "critical" || emergency.severity === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="uppercase"
                            >
                              {emergency.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">{new Date(emergency.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              User Information
                            </h4>
                            <p className="text-sm font-medium">
                              {emergency.user.firstName} {emergency.user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{emergency.user.phone}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Location
                            </h4>
                            <p className="text-sm">{emergency.location.address}</p>
                            <p className="text-sm text-gray-600">
                              {emergency.location.lat.toFixed(4)}, {emergency.location.lng.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Timeline
                            </h4>
                            <p className="text-sm">Created: {new Date(emergency.createdAt).toLocaleTimeString()}</p>
                            {emergency.respondedAt && (
                              <p className="text-sm text-yellow-600">
                                Responded: {new Date(emergency.respondedAt).toLocaleTimeString()}
                              </p>
                            )}
                            {emergency.resolvedAt && (
                              <p className="text-sm text-green-600">
                                Resolved: {new Date(emergency.resolvedAt).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded border">{emergency.description}</p>
                        </div>

                        {emergency.responders.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Active Responders
                            </h4>
                            <div className="flex gap-2">
                              {emergency.responders.map((responder, index) => (
                                <Badge key={index} variant="outline" className="bg-blue-50">
                                  {responder}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {emergency.status === "active" && (
                            <Button
                              size="sm"
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => handleEmergencyResponse(emergency._id, "respond")}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Dispatch Response Team
                            </Button>
                          )}
                          {emergency.status === "responding" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleEmergencyResponse(emergency._id, "resolve")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark as Resolved
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            View on Map
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact User
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="rides">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="h-5 w-5" />
                  Ride Management & Real-time Tracking
                </CardTitle>
                <CardDescription>
                  Monitor all rides, track vehicles, and manage transportation operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ride Management System</h3>
                  <p className="text-gray-500 mb-4">
                    Comprehensive ride tracking, route management, and real-time vehicle monitoring coming soon.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Real-time Tracking</h4>
                      <p className="text-sm text-blue-700">Live GPS tracking of all vehicles</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Route Optimization</h4>
                      <p className="text-sm text-green-700">AI-powered route planning</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900">Performance Analytics</h4>
                      <p className="text-sm text-purple-700">Detailed ride and driver analytics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Processing & Revenue Management
                </CardTitle>
                <CardDescription>
                  Monitor transactions, manage refunds, and track revenue across all payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Management System</h3>
                  <p className="text-gray-500 mb-4">
                    Advanced payment processing, fraud detection, and financial reporting tools.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900">Mobile Money</h4>
                      <p className="text-sm text-orange-700">Orange Money & Africell Money integration</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Fraud Detection</h4>
                      <p className="text-sm text-blue-700">AI-powered fraud prevention</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Revenue Analytics</h4>
                      <p className="text-sm text-green-700">Real-time financial reporting</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Advanced Analytics & Reporting
                </CardTitle>
                <CardDescription>Comprehensive data analysis, trends, and business intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-500 mb-4">
                    Advanced analytics, predictive insights, and comprehensive reporting tools.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900">Usage Analytics</h4>
                      <p className="text-sm text-purple-700">User behavior and app usage patterns</p>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg">
                      <h4 className="font-medium text-cyan-900">Predictive Insights</h4>
                      <p className="text-sm text-cyan-700">AI-powered trend predictions</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <h4 className="font-medium text-pink-900">Custom Reports</h4>
                      <p className="text-sm text-pink-700">Automated report generation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

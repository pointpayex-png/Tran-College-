"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CreditCard,
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Transaction {
  id: string
  transactionId: string
  amount: number
  currency: string
  provider: "orange" | "africell"
  status: "pending" | "success" | "failed" | "cancelled"
  description: string
  phoneNumber: string
  reference?: string
  fees: number
  netAmount: number
  createdAt: string
  completedAt?: string
  failureReason?: string
}

export function PaymentDashboard() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  // Mock transaction data - In real app, this would come from API
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        transactionId: "TP_1705567890_abc123",
        amount: 25000,
        currency: "SLL",
        provider: "orange",
        status: "success",
        description: "Ride payment - Freetown to Lumley",
        phoneNumber: "076123456",
        reference: "OM_REF_789456123",
        fees: 500,
        netAmount: 24500,
        createdAt: "2024-01-18T10:30:00Z",
        completedAt: "2024-01-18T10:31:15Z",
      },
      {
        id: "2",
        transactionId: "TP_1705567800_def456",
        amount: 15000,
        currency: "SLL",
        provider: "africell",
        status: "success",
        description: "Account top-up",
        phoneNumber: "070987654",
        reference: "AM_REF_456789012",
        fees: 400,
        netAmount: 14600,
        createdAt: "2024-01-18T09:15:00Z",
        completedAt: "2024-01-18T09:16:30Z",
      },
      {
        id: "3",
        transactionId: "TP_1705567700_ghi789",
        amount: 50000,
        currency: "SLL",
        provider: "orange",
        status: "failed",
        description: "Ride payment - Bo to Kenema",
        phoneNumber: "077555444",
        fees: 1000,
        netAmount: 49000,
        createdAt: "2024-01-18T08:45:00Z",
        failureReason: "Insufficient balance",
      },
      {
        id: "4",
        transactionId: "TP_1705567600_jkl012",
        amount: 8000,
        currency: "SLL",
        provider: "africell",
        status: "pending",
        description: "Parking fee payment",
        phoneNumber: "075111222",
        fees: 400,
        netAmount: 7600,
        createdAt: "2024-01-18T08:00:00Z",
      },
    ]

    setTimeout(() => {
      setTransactions(mockTransactions)
      setFilteredTransactions(mockTransactions)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter transactions
  useEffect(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.reference?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (providerFilter !== "all") {
      filtered = filtered.filter((t) => t.provider === providerFilter)
    }

    if (dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter((t) => new Date(t.createdAt) >= filterDate)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, statusFilter, providerFilter, dateRange])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProviderIcon = (provider: string) => {
    return provider === "orange" ? "🟠" : "🔵"
  }

  const calculateStats = () => {
    const successfulTransactions = transactions.filter((t) => t.status === "success")
    const totalAmount = successfulTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalFees = successfulTransactions.reduce((sum, t) => sum + t.fees, 0)
    const successRate = transactions.length > 0 ? (successfulTransactions.length / transactions.length) * 100 : 0

    return {
      totalTransactions: transactions.length,
      successfulTransactions: successfulTransactions.length,
      totalAmount,
      totalFees,
      successRate,
    }
  }

  const stats = calculateStats()

  const exportTransactions = () => {
    const csvContent = [
      ["Date", "Transaction ID", "Description", "Provider", "Amount", "Fees", "Status", "Reference"].join(","),
      ...filteredTransactions.map((t) =>
        [
          new Date(t.createdAt).toLocaleDateString(),
          t.transactionId,
          `"${t.description}"`,
          t.provider,
          t.amount,
          t.fees,
          t.status,
          t.reference || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalFees)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage your payment transactions</CardDescription>
            </div>
            <Button onClick={exportTransactions} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="orange">Orange Money</SelectItem>
                <SelectItem value="africell">Africell Money</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Transaction Details</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-gray-500">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No transactions found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500 font-mono">{transaction.transactionId}</div>
                          {transaction.reference && (
                            <div className="text-xs text-blue-600 font-mono">Ref: {transaction.reference}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getProviderIcon(transaction.provider)}</span>
                          <div>
                            <div className="font-medium capitalize">{transaction.provider} Money</div>
                            <div className="text-sm text-gray-500">{transaction.phoneNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold">{formatCurrency(transaction.amount)}</div>
                          <div className="text-sm text-gray-500">Fee: {formatCurrency(transaction.fees)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(transaction.status)}
                          {transaction.status === "failed" && transaction.failureReason && (
                            <div className="text-xs text-red-600">{transaction.failureReason}</div>
                          )}
                          {transaction.completedAt && (
                            <div className="text-xs text-gray-500">
                              Completed: {new Date(transaction.completedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.status === "pending" && (
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

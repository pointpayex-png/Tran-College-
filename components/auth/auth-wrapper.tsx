"use client"

import { Suspense } from "react"
import { CompleteAuthSystem } from "./complete-auth-system"
import { Loader2 } from "lucide-react"

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4">
          <Loader2 className="h-12 w-12" />
        </div>
        <p className="text-gray-600">Loading authentication system...</p>
      </div>
    </div>
  )
}

export function AuthWrapper() {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <CompleteAuthSystem />
    </Suspense>
  )
}

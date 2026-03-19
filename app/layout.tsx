import type React from "react"
import "./globals.css"
import type { Metadata } from "next/metadata"
import { Inter } from "next/font/google"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trans-Pay - Digital Transport Solution",
  description: "Sierra Leone's premier digital transport and payment platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </body>
    </html>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Heart, Settings, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })
    router.push("/")
  }

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b bg-white fixed top-0 left-0 right-0 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-bold text-xl">SoleMate</span>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white transition-transform duration-200 ease-in-out border-r",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0", // Always show on desktop
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b">
            <span className="font-bold text-xl">SoleMate</span>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 px-3 py-4">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors",
                pathname === "/dashboard"
                  ? "bg-gray-100 text-black"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black",
              )}
            >
              <Home size={20} />
              Find Matches
            </Link>
            <Link
              href="/dashboard/matches"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors",
                pathname === "/dashboard/matches"
                  ? "bg-gray-100 text-black"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black",
              )}
            >
              <Heart size={20} />
              My Matches
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors",
                pathname === "/dashboard/settings"
                  ? "bg-gray-100 text-black"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black",
              )}
            >
              <Settings size={20} />
              Settings
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-end px-6 h-16 border-b bg-white">
          <span className="text-gray-600">Welcome, {user.email}</span>
        </header>

        {/* Mobile Spacer */}
        <div className="h-16 md:hidden" />

        {/* Main Content Area */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}


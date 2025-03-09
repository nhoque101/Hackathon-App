"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSupabaseClient } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setSuccess(true)
    } catch (err) {
      console.error("Password update error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while updating your password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <Button variant="ghost" onClick={() => router.push("/login")} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sign In
      </Button>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
          <p className="text-gray-600">Enter a new password for your SoleMate account</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded text-center">
            <h3 className="font-bold mb-2">Password Updated</h3>
            <p className="mb-4">Your password has been successfully updated.</p>
            <Button onClick={() => router.push("/login")} className="mt-2 bg-black text-white">
              Sign In with New Password
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your new password"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm your new password"
                minLength={6}
              />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>}

            <Button type="submit" className="w-full bg-black text-white" disabled={isLoading}>
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}


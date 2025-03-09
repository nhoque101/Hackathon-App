"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSupabaseClient } from "@/lib/supabase"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const footSize = formData.get("footSize") as string

    try {
      const supabase = createSupabaseClient()

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authData.user.id,
          full_name: fullName,
          foot_size: Number.parseFloat(footSize),
        })

        if (profileError) throw profileError

        // Redirect to home page or email verification page
        router.push("/")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create Your SoleMate Account</h1>
          <p className="text-gray-600">Join our community to find your perfect shoe match</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" type="text" required placeholder="Enter your full name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="Enter your email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="Create a password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footSize">Foot Size</Label>
            <Input id="footSize" name="footSize" type="number" step="0.5" required placeholder="Enter your foot size" />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>}

          <Button type="submit" className="w-full bg-black text-white" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button type="button" onClick={() => router.push("/login")} className="text-blue-600 hover:underline">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}


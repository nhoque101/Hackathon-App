import { type NextRequest, NextResponse } from "next/server"

// For local testing, we'll skip authentication checks
export async function middleware(request: NextRequest) {
  // Always allow access for local testing
  return NextResponse.next()
}


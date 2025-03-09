import { NextResponse } from "next/server"
import { shoeData } from "@/lib/shoe-data"

// In-memory storage for matches since we're not using Supabase
let userMatches: {
  id: string
  user_id: string
  shoe_id: string
  saved_at: string
}[] = []

export async function POST(request: Request) {
  try {
    // Get the current user session (simplified for local testing)
    const userId = "local-user-id"

    const { shoeId } = await request.json()

    if (!shoeId) {
      return NextResponse.json({ error: "Shoe ID is required" }, { status: 400 })
    }

    // Generate a unique ID for the match
    const matchId = `match-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Save the match to our in-memory storage
    const newMatch = {
      id: matchId,
      user_id: userId,
      shoe_id: shoeId.toString(),
      saved_at: new Date().toISOString(),
    }

    userMatches.push(newMatch)

    return NextResponse.json({ success: true, match: newMatch })
  } catch (error) {
    console.error("Error saving match:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get the current user session (simplified for local testing)
    const userId = "local-user-id"

    // Get all matches for the user
    const matches = userMatches.filter((match) => match.user_id === userId)

    // If no matches found, return empty array
    if (matches.length === 0) {
      return NextResponse.json([])
    }

    // Transform the data to match the frontend structure
    const transformedData = matches
      .map((match) => {
        const shoe = shoeData.shoes.find((s) => s.id === match.shoe_id)

        if (!shoe) {
          return null
        }

        // Get brand name
        const brand = shoeData.brands.find((b) => b.id === shoe.brand_id)

        // Get style name
        const style = shoeData.styles.find((s) => s.id === shoe.style_id)

        // Get conditions for this shoe
        const shoeConditionIds = shoeData.shoe_conditions
          .filter((sc) => sc.shoe_id === shoe.id)
          .map((sc) => sc.condition_id)

        const conditions = shoeData.conditions
          .filter((c) => shoeConditionIds.includes(c.id))
          .map((c) => c.name.toLowerCase().replace(/\s+/g, "-"))

        // Get image
        const image = shoeData.shoe_images.find((img) => img.shoe_id === shoe.id)?.url || shoe.image_url

        return {
          id: match.id,
          savedAt: match.saved_at,
          shoe: {
            id: Number.parseInt(shoe.id),
            name: shoe.name,
            price: shoe.price,
            rating: shoe.rating,
            reviews: Math.floor(Math.random() * 100) + 20, // Random number of reviews
            image: image,
            tags: [brand?.name, style?.name].filter(Boolean),
            description: shoe.description,
            medicalConditions: conditions,
            styles: [style?.name?.toLowerCase()].filter(Boolean),
            gender: shoe.gender,
            product_url: shoe.product_url,
          },
        }
      })
      .filter(Boolean)

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Get the current user session (simplified for local testing)
    const userId = "local-user-id"

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("id")

    if (!matchId) {
      return NextResponse.json({ error: "Match ID is required" }, { status: 400 })
    }

    // Delete the match from our in-memory storage
    const initialLength = userMatches.length
    userMatches = userMatches.filter((match) => !(match.id === matchId && match.user_id === userId))

    if (userMatches.length === initialLength) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting match:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ProductDetailsCard from "@/components/product-details-card"
import { useToast } from "@/hooks/use-toast"

interface Match {
  id: string
  savedAt: string
  shoe: {
    id: number
    name: string
    price: number
    rating: number
    reviews: number
    image: string
    tags: string[]
    description: string
    medicalConditions: string[]
    styles: string[]
    gender: string
  }
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedShoe, setSelectedShoe] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/user/matches")
        if (!response.ok) {
          throw new Error("Failed to fetch matches")
        }
        const data = await response.json()
        setMatches(data)
      } catch (err) {
        console.error("Error fetching matches:", err)
        setError("Failed to load your matches. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const handleRemoveMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/user/matches?id=${matchId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove match")
      }

      setMatches(matches.filter((match) => match.id !== matchId))
      toast({
        title: "Match removed",
        description: "The shoe has been removed from your matches.",
      })
    } catch (err) {
      console.error("Error removing match:", err)
      toast({
        title: "Error",
        description: "Failed to remove the match. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get the selected shoe details
  const selectedShoeDetails = selectedShoe ? matches.find((match) => match.shoe.id === selectedShoe)?.shoe : null

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Matches</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <Heart className="h-16 w-16 mx-auto text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't liked any shoes yet. Start swiping to find your perfect matches!
          </p>
          <Button asChild className="bg-black text-white">
            <a href="/dashboard">Find Matches</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Matches</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 cursor-pointer" onClick={() => setSelectedShoe(match.shoe.id)}>
              <Image src={match.shoe.image || "/placeholder.svg"} alt={match.shoe.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{match.shoe.name}</h3>
                <span className="font-bold">${match.shoe.price}</span>
              </div>
              <div className="flex items-center text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= Math.floor(match.shoe.rating) ? "fill-current" : "text-gray-300"}
                  />
                ))}
                <span className="text-gray-600 text-xs ml-1">({match.shoe.reviews})</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {match.shoe.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRemoveMatch(match.id)}
                >
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </Button>
                <Button size="sm" className="bg-black text-white" onClick={() => setSelectedShoe(match.shoe.id)}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Dialog */}
      {selectedShoeDetails && (
        <Dialog open={!!selectedShoe} onOpenChange={(open) => !open && setSelectedShoe(null)}>
          <DialogContent className="max-w-5xl p-0 h-[90vh]">
            <ProductDetailsCard
              shoe={selectedShoeDetails}
              isLiked={true}
              onToggleLike={() => {
                const match = matches.find((m) => m.shoe.id === selectedShoeDetails.id)
                if (match) {
                  handleRemoveMatch(match.id)
                }
                setSelectedShoe(null)
              }}
              onClose={() => setSelectedShoe(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}


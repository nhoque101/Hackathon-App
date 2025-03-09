"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, type PanInfo, useAnimation, AnimatePresence } from "framer-motion"
import { Heart, X, Grid, ArrowLeft, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import ProductDetailsCard from "./product-details-card"
import shoesData from "@/lib/shoes-data.json"
import { useToast } from "@/hooks/use-toast"

interface SwipeInterfaceProps {
  initialViewMode?: "swipe" | "grid"
  selectedCondition: string
  selectedStyle: string
  selectedGender: string
  priceRange: number[]
  onClose: () => void
}

export default function SwipeInterface({
  initialViewMode = "swipe",
  onClose,
  selectedCondition,
  selectedStyle,
  selectedGender,
  priceRange,
}: SwipeInterfaceProps) {
  const [shoes, setShoes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState("")
  const [likedShoes, setLikedShoes] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"swipe" | "grid">(initialViewMode)
  const [showMatchesDialog, setShowMatchesDialog] = useState(false)
  const [noMoreCards, setNoMoreCards] = useState(false)
  const [selectedShoe, setSelectedShoe] = useState<number | null>(null)
  const [noResults, setNoResults] = useState(false)

  // Inside the SwipeInterface component, add these lines after the state declarations
  // Remove useAuth dependency
  const isLoggedIn = true // Always consider user as logged in for simplicity
  const { toast } = useToast()

  // Replace filteredShoes with:
  const filteredShoes = shoes

  // Controls for the card animation
  const controls = useAnimation()

  // Add this effect to fetch shoes when the component mounts or filters change
  // Load shoes from local JSON data
  useEffect(() => {
    setIsLoading(true)
    // Transform the data to match the frontend structure
    const transformedData = shoesData.shoes.map((shoe) => ({
      id: Number.parseInt(shoe.id),
      name: shoe.name,
      price: shoe.price,
      rating: shoe.rating,
      reviews: shoe.reviews,
      image: shoe.image_url,
      tags: [shoe.brand, shoe.style].filter(Boolean),
      description: shoe.description,
      medicalConditions: shoe.conditions.map((c) => c.toLowerCase().replace(/\s+/g, "-")),
      styles: [shoe.style.toLowerCase()].filter(Boolean),
      gender: shoe.gender,
      product_url: shoe.product_url,
    }))

    setShoes(transformedData)
    setIsLoading(false)
  }, [])

  // The rest of the component remains the same...

  // Check if there are no more cards to swipe
  useEffect(() => {
    if (currentIndex >= shoes.length && shoes.length > 0) {
      setNoMoreCards(true)
    }
  }, [currentIndex, shoes.length])

  // Handle card drag end
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100 // minimum distance required for a swipe

    if (info.offset.x > threshold) {
      // Swiped right (like)
      controls
        .start({
          x: 500,
          opacity: 0,
          transition: { duration: 0.5 },
        })
        .then(() => {
          setDirection("right")
          // Add to liked shoes
          if (currentIndex < shoes.length) {
            setLikedShoes((prev) => [...prev, shoes[currentIndex].id])
          }
          nextCard()
        })
    } else if (info.offset.x < -threshold) {
      // Swiped left (dislike)
      controls
        .start({
          x: -500,
          opacity: 0,
          transition: { duration: 0.5 },
        })
        .then(() => {
          setDirection("left")
          nextCard()
        })
    } else {
      // Return to center if not swiped far enough
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0 },
      })
    }
  }

  // Move to next card
  const nextCard = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1)
    controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0 },
    })
  }

  // Replace the handleLike function with this updated version
  // Handle like button click
  const handleLike = () => {
    if (currentIndex < shoes.length) {
      controls
        .start({
          x: 500,
          opacity: 0,
          transition: { duration: 0.5 },
        })
        .then(() => {
          setDirection("right")
          // Add to liked shoes
          setLikedShoes((prev) => [...prev, shoes[currentIndex].id])
          nextCard()
        })
    }
  }

  // Handle dislike button click
  const handleDislike = () => {
    if (currentIndex < shoes.length) {
      controls
        .start({
          x: -500,
          opacity: 0,
          transition: { duration: 0.5 },
        })
        .then(() => {
          setDirection("left")
          nextCard()
        })
    }
  }

  // Update the toggleLike function to save matches to the database
  // Toggle like for a shoe
  const toggleLike = (shoeId: number) => {
    if (likedShoes.includes(shoeId)) {
      setLikedShoes((prev) => prev.filter((id) => id !== shoeId))
    } else {
      setLikedShoes((prev) => [...prev, shoeId])
    }
  }

  // Current shoe
  const currentShoe = shoes[currentIndex]

  // Get the selected shoe details
  const selectedShoeDetails = selectedShoe ? shoes.find((shoe) => shoe.id === selectedShoe) : null

  // Render the appropriate view based on state
  const renderContent = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading shoes...</p>
        </div>
      )
    }

    // Show error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <Image
            src="/placeholder.svg?height=200&width=200"
            alt="Error"
            width={200}
            height={200}
            className="mb-6 opacity-50"
          />
          <h3 className="text-2xl font-bold mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={onClose} className="bg-black text-white">
            Go Back
          </Button>
        </div>
      )
    }

    // If no shoes match the filter criteria
    if (noResults) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <Image
            src="/placeholder.svg?height=200&width=200"
            alt="No matches"
            width={200}
            height={200}
            className="mb-6 opacity-50"
          />
          <h3 className="text-2xl font-bold mb-2">No matches found</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            We couldn't find any shoes matching your current filters. We're working to add more options soon!
          </p>
          <Button onClick={onClose} className="bg-black text-white">
            Adjust Filters
          </Button>
        </div>
      )
    }

    // If there are no more cards to swipe
    if (noMoreCards) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <Image
            src="/placeholder.svg?height=200&width=200"
            alt="End of cards"
            width={200}
            height={200}
            className="mb-6 opacity-50"
          />
          <h3 className="text-2xl font-bold mb-2">You've seen all shoes</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {likedShoes.length > 0
              ? "You've gone through all available shoes. Check out your matches!"
              : "You've gone through all available shoes but haven't liked any. Try again later!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {likedShoes.length > 0 && (
              <Button onClick={() => setShowMatchesDialog(true)} className="bg-black text-white">
                See My Matches ({likedShoes.length})
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="border-black text-black">
              Close
            </Button>
          </div>
        </div>
      )
    }

    // Grid view
    if (viewMode === "grid") {
      return (
        <div className="p-4 h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
            <Button variant="ghost" onClick={() => setViewMode("swipe")} className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Swipe Mode
            </Button>
            {likedShoes.length > 0 && (
              <Button onClick={() => setShowMatchesDialog(true)} className="bg-black text-white">
                See My Matches ({likedShoes.length})
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
            {shoes.map((shoe) => (
              <div
                key={shoe.id}
                className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedShoe(shoe.id)}
              >
                <div className="relative h-48">
                  <Image src={shoe.image || "/placeholder.svg"} alt={shoe.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{shoe.name}</h3>
                    <span className="font-bold">${shoe.price}</span>
                  </div>
                  <div className="flex items-center text-yellow-500 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= Math.floor(shoe.rating) ? "fill-current" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-gray-600 text-xs ml-1">({shoe.reviews})</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{shoe.description.substring(0, 100)}...</p>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border-black",
                        likedShoes.includes(shoe.id) && "bg-green-50 border-green-500 text-green-700",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(shoe.id)
                      }}
                    >
                      {likedShoes.includes(shoe.id) ? "Liked" : "Like"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-black text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedShoe(shoe.id)
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Swipe view (default)
    return (
      <div className="flex flex-col items-center p-4">
        <div className="flex justify-between w-full mb-6">
          <Button variant="ghost" onClick={onClose} className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Search
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode("grid")} className="flex items-center gap-2">
              <Grid size={18} />
              Grid View
            </Button>
            {likedShoes.length > 0 && (
              <Button
                onClick={() => setShowMatchesDialog(true)}
                className="bg-black text-white"
                disabled={likedShoes.length === 0}
              >
                Matches ({likedShoes.length})
              </Button>
            )}
          </div>
        </div>

        {/* Card counter */}
        <div className="text-sm text-gray-500 mb-4">
          Card {currentIndex + 1} of {filteredShoes.length}
        </div>

        {/* Main card - current shoe */}
        {currentIndex < filteredShoes.length && currentShoe ? (
          <div className="relative w-full max-w-sm">
            <motion.div
              className="relative bg-white shadow-xl rounded-lg overflow-hidden mx-auto z-30 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={controls}
              initial={{ x: 0, opacity: 1 }}
            >
              <div className="h-64 overflow-hidden relative" onClick={() => setSelectedShoe(currentShoe.id)}>
                <Image
                  src={currentShoe.image || "/placeholder.svg"}
                  alt={currentShoe.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white font-medium italic text-sm">
                    "{currentShoe.description.substring(0, 100)}..."
                  </p>
                </div>
                <Button
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 text-black hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedShoe(currentShoe.id)
                  }}
                >
                  View Details
                </Button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{currentShoe.name}</h3>
                  <span className="font-bold text-lg">${currentShoe.price}</span>
                </div>
                <div className="flex items-center text-yellow-500 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.floor(currentShoe.rating) ? "fill-current" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-gray-600 text-sm ml-1">({currentShoe.reviews})</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentShoe.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-gray-700 text-sm">
                  <p>
                    <strong>Best for:</strong>{" "}
                    {currentShoe.medicalConditions
                      .map((c) => {
                        const condition = c
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                        return condition
                      })
                      .join(", ")}
                  </p>
                </div>

                {/* Swipe indicators */}
                {direction === "left" && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold transform -rotate-12">
                    PASS
                  </div>
                )}
                {direction === "right" && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
                    LIKE
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="End of cards"
              width={200}
              height={200}
              className="mb-6 opacity-50"
            />
            <h3 className="text-2xl font-bold mb-2">You've seen all shoes</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {likedShoes.length > 0
                ? "You've gone through all available shoes. Check out your matches!"
                : "You've gone through all available shoes but haven't liked any. Try different filters or check back later for new arrivals."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {likedShoes.length > 0 && (
                <Button onClick={() => setShowMatchesDialog(true)} className="bg-black text-white">
                  See My Matches ({likedShoes.length})
                </Button>
              )}
              <Button onClick={onClose} variant="outline" className="border-black text-black">
                Try Different Filters
              </Button>
            </div>
          </div>
        )}

        {/* Swiping Controls - Only show if there are cards left */}
        {currentIndex < shoes.length && (
          <>
            <div className="flex justify-center mt-8 gap-8">
              <button
                onClick={handleDislike}
                className="bg-white text-red-500 rounded-full p-4 shadow-lg transform hover:scale-110 transition border border-gray-200"
              >
                <X size={28} />
              </button>
              <button
                onClick={handleLike}
                className="bg-black text-white rounded-full p-4 shadow-lg transform hover:scale-110 transition"
              >
                <Heart size={28} />
              </button>
            </div>

            {/* Swipe instructions */}
            <p className="text-gray-500 text-sm mt-4">Swipe right to like, left to pass</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white min-h-[80vh]">
      {renderContent()}

      {/* Matches Dialog */}
      <Dialog open={showMatchesDialog} onOpenChange={setShowMatchesDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your Matches</DialogTitle>
            <DialogDescription>You've liked {likedShoes.length} shoes that match your preferences</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-1">
            {shoes
              .filter((shoe) => likedShoes.includes(shoe.id))
              .map((shoe) => (
                <div
                  key={shoe.id}
                  className="flex border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setShowMatchesDialog(false)
                    setSelectedShoe(shoe.id)
                  }}
                >
                  <div className="w-1/3 relative">
                    <Image src={shoe.image || "/placeholder.svg"} alt={shoe.name} fill className="object-cover" />
                  </div>
                  <div className="w-2/3 p-3">
                    <h3 className="font-bold text-sm">{shoe.name}</h3>
                    <p className="text-sm font-bold">${shoe.price}</p>
                    <div className="flex items-center text-yellow-500 mb-1">
                      <Star size={12} className="fill-current" />
                      <span className="text-gray-600 text-xs ml-1">
                        {shoe.rating} ({shoe.reviews})
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 w-full bg-black text-white text-xs py-1 h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMatchesDialog(false)
                        setSelectedShoe(shoe.id)
                      }}
                    >
                      View Details <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setShowMatchesDialog(false)} className="border-black text-black">
              Continue Browsing
            </Button>
            <Button className="bg-black text-white">Save My Matches</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Details Expanded View */}
      <AnimatePresence>
        {selectedShoeDetails && (
          <ProductDetailsCard
            shoe={selectedShoeDetails}
            isLiked={likedShoes.includes(selectedShoeDetails.id)}
            onToggleLike={() => toggleLike(selectedShoeDetails.id)}
            onClose={() => setSelectedShoe(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Heart, X, ChevronLeft, ChevronRight, ExternalLink, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Shoe pickup lines for Tinder-style experience
const shoePickupLines = [
  "Hey there! I've been told I'm quite a-HEEL-ing to look at. Wanna take a walk together?",
  "Are you tired? Because you've been running through my mind since you first saw me.",
  "I may not be Cinderella's glass slipper, but I'll transform your outfit!",
  "They say you can tell a lot about a person by their shoes. Let me tell you about myself...",
  "I'm not just a pretty face, I've got sole too!",
  "We might be a perfect fit. Want to try me on for size?",
  "I promise I won't give you cold feet, only happy steps!",
  "I've been waiting for someone like you to sweep me off the shelf!",
  "Life's too short for boring shoes. Let me add some excitement to your steps!",
  "Is it hot in here, or is it just our incredible chemistry?",
  "I might not be made of sugar, but I'm still pretty sweet on you!",
  "They say good shoes take you to good places. Where shall we go first?",
  "I'm not like the other shoes - I'll never let you down!",
  "Swipe right if you believe in love at first sight... or should I walk by again?",
  "I may not be a running shoe, but I'll still take your breath away!",
]

interface ProductDetailsCardProps {
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
    product_url?: string
  }
  isLiked: boolean
  onToggleLike: () => void
  onClose: () => void
}

export default function ProductDetailsCard({ shoe, isLiked, onToggleLike, onClose }: ProductDetailsCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Generate a random pickup line for this shoe
  const randomPickupLine = shoePickupLines[Math.floor(Math.random() * shoePickupLines.length)]

  // Mock multiple images for the product
  const productImages = [
    shoe.image,
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ]

  // Format medical conditions for display
  const formattedConditions = shoe.medicalConditions.map((condition) => {
    return condition
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  })

  // Format styles for display
  const formattedStyles = shoe.styles.map((style) => {
    return style.charAt(0).toUpperCase() + style.slice(1)
  })

  // Navigate through product images
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  // Mock product URL
  const productUrl = `https://solemate.com/shoes/${shoe.id}`

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white border-b">
        <button
          onClick={onClose}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close details"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h2 className="text-lg font-semibold">Shoe Details</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close details">
          <X size={20} />
        </button>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Tinder-style pickup line */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <MessageCircle className="text-pink-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-pink-700 mb-1">This shoe says:</p>
              <p className="italic text-gray-700">{randomPickupLine}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={productImages[currentImageIndex] || "/placeholder.svg"}
                alt={shoe.name}
                fill
                className="object-cover"
              />

              {/* Image navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnail images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "relative w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0",
                    currentImageIndex === index ? "border-black" : "border-transparent",
                  )}
                >
                  <Image src={img || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{shoe.name}</h1>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.floor(shoe.rating) ? "fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm ml-2">
                  {shoe.rating} ({shoe.reviews} reviews)
                </span>
              </div>
              <p className="text-2xl font-bold mt-2">${shoe.price}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {shoe.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full">
                  {tag}
                </span>
              ))}
              {shoe.gender === "men" && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full">Men's</span>
              )}
              {shoe.gender === "women" && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 text-sm rounded-full">Women's</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-gray-700">{shoe.description}</p>
            </div>

            {/* Styles */}
            <div>
              <h3 className="font-medium mb-1">Styles</h3>
              <div className="flex flex-wrap gap-2">
                {formattedStyles.map((style, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full">
                    {style}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical Benefits */}
            <div>
              <h3 className="font-medium mb-1">Best For</h3>
              <div className="flex flex-wrap gap-2">
                {formattedConditions.map((condition, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Product URL */}
            <div>
              <h3 className="font-medium mb-1">Product Link</h3>
              <a
                href={shoe.product_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                View on retailer's website <ExternalLink size={14} className="ml-1" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <Button
                variant="outline"
                className={cn("w-full border-gray-300", isLiked && "bg-pink-50 border-pink-200 text-pink-700")}
                onClick={onToggleLike}
              >
                <Heart size={18} className={cn("mr-2", isLiked && "fill-pink-700")} />
                {isLiked ? "Saved to Favorites" : "Save to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


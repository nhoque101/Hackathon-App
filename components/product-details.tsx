"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Heart, ShoppingBag, X, ChevronLeft, ChevronRight, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ProductDetailsProps {
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
  isLiked: boolean
  onToggleLike: () => void
  onClose: () => void
}

export default function ProductDetails({ shoe, isLiked, onToggleLike, onClose }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedWidth, setSelectedWidth] = useState<string>("medium")
  const [selectedColor, setSelectedColor] = useState<string>("black")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Mock multiple images for the product
  const productImages = [
    shoe.image,
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ]

  // Mock sizes
  const sizes = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"]

  // Mock widths
  const widths = [
    { id: "narrow", label: "Narrow" },
    { id: "medium", label: "Medium" },
    { id: "wide", label: "Wide" },
    { id: "extra-wide", label: "Extra Wide" },
  ]

  // Mock colors
  const colors = [
    { id: "black", label: "Black", hex: "#000000" },
    { id: "brown", label: "Brown", hex: "#964B00" },
    { id: "navy", label: "Navy", hex: "#000080" },
    { id: "gray", label: "Gray", hex: "#808080" },
  ]

  // Format medical conditions for display
  const formattedConditions = shoe.medicalConditions.map((condition) => {
    return condition
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  })

  // Navigate through product images
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold">Product Details</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
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
            <p className="text-gray-700">{shoe.description}</p>

            {/* Medical Benefits */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 flex items-center">
                <Info size={16} className="mr-1" /> Medical Benefits
              </h3>
              <ul className="mt-2 space-y-1">
                {formattedConditions.map((condition, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={16} className="text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Recommended for {condition}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Select Size</h3>
                <button className="text-sm text-gray-600 underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={cn(
                      "border rounded-md py-2 text-sm",
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400",
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Width Selection */}
            <div>
              <h3 className="font-medium">Select Width</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {widths.map((width) => (
                  <button
                    key={width.id}
                    className={cn(
                      "border rounded-md px-3 py-1 text-sm",
                      selectedWidth === width.id
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400",
                    )}
                    onClick={() => setSelectedWidth(width.id)}
                  >
                    {width.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-medium">Select Color</h3>
              <div className="flex gap-3 mt-2">
                {colors.map((color) => (
                  <TooltipProvider key={color.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "w-8 h-8 rounded-full border-2",
                            selectedColor === color.id ? "border-black" : "border-transparent",
                          )}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setSelectedColor(color.id)}
                          aria-label={`Select ${color.label} color`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{color.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className={cn("flex-1 border-gray-300", isLiked && "bg-pink-50 border-pink-200 text-pink-700")}
                onClick={onToggleLike}
              >
                <Heart size={18} className={cn("mr-2", isLiked && "fill-pink-700")} />
                {isLiked ? "Saved" : "Save"}
              </Button>
              <Button className="flex-1 bg-black text-white">
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="p-4 md:p-6 border-t">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Product Details</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• Upper Material: Premium synthetic leather</li>
                    <li>• Sole: Rubber with enhanced grip</li>
                    <li>• Insole: Memory foam with arch support</li>
                    <li>• Closure: Traditional lace-up</li>
                    <li>• Weight: Approximately 10 oz per shoe</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Care Instructions</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    Clean with a damp cloth. Allow to air dry away from direct heat. Do not machine wash or tumble dry.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Key Features</h3>
                  <ul className="mt-2 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Enhanced Arch Support</strong> - Provides stability and reduces strain on the plantar
                        fascia
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Cushioned Heel</strong> - Extra padding in the heel area absorbs impact and reduces
                        pressure
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Wider Toe Box</strong> - Accommodates foot conditions and reduces pressure on toes
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Removable Insole</strong> - Can be replaced with custom orthotics if needed
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={star <= Math.floor(shoe.rating) ? "fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium ml-2
                  />
                  <span className="text-lg font-medium ml-2\">{shoe.rating} out of 5</span>
                </div>
                <p className="text-gray-600">Based on {shoe.reviews} reviews</p>

                {/* Sample reviews */}
                <div className="space-y-4 mt-6">
                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">James W.</h4>
                        <div className="flex items-center text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} className={star <= 5 ? "fill-current" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">2 weeks ago</span>
                    </div>
                    <p className="mt-2 text-sm">
                      These shoes have been a game-changer for my plantar fasciitis. The arch support is excellent and
                      the cushioning makes walking comfortable again.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Sarah T.</h4>
                        <div className="flex items-center text-yellow-500">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} size={14} className={star <= 4 ? "fill-current" : "text-gray-300"} />
                          ))}
                          <Star key={5} size={14} className="text-gray-300" />
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">1 month ago</span>
                    </div>
                    <p className="mt-2 text-sm">
                      Very comfortable and supportive. I took off one star because they run a bit narrow, but the wide
                      option worked well for me. Great for long walks!
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Michael R.</h4>
                        <div className="flex items-center text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} className={star <= 5 ? "fill-current" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">2 months ago</span>
                    </div>
                    <p className="mt-2 text-sm">
                      I've tried many shoes for my foot pain, and these are by far the best. The extra cushioning and
                      support have made a huge difference in my daily comfort.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        <div className="p-4 md:p-6 border-t">
          <h3 className="font-medium mb-4">You Might Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border rounded-lg overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Related product"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h4 className="font-medium text-sm truncate">Similar Shoe Style</h4>
                  <p className="text-sm font-bold">$149</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


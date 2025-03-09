"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ArrowDown, Heart, ChevronRight, Star, X, ChevronDown, Info, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import SwipeInterface from "./swipe-interface"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Demo shoe data
const demoShoes = [
  {
    id: 1,
    name: "Classic Oxford Shoes",
    price: 195,
    rating: 4,
    reviews: 128,
    image: "https://images-ext-1.discordapp.net/external/d-BZ-E683EtNJWSO_GJRcVeAXAat826COGqXS1beqic/%3Fv%3D1734633202%26width%3D1200/https/www.orthofeet.com/cdn/shop/files/90023-Blaire-Chocolate-Angle_5ee241fc-a4fd-4047-9dbd-44a09eef6959.jpg?width=1822&height=1288",
    tags: ["Men", "Formal"],
    description: "Perfect for any occasion",
  },
  {
    id: 2,
    name: "Designer Stiletto Heels",
    price: 245,
    rating: 5,
    reviews: 86,
    image: "https://images-ext-1.discordapp.net/external/pLRWgpvviASRuGoALMFwuhPlwL_aEYuPs7HRYXazYkc/%3Fv%3D1728332909%26width%3D1200/https/www.orthofeet.com/cdn/shop/files/80247-Eva-Merlot-Angle.jpg?width=1822&height=1288",
    tags: ["Women", "Formal"],
    description: "Elegance in every step",
  },
  {
    id: 3,
    name: "Premium Running Shoes",
    price: 180,
    rating: 4,
    reviews: 210,
    image: "https://images-ext-1.discordapp.net/external/4pnG-oUurBzGC491TAMCkL-VUfgQjGqSqZ2BIIoRwCI/%3Fv%3D1736547187/https/www.orthofeet.com/cdn/shop/files/681-Granite-Black-Angle_1242x1674.jpg?width=1822&height=1288",
    tags: ["Athletic", "Unisex"],
    description: "Performance and style",
  },
  {
    id: 4,
    name: "Casual Leather Loafers",
    price: 165,
    rating: 4,
    reviews: 94,
    image: "https://images-ext-1.discordapp.net/external/mxkWKpIm1847J0QseFMXyc2FTCHdWNFywWDvg7Fcjh8/%3Fv%3D1702513025/https/www.orthofeet.com/cdn/shop/files/80016-Kita-Black-Black-Angle_68449432-c6bc-44b3-bba7-ad28050d39a3_1242x1674.jpg?width=1822&height=1288",
    tags: ["Men", "Casual"],
    description: "Comfort meets sophistication",
  },
  {
    id: 5,
    name: "Platform Sandals",
    price: 135,
    rating: 3,
    reviews: 67,
    image: "https://images-ext-1.discordapp.net/external/o0WIu7xfITHUpy66qadB8W9YUp-eQg0xTRN7kz-ficE/%3Fv%3D1726506120%26width%3D1280/https/cdn.shopify.com/s/files/1/0946/7630/files/488-Hunter-Black-Angle.jpg?width=1822&height=1288",
    tags: ["Women", "Casual"],
    description: "Stand tall in style",
  },
]

// Medical conditions with descriptions
const conditions = [
  {
    id: "no-conditions",
    name: "No Conditions",
    description: "Browse all shoes without specific medical requirements",
  },
  {
    id: "achilles-tendonitis",
    name: "Achilles Tendonitis",
    description: "Inflammation of the Achilles tendon. Requires shoes with good heel support and cushioning.",
  },
  {
    id: "arthritis",
    name: "Arthritis",
    description: "Joint inflammation requiring flexible, cushioned shoes with good arch support.",
  },
  {
    id: "back-pain",
    name: "Back Pain",
    description: "Shoes with proper shock absorption and support to help alleviate back pain.",
  },
  {
    id: "ball-of-foot-pain",
    name: "Ball of Foot Pain",
    description: "Metatarsalgia requiring shoes with proper cushioning in the forefoot area.",
  },
  {
    id: "bunions",
    name: "Bunions",
    description: "Requires wider toe box and soft, flexible materials to reduce pressure.",
  },
  {
    id: "diabetes",
    name: "Diabetes",
    description: "Diabetic-friendly shoes with extra depth and protective features.",
  },
  {
    id: "edema",
    name: "Edema",
    description: "Swelling of feet requiring adjustable, wider fitting shoes.",
  },
  {
    id: "flat-feet",
    name: "Flat Feet",
    description: "Requires arch support and stability features to prevent overpronation.",
  },
  {
    id: "foot-pain",
    name: "Foot Pain",
    description: "General foot pain requiring cushioned, supportive footwear.",
  },
  {
    id: "hammer-toes",
    name: "Hammer Toes",
    description: "Requires higher toe box and flexible materials to accommodate toe deformity.",
  },
  {
    id: "mortons-neuroma",
    name: "Morton's Neuroma",
    description: "Requires wider toe box and metatarsal support to relieve nerve pressure.",
  },
  {
    id: "neuropathy",
    name: "Neuropathy",
    description: "Requires cushioning and protective features for reduced sensation in feet.",
  },
  {
    id: "plantar-fasciitis",
    name: "Plantar Fasciitis",
    description: "Requires arch support and heel cushioning to reduce plantar fascia strain.",
  },
]

// Shoe styles
const styles = [
  { id: "all", name: "All Styles" },
  { id: "athletic", name: "Athletic/Sneakers" },
  { id: "boots", name: "Boots" },
  { id: "casual", name: "Casual" },
  { id: "dress", name: "Dress" },
  { id: "sandal", name: "Sandal" },
  { id: "slippers", name: "Slippers" },
]

export default function SoleMateHero() {
  const searchSectionRef = useRef<HTMLDivElement>(null)
  const [priceRange, setPriceRange] = useState(300)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState("")
  const [showSwipeHint, setShowSwipeHint] = useState(true)

  // New state for medical search
  const [selectedCondition, setSelectedCondition] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [selectedGender, setSelectedGender] = useState("")

  // State for the swipe interface dialog
  const [showSwipeInterface, setShowSwipeInterface] = useState(false)

  // Controls for the card animation
  const controls = useAnimation()

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Hide swipe hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

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
        transition: { duration: 0.5 },
      })
    }
  }

  // Move to next card
  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % demoShoes.length)
    controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0 },
    })
  }

  // Handle button clicks
  const handleLike = () => {
    controls
      .start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.5 },
      })
      .then(() => {
        setDirection("right")
        nextCard()
      })
  }

  const handleDislike = () => {
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

  // Current shoe
  const currentShoe = demoShoes[currentIndex]

  return (
    <div className="font-sans min-h-screen text-black overflow-hidden pt-16">
      {/* Hero Section with Men/Women Background */}
      <div className="relative h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-4 py-4">
        {/* Background Image - Men on one side, Women on the other */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full relative bg-gradient-to-br from-solemate/90 to-solemate/40">
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="w-1/2 h-full relative bg-gradient-to-bl from-solemate/80 to-solemate/30">
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="text-center relative z-10 max-w-2xl mt-8 md:mt-16 px-4">
          <h1 className="text-3xl md:text-6xl font-bold mb-2 text-white">
            Find Your Perfect <span className="font-bold">SoleMate</span>
          </h1>
          <p className="text-base md:text-xl mb-4 text-white">
            Swipe right on shoes that speak to your sole. No commitment, just pure shoe discovery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              onClick={scrollToSearch}
              className="bg-white text-black px-4 md:px-6 py-3 md:py-6 font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition"
            >
              Start Swiping
            </Button>
            <p className="text-white text-sm md:text-base mt-2 sm:mt-0">
              Or try our <span className="font-bold underline">quick demo</span> below
            </p>
          </div>
        </div>

        {/* Swiping Demo - Center of screen */}
        <div className="relative w-full max-w-xs md:max-w-sm mt-4 md:mt-8 flex flex-col items-center">
          {/* Swipe hint overlay */}
          {showSwipeHint && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg">
              <div className="text-center text-white p-4">
                <p className="font-medium">Swipe cards to try the demo!</p>
                <p className="text-sm mt-1 text-white/80">Swipe right to like, left to pass</p>
              </div>
            </div>
          )}

          {/* Main card - current shoe */}
          <motion.div
            className="relative bg-white shadow-2xl p-3 mx-auto max-w-sm z-30 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ x: 0, opacity: 1 }}
          >
            <div className="bg-gray-100 h-40 overflow-hidden mb-2 relative">
              <Image
                src={currentShoe.image || "/placeholder.svg"}
                alt={currentShoe.name}
                width={400}
                height={350}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white font-medium italic text-sm">"{currentShoe.description}"</p>
              </div>
            </div>
            <div className="text-black text-left">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{currentShoe.name}</h3>
                <span className="font-bold">${currentShoe.price}</span>
              </div>
              <div className="flex items-center text-yellow-500 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= currentShoe.rating ? "fill-current" : "text-gray-300"}
                  />
                ))}
                <span className="text-gray-600 text-xs ml-1">({currentShoe.reviews})</span>
              </div>
              <p className="text-gray-600 flex flex-wrap gap-1 text-xs">
                {currentShoe.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-2 py-0.5 border border-gray-200">
                    {tag}
                  </span>
                ))}
              </p>
            </div>

            {/* Swipe indicators */}
            {direction === "left" && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold transform -rotate-12">
                PASS
              </div>
            )}
            {direction === "right" && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold transform rotate-12">
                LIKE
              </div>
            )}
          </motion.div>

          {/* Background cards - static */}
          <div className="absolute top-4 -left-4 bg-white shadow-xl p-3 rotate-[-6deg] max-w-sm z-20 opacity-80">
            <div className="h-40 bg-gray-100 relative">
              <Image
                src={demoShoes[(currentIndex + 1) % demoShoes.length].image || "/placeholder.svg"}
                alt="Next shoe"
                width={400}
                height={350}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-black mt-2">
              <h3 className="font-bold text-sm">{demoShoes[(currentIndex + 1) % demoShoes.length].name}</h3>
            </div>
          </div>

          <div className="absolute top-6 -right-4 bg-white shadow-xl p-3 rotate-12 max-w-sm z-10 opacity-60">
            <div className="h-40 bg-gray-100 relative">
              <Image
                src={demoShoes[(currentIndex + 2) % demoShoes.length].image || "/placeholder.svg"}
                alt="Future shoe"
                width={400}
                height={350}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Swiping Controls - Removed Super Like button */}
          <div className="flex justify-center mt-6 gap-8">
            <button
              onClick={handleDislike}
              className="bg-white text-red-500 rounded-full p-3 shadow-lg transform hover:scale-110 transition border border-gray-200"
            >
              <X size={24} />
            </button>
            <button
              onClick={handleLike}
              className="bg-black text-white rounded-full p-3 shadow-lg transform hover:scale-110 transition"
            >
              <Heart size={24} />
            </button>
          </div>

          {/* Demo indicator */}
          <div className="mt-3 text-white text-xs text-center bg-black/50 px-3 py-1 rounded-full">
            Demo Mode • Scroll down for full features
          </div>
        </div>

        {/* Bottom section with arrow */}
        <div className="w-full flex flex-col items-center mt-2">
          <div className="animate-bounce mt-2">
            <ArrowDown size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Search Section - Updated with Medical Condition Search */}
      <div ref={searchSectionRef} className="py-10 md:py-16 bg-white px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Main Search Controls - Gender, Medical Condition, Style */}
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Gender - Now first */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="all">All</option>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                </select>
                <ChevronDown className="absolute right-3 bottom-3 text-gray-500" size={20} />
              </div>

              {/* Medical Condition - Now second */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop By Condition</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  <option value="">Select Condition</option>
                  {conditions.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 bottom-3 text-gray-500" size={20} />

                {/* Tooltip for selected condition */}
                {selectedCondition && (
                  <div className="mt-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm text-gray-500 cursor-help">
                          <Info size={14} className="mr-1" />
                          <span>What does this mean?</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{conditions.find((c) => c.id === selectedCondition)?.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Style - Now third */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Style</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  <option value="">Select Style</option>
                  {styles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 bottom-3 text-gray-500" size={20} />
              </div>
            </div>
          </TooltipProvider>

          {/* Price Range */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <span className="text-sm font-medium">${priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$500</span>
            </div>
          </div>

          {/* Advanced Filters Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full mb-4 border-black text-black py-2 font-medium hover:bg-gray-100"
              >
                <SlidersHorizontal size={18} className="mr-2" />
                More Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>Refine your search with additional options</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                {/* Width */}
                <div>
                  <label className="block text-sm font-medium mb-2">Width</label>
                  <select className="w-full p-3 bg-white border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option>Select Width</option>
                    <option>Narrow</option>
                    <option>Medium</option>
                    <option>Wide</option>
                    <option>Extra Wide</option>
                  </select>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium mb-2">Brands</label>
                  <select className="w-full p-3 bg-white border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option>Select Brands</option>
                    <option>Nike</option>
                    <option>Adidas</option>
                    <option>New Balance</option>
                    <option>Brooks</option>
                  </select>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">Special Features</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Orthopedic
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Extra Cushioning
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Arch Support
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Removable Insole
                    </label>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              className="flex-1 bg-black text-white py-3 md:py-4 px-4 md:px-6 font-bold text-base md:text-lg hover:bg-gray-800 transition flex items-center justify-center"
              onClick={() => setShowSwipeInterface(true)}
            >
              <Heart size={18} className="mr-2" />
              Find My Matches
            </Button>
            <Button
              className="flex-1 bg-white text-black py-3 md:py-4 px-4 md:px-6 font-bold text-base md:text-lg hover:bg-gray-100 transition flex items-center justify-center border border-black"
              onClick={() => setShowSwipeInterface(true)}
            >
              <ChevronRight size={18} className="mr-2" />
              Try Swipe Mode
            </Button>
          </div>

          {/* Promo Banner */}
          <div className="mt-8 md:mt-12 bg-gray-50 p-4 md:p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Image
                  src="/placeholder.svg?height=120&width=120"
                  alt="Special offer"
                  width={120}
                  height={120}
                  className="border border-gray-200"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Limited Time Offer</h3>
                <p className="text-gray-600 mb-2">
                  Create an account today and get personalized recommendations based on your previous swipes!
                </p>
                <Button className="bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 transition">
                  Sign Up Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Interface Dialog */}
      <Dialog open={showSwipeInterface} onOpenChange={setShowSwipeInterface}>
        <DialogContent className="max-w-5xl p-0 h-[90vh]">
          <SwipeInterface
            selectedCondition={selectedCondition}
            selectedStyle={selectedStyle}
            selectedGender={selectedGender}
            onClose={() => setShowSwipeInterface(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}


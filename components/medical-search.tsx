"use client"

import { useState } from "react"
import { Search, Info, SlidersHorizontal, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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

export default function MedicalSearch() {
  const [selectedCondition, setSelectedCondition] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Shoes for Your Needs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our advanced search helps you find the perfect shoes that address your specific foot conditions while
            matching your style preferences.
          </p>
        </div>

        {/* Main Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TooltipProvider>
            <div className="relative">
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-full h-[52px]">
                  <SelectValue placeholder="Select Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Medical Conditions</SelectLabel>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.id}>
                        <div className="flex items-center">
                          <span>{condition.name}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info size={16} className="ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{condition.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-full h-[52px]">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Shoe Styles</SelectLabel>
                    {styles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-full h-[52px]">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </TooltipProvider>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button className="flex-1 max-w-md bg-black text-white py-6 text-lg font-medium hover:bg-gray-800">
            <Search size={20} className="mr-2" />
            Find My Perfect Shoes
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 max-w-md border-black text-black py-6 text-lg font-medium hover:bg-gray-100"
              >
                <SlidersHorizontal size={20} className="mr-2" />
                More Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>Refine your search with additional options</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Min" className="w-full p-2 border rounded-md" />
                    <input type="number" placeholder="Max" className="w-full p-2 border rounded-md" />
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium mb-2">Brands</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nike">Nike</SelectItem>
                      <SelectItem value="adidas">Adidas</SelectItem>
                      <SelectItem value="newbalance">New Balance</SelectItem>
                      <SelectItem value="brooks">Brooks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Width */}
                <div>
                  <label className="block text-sm font-medium mb-2">Width</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrow">Narrow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                      <SelectItem value="extra-wide">Extra Wide</SelectItem>
                    </SelectContent>
                  </Select>
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
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="p-6 h-auto flex flex-col items-center text-center">
            <ShoppingBag className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Shop By Category</span>
          </Button>
          <Button variant="outline" className="p-6 h-auto flex flex-col items-center text-center">
            <Heart className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Saved Items</span>
          </Button>
          <Button variant="outline" className="p-6 h-auto flex flex-col items-center text-center">
            <Info className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Size Guide</span>
          </Button>
          <Button variant="outline" className="p-6 h-auto flex flex-col items-center text-center">
            <Search className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Browse All</span>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Need help finding the right shoes? <button className="text-black underline">Chat with our shoe expert</button>
        </div>
      </div>
    </div>
  )
}


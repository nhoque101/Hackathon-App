"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronRight, Heart } from "lucide-react"
import SwipeInterface from "@/components/swipe-interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { shoeData } from "@/lib/shoe-data"
import { Slider } from "@/components/ui/slider"

export default function DashboardPage() {
  const [selectedCondition, setSelectedCondition] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [showSwipeInterface, setShowSwipeInterface] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Shoe Match</h1>
        <p className="text-gray-600">Set your preferences and start swiping to discover shoes that match your needs.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Shoe Preferences</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Medical Condition - EXACTLY 5 conditions */}
          <div className="space-y-2">
            <Label htmlFor="condition">Medical Condition</Label>
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Condition</SelectItem>
                <SelectItem value="diabetic-friendly">Diabetic-Friendly</SelectItem>
                <SelectItem value="plantar-fasciitis">Plantar Fasciitis</SelectItem>
                <SelectItem value="foot-pain">Foot Pain</SelectItem>
                <SelectItem value="wide-foot">Wide Foot</SelectItem>
                <SelectItem value="orthopedic">Orthopedic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger id="style">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Style</SelectItem>
                {shoeData.styles.map((style) => (
                  <SelectItem key={style.id} value={style.name.toLowerCase()}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label>Price Range</Label>
            <span className="text-sm font-medium">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={[0, 200]}
            max={300}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$300</span>
          </div>
        </div>

        <Button
          className="w-full bg-solemate text-white hover:bg-solemate/90 transition-all"
          onClick={() => setShowSwipeInterface(true)}
        >
          <Heart className="mr-2 h-5 w-5" />
          Start Swiping
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Matches</h2>
          <Button variant="outline" asChild>
            <a href="/dashboard/matches">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="text-center py-8 text-gray-500">
          <p>Start swiping to see your matches here!</p>
        </div>
      </div>

      {/* Swipe Interface Dialog */}
      <Dialog open={showSwipeInterface} onOpenChange={setShowSwipeInterface}>
        <DialogContent className="max-w-5xl p-0 h-[90vh]">
          <SwipeInterface
            selectedCondition={selectedCondition}
            selectedStyle={selectedStyle}
            selectedGender={selectedGender}
            priceRange={priceRange}
            onClose={() => setShowSwipeInterface(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}


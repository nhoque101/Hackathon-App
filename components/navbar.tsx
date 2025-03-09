"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-sm shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-3 md:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="https://media.discordapp.net/attachments/1343028644733386804/1348251590867554428/IMG_1876-removebg.png?ex=67cec8a4&is=67cd7724&hm=4e0b0490cf683ada23af136079149d3019e57d95ae17055539fe4d4398e48a1a&=&width=2356&height=1288"
            alt="SoleMate Logo"
            width={180}
            height={60}
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#"
            className={`font-medium ${isScrolled ? "text-black hover:text-gray-700" : "text-black hover:text-gray-700"} transition`}
          >
            Men
          </Link>
          <Link
            href="#"
            className={`font-medium ${isScrolled ? "text-black hover:text-gray-700" : "text-black hover:text-gray-700"} transition`}
          >
            Women
          </Link>
          <Link
            href="#"
            className={`font-medium ${isScrolled ? "text-black hover:text-gray-700" : "text-black hover:text-gray-700"} transition`}
          >
            About
          </Link>
          <Link
            href="#"
            className={`font-medium ${isScrolled ? "text-black hover:text-gray-700" : "text-black hover:text-gray-700"} transition`}
          >
            Support
          </Link>
          <Button
            onClick={() => router.push("/")}
            className={`px-6 bg-[#00B2A9] text-white hover:bg-[#00B2A9]/90 transition-all`}
          >
            Try Now
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled ? "text-black" : "text-black"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled ? "text-black" : "text-black"}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm text-black py-6 px-4 shadow-lg">
          <nav className="flex flex-col space-y-5">
            <Link href="#" className="font-medium hover:text-gray-700 py-1" onClick={() => setIsMenuOpen(false)}>
              Men
            </Link>
            <Link href="#" className="font-medium hover:text-gray-700 py-1" onClick={() => setIsMenuOpen(false)}>
              Women
            </Link>
            <Link href="#" className="font-medium hover:text-gray-700 py-1" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="#" className="font-medium hover:text-gray-700 py-1" onClick={() => setIsMenuOpen(false)}>
              Support
            </Link>
            <Button
              className="bg-[#00B2A9] text-white hover:bg-[#00B2A9]/90 w-full py-3 mt-2 transition-all"
              onClick={() => {
                router.push("/")
                setIsMenuOpen(false)
              }}
            >
              Try Now
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}


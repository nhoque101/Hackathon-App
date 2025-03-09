"use client"
import Link from "next/link"
import SoleMateHero from "@/components/solemate-hero"
import Navbar from "@/components/navbar"
import { useRef } from "react"

export default function HomePage() {
  const searchSectionRef = useRef(null)

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <SoleMateHero />

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-solemate/5 text-gray-800 py-10 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-center mb-4 justify-center md:justify-start">
                <span className="text-xl md:text-2xl font-bold">SoleMate</span>
              </div>
              <p className="text-gray-600 max-w-xs mx-auto md:mx-0">
                Swipe right on shoes that speak to your sole. No commitment, just pure shoe discovery.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center md:text-left">
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <Link href="#" className="hover:text-black">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Careers</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <Link href="#" className="hover:text-black">
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black">
                      Team
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Social</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <Link href="#" className="hover:text-black">
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black">
                      TikTok
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black">
                      YouTube
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <Link href="#" className="hover:text-black">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-black">
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 md:pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} SoleMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


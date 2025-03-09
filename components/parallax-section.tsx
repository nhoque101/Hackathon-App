"use client"

import { useEffect, useState, useRef } from "react"

interface ParallaxSectionProps {
  backgroundImage: string
  speed?: number
  overlay?: string
}

export default function ParallaxSection({ backgroundImage, speed = 0.5, overlay }: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0

      if (isInView) {
        setIsVisible(true)
        const scrollPosition = window.scrollY
        const sectionTop = rect.top + scrollPosition
        const relativeScroll = scrollPosition - sectionTop
        setOffsetY(relativeScroll * speed)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className="w-full h-full overflow-hidden">
      <div
        className="relative w-full h-full bg-gradient-to-r from-solemate/20 to-solemate/60"
        style={{
          transform: isVisible ? `translateY(${offsetY}px)` : undefined,
          transition: "transform 0.1s ease-out",
        }}
      >
        {overlay && <div className={`absolute inset-0 ${overlay}`}></div>}
      </div>
    </div>
  )
}


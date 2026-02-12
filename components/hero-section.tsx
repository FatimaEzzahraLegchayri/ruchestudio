"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const images = [
  "/images/hero.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-3.jpg",
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              index === currentIndex ? "opacity-60 scale-105" : "opacity-0 scale-100"
            } transition-transform duration-[7000ms]`}
          >
            <Image
              src={src}
              alt="Atelier ambiance"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/80 mb-6 sm:mb-8 animate-fade-in">
          Bienvenue dans la Ruche Studio
        </p>

        {/* Mobile: text-4xl (cleaner wrap)
          Tablet: text-5xl
          Desktop: text-7xl
        */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.2] sm:leading-[1.1] mb-6 sm:mb-8 text-balance drop-shadow-2xl">
          Ce n'est pas qu'un atelier.
          <br className="hidden sm:block" />
          <span className="italic font-light opacity-90 block sm:inline mt-2 sm:mt-0"> C’est un temps pour soi.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-2xl text-white/90 max-w-xl sm:max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light italic">
          Une pause créative. Une expérience. Un souvenir à emporter.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-white text-black hover:bg-white/90 px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg rounded-md transition-all duration-300 transform hover:scale-105"
          >
            <Link href="#ateliers">Découvrir nos ateliers</Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg rounded-md bg-transparent transition-all duration-300"
          >
            <Link href="#pause-art">La Pause d'Art</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on very small screens to avoid clutter */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden xs:flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
        <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  )
}
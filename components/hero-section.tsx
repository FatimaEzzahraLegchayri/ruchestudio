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
    }, 5000) // Change image every 5 seconds
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              index === currentIndex ? "opacity-60 scale-105" : "opacity-0 scale-100"
            } transition-transform duration-[7000ms]`} // Slow zoom effect
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
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/80 mb-8 animate-fade-in">
          Bienvenue dans la Ruche
        </p>

        <h1 className="font-serif text-5xl md:text-4xl lg:text-7xl text-white leading-[1.1] mb-8 text-balance drop-shadow-2xl">
          Ce n'est pas qu'un atelier.
          <br />
          <span className="italic font-light opacity-90">C’est un temps pour soi.</span>
        </h1>

        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-light italic">
          Une pause créative. Une expérience. Un souvenir à emporter.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-10 py-7 text-lg rounded-md transition-all duration-300 transform hover:scale-105"
          >
            <Link href="#ateliers">Découvrir nos ateliers</Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black px-10 py-7 text-lg rounded-md bg-transparent transition-all duration-300"
          >
            <Link href="#pause-art">La Pause d'Art</Link>
          </Button>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  )
}
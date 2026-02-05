"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="font-serif text-2xl tracking-wide text-foreground">
            La Ruche Studio
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="#ateliers"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors"
            >
              Ateliers
            </Link>
            <Link
              href="#pause-art"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors"
            >
              La Pause d'Art
            </Link>
            <Link
              href="#entreprises"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors"
            >
              Entreprises
            </Link>
            <Link
              href="#blog"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="#ateliers">Réserver une place</Link>
            </Button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="#ateliers"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ateliers
            </Link>
            <Link
              href="#pause-art"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              La Pause d'Art
            </Link>
            <Link
              href="#entreprises"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Entreprises
            </Link>
            <Link
              href="#blog"
              className="text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
              <Link href="#ateliers" onClick={() => setIsMobileMenuOpen(false)}>
                Réserver une place
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

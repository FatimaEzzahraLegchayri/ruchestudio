import React from "react"
import { Header } from "@/components/header" // Update this path to your Header component
import { Footer } from "@/components/footer"     // Update this path to your Footer component

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* The Navigation is placed at the top. 
         If your home page header is transparent, 
         ensure your Navigation component handles 
         background colors based on the route. 
      */}
      <Header />

      {/* 'flex-1' ensures the main content stretches 
         to push the footer to the bottom of the page. 
      */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}
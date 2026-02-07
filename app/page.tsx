import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PromiseSection } from "@/components/promise-section"
import { WorkshopsSection } from "@/components/workshops-section"
import { PauseArtSection } from "@/components/pause-art-section"
import { KhaliaSection } from "@/components/khalia-section"
import { FounderSection } from "@/components/founder-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CorporateSection } from "@/components/corporate-section"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"
import { StickyCta } from "@/components/sticky-cta"
import { GallerySection } from "@/components/gallery"
 

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PromiseSection />
        <WorkshopsSection />
        <PauseArtSection />
        <KhaliaSection />
        <GallerySection />
        <FounderSection />
        <TestimonialsSection />
        <CorporateSection />
        <BlogSection />
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}

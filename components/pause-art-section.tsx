'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PauseArtModal } from "@/components/workShop/PauseArtModal"
import { getPublishedPauseArt } from "@/lib/service/workshopService" 

export function PauseArtSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pauseArt, setPauseArt] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getPublishedPauseArt()
        setPauseArt(data)
      } catch (error) {
        console.error("Failed to fetch Pause Art:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [])

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Handle the Empty State (No published Pause Art)
  if (!pauseArt) {
    return (
      <section id="pause-art" className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Expérience Exclusive
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
            La Pause d'Art se prépare...
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Nous concoctons actuellement notre prochaine journée bien-être et créativité. 
            Revenez bientôt pour découvrir le prochain thème et réserver votre parenthèse enchantée.
          </p>
          <Button variant="outline" className="rounded-full" asChild>
            <a href="#contact">Me tenir au courant</a>
          </Button>
        </div>
      </section>
    )
  }

  const availableSeats = pauseArt.capacity - (pauseArt.bookedSeats || 0)

  return (
    <section id="pause-art" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src={pauseArt.image || "/images/workshop-fabric.jpg"}
                alt={pauseArt.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-lg hidden lg:block">
              <p className="font-serif text-3xl">{pauseArt.price} DH</p>
              <p className="text-sm opacity-90">journée complète</p>
            </div>
          </div>

          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Expérience Exclusive
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 text-balance">
              {pauseArt.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-4 italic">
              Une journée 100% féminine pour se reconnecter à soi
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {pauseArt.description}
            </p>

            <div className="space-y-3 mb-8">
              {pauseArt.todos?.map((feature: string) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                onClick={() => setIsModalOpen(true)}
                disabled={availableSeats <= 0}
              >
                {availableSeats <= 0 ? "Complet" : "Réserver ma journée"}
              </Button>
              <div className="lg:hidden">
                <p className="font-serif text-2xl text-foreground">{pauseArt.price} DH</p>
                <p className="text-sm text-muted-foreground">journée complète</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Prochaine date : <span className="text-foreground font-medium">{pauseArt.date}</span>
              <span className="mx-2">|</span>
              {pauseArt.startTime} - {pauseArt.endTime}
              <span className="mx-2">|</span>
              {availableSeats} places restantes
            </p>
          </div>
        </div>
      </div>

      <PauseArtModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        pauseArtId={pauseArt.id}
        onSuccess={() => {
          // It's cleaner to use fetchEvent() here instead of reload, 
          // but I kept your logic to ensure consistency with your setup.
          window.location.reload() 
        }}
      />
    </section>
  )
}
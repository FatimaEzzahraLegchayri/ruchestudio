'use client'

import { useEffect, useState } from "react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Loader2, CalendarDays } from "lucide-react"
import { getWorkshops } from "@/lib/service/workshopService"
import { BookingModal } from "@/components/workShop/BookingModal"
import { format } from "date-fns"

interface Workshop {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  category: string
  capacity: number
  bookedSeats: number
  price: number
  status: string
  image?: string | null
}

export function WorkshopsSection() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)

  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const data = await getWorkshops()
      // Fix: Corrected 'publishegd' typo to 'published'
      const publishedWorkshops = (data as Workshop[]).filter(
        (w) => w.status === 'published'
      )
      setWorkshops(publishedWorkshops)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshops')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWorkshops() }, [])

  const handleBookNow = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsBookingModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE d MMMM')
    } catch { return dateString }
  }

  if (loading) {
    return (
      <div className="py-32 flex justify-center bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section id="ateliers" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Nos Ateliers
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 text-balance">
            Un moment pour soi,
            <br />
            <span className="italic">un souvenir à emporter</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chaque atelier est une invitation à la créativité. Aucune expérience requise,
            juste l'envie de créer et de partager un moment unique.
          </p>
        </div>

        {/* Dynamic Grid / Empty State */}
        {workshops.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 px-6 bg-white/50 rounded-2xl border border-dashed border-muted-foreground/30">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">Aucun atelier disponible</h3>
            <p className="text-muted-foreground">
              Nous préparons actuellement de nouvelles sessions créatives. Revenez très bientôt pour découvrir nos prochaines dates !
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => {
              const seatsLeft = workshop.capacity - (workshop.bookedSeats || 0)
              const isSoldOut = seatsLeft <= 0

              return (
                <Card key={workshop.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={workshop.image || "/images/placeholder.jpg"}
                      alt={workshop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-black hover:bg-white">
                      {workshop.category}
                    </Badge>
                  </div>

                  <CardHeader className="pt-4">
                    <CardTitle className="text-xl font-serif">{workshop.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                      <span>{formatDate(workshop.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {workshop.startTime} {workshop.endTime && `- ${workshop.endTime}`}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <CardDescription className="line-clamp-3 mb-4 text-pretty">
                      {workshop.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase">Places</span>
                        <span className={`text-sm font-medium ${seatsLeft <= 3 && !isSoldOut ? 'text-orange-500' : ''}`}>
                          {isSoldOut ? 'Complet' : `${seatsLeft} restantes`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground uppercase block">Prix</span>
                        <span className="text-lg font-bold text-primary">{workshop.price} DH</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pb-6">
                    <Button 
                      className="w-full rounded-md" 
                      variant={isSoldOut ? "secondary" : "default"}
                      disabled={isSoldOut}
                      onClick={() => handleBookNow(workshop)}
                    >
                      {isSoldOut ? 'Épuisé' : 'Réserver ma place'}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        onSuccess={fetchWorkshops}
        workshop={
          selectedWorkshop
            ? {
                id: selectedWorkshop.id,
                title: selectedWorkshop.title,
                date: selectedWorkshop.date,
                startTime: selectedWorkshop.startTime,
                endTime: selectedWorkshop.endTime,
                price: selectedWorkshop.price,
              }
            : null
        }
      />
    </section>
  )
}
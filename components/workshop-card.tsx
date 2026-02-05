import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WorkshopCardProps {
  image: string
  title: string
  description: string
  category: string
  date: string
  time: string
  duration: string
  totalPlaces: number
  remainingPlaces: number
  price: number
}

export function WorkshopCard({
  image,
  title,
  description,
  category,
  date,
  time,
  duration,
  totalPlaces,
  remainingPlaces,
  price,
}: WorkshopCardProps) {
  const isSoldOut = remainingPlaces === 0
  const isAlmostFull = remainingPlaces <= 3 && remainingPlaces > 0

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs tracking-wide px-3 py-1.5 rounded-full">
            {category}
          </span>
        </div>
        {isAlmostFull && (
          <div className="absolute top-4 right-4">
            <span className="bg-accent text-accent-foreground text-xs tracking-wide px-3 py-1.5 rounded-full">
              Plus que {remainingPlaces} places
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-serif text-xl mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
            <span className="text-border">|</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {remainingPlaces}/{totalPlaces} places disponibles
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-serif text-2xl text-card-foreground">{price}dh</span>
          <Button
            asChild
            disabled={isSoldOut}
            className={`${
              isSoldOut
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            <Link href="#reservation">
              {isSoldOut ? "Complet" : "Réserver ma place"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

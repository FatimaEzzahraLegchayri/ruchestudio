import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-workshop.jpg"
          alt="Atelier créatif"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-background/90 mb-6">
          Bienvenue dans la Ruche
        </p>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background leading-tight mb-8 text-balance">
          Ce n'est pas qu'un atelier.
          <br />
          <span className="italic">C’est un temps pour soi.</span>
        </h1>

        <p className="text-lg md:text-xl text-background/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          Une pause créative. Une expérience. Un souvenir à emporter.
          Rejoignez notre communauté artistique et laissez-vous porter.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-base"
          >
            <Link href="#ateliers">Découvrir nos ateliers</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-background text-background hover:bg-background/10 px-8 py-6 text-base bg-transparent"
          >
            <Link href="#pause-art">La Pause d'Art</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-background/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-background/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}

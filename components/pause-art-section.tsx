import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  "Séance de yoga matinale pour se recentrer",
  "Petit-déjeuner healthy et convivial",
  "Ateliers créatifs guidés (peinture, création)",
  "Déjeuner préparé avec soin",
  "Moments d'échange et de partage",
  "Votre création à emporter",
]

export function PauseArtSection() {
  return (
    <section id="pause-art" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/images/workshop-fabric.jpg"
                alt="La Pause d'Art - Journée bien-être"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-lg hidden lg:block">
              <p className="font-serif text-3xl">400 DH</p>
              <p className="text-sm opacity-90">journée complète</p>
            </div>
          </div>

          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Expérience Exclusive
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 text-balance">
              La Pause d'Art
            </h2>
            <p className="text-lg text-muted-foreground mb-4 italic">
              Une journée 100% féminine pour se reconnecter à soi
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Offrez-vous une parenthèse enchantée loin du quotidien. Entre yoga,
              créativité et moments de partage, vivez une expérience transformatrice
              au sein de la Ruche . Repartez ressourcée, connectée et avec votre
              création personnelle.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((feature) => (
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
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                <Link href="#reservation">Réserver ma journée</Link>
              </Button>
              <div className="lg:hidden">
                <p className="font-serif text-2xl text-foreground">189dh</p>
                <p className="text-sm text-muted-foreground">journée complète</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Prochaine date : <span className="text-foreground font-medium">Samedi 5 Avril</span>
              <span className="mx-2">|</span>
              9h00 - 17h00
              <span className="mx-2">|</span>
              12 places maximum
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

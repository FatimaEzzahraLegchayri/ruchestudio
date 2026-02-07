import Image from "next/image"

export function FounderSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Small elegant label */}
        <span className="block text-xs tracking-[0.3em] uppercase text-muted-foreground mb-12 text-center md:text-left">
          L'histoire
        </span>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          {/* Portrait - 3:4 aspect ratio on left */}
          <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-border/30 shrink-0">
            <Image
              src="/images/founder.jpg"
              alt="Fondatrice de La Ruche Studio"
              fill
              className="object-cover"
            />
          </div>

          {/* Text content on right */}
          <div className="flex flex-col text-center md:text-left">
            <p className="font-serif text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/90">
              La Ruche Studio est née d'une envie simple : créer des espaces où l'on peut ralentir,
              se reconnecter à soi et créer sans pression.
            </p>
            
            <p className="font-serif text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/90 mt-6">
              Chaque atelier est pensé avec soin, comme une pause à partager.
            </p>

            {/* Soft signature-like element */}
            <div className="mt-10 text-muted-foreground text-sm italic">
              — Fondatrice
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

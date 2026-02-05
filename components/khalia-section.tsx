"use client"

import { HoneycombBackground } from "./honeycomb-background"

export function KhaliaSection() {
  const values = [
    { word: "Créativité", description: "L'expression libre, sans jugement" },
    { word: "Lenteur", description: "Le temps de faire, d'être, de respirer" },
    { word: "Présence", description: "L'instant partagé, pleinement vécu" },
    { word: "Communauté", description: "Des liens authentiques qui perdurent" },
  ]

  return (
    <section id="khalia" className="py-32 md:py-40 bg-background relative overflow-hidden">
      {/* Animated honeycomb background */}
      <HoneycombBackground />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Intro */}
        <p className="text-center text-muted-foreground text-lg tracking-wide mb-16">
          Ici, vous ne réservez pas simplement un atelier.
        </p>

        {/* Main Title */}
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center text-foreground mb-8 tracking-tight">
          Vous rejoignez La Ruche Studio.
        </h2>

        {/* Subtle divider */}
        <div className="flex justify-center mb-16">
          <div className="w-12 h-px bg-border" />
        </div>

        {/* Definition */}
        <div className="max-w-2xl mx-auto mb-20">
          <p className="text-center text-foreground/80 text-xl md:text-2xl leading-relaxed font-light">
            Une cellule créative. Un espace de douceur.
            <br />
            Un lieu où les connexions humaines reprennent tout leur sens.
          </p>
        </div>

        {/* Subtle divider */}
        <div className="flex justify-center items-center gap-3 mb-20">
          <div className="w-1 h-1 rounded-full bg-accent/40" />
          <div className="w-1 h-1 rounded-full bg-accent/40" />
          <div className="w-1 h-1 rounded-full bg-accent/40" />
        </div>

        {/* Values */}
        <div className="space-y-12">
          <p className="text-center text-muted-foreground text-sm tracking-widest uppercase mb-12">
            Nos valeurs partagées
          </p>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 max-w-3xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center md:text-left">
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  {value.word}
                </h3>
                <p className="text-muted-foreground text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing statement */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <p className="text-center text-foreground/70 text-lg md:text-xl font-light italic max-w-xl mx-auto leading-relaxed">
            "La Ruche studio, c'est l'invitation à ralentir, créer, et appartenir."
          </p>
        </div>
      </div>
    </section>
  )
}

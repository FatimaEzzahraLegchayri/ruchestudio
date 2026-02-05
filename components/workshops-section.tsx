import { WorkshopCard } from "@/components/workshop-card"

const workshops = [
  {
    image: "/images/workshop-poetry.jpg",
    title: "Atelier Poésie & Écriture",
    description:
      "Laissez libre cours à votre plume dans une ambiance intimiste. Repartez avec vos créations écrites et un carnet personnalisé.",
    category: "Écriture",
    date: "Samedi 15 Mars",
    time: "14h00",
    duration: "3 heures",
    totalPlaces: 12,
    remainingPlaces: 4,
    price: 65,
  },
  {
    image: "/images/workshop-fabric.jpg",
    title: "Peinture sur Tissu",
    description:
      "Créez votre propre pièce textile unique avec des motifs botaniques. Techniques de peinture sur coton et lin.",
    category: "Peinture",
    date: "Dimanche 16 Mars",
    time: "10h00",
    duration: "4 heures",
    totalPlaces: 10,
    remainingPlaces: 2,
    price: 85,
  },
  {
    image: "/images/workshop-glass.jpg",
    title: "Peinture sur Verre",
    description:
      "Transformez un vase ou un photophore en œuvre d'art. Apprenez les techniques de peinture vitrail moderne.",
    category: "Peinture",
    date: "Samedi 22 Mars",
    time: "15h00",
    duration: "3 heures",
    totalPlaces: 8,
    remainingPlaces: 8,
    price: 75,
  },
  {
    image: "/images/workshop-candle.jpg",
    title: "Création de Bougies",
    description:
      "Fabriquez vos propres bougies parfumées avec des cires naturelles et des huiles essentielles de qualité.",
    category: "Artisanat",
    date: "Dimanche 23 Mars",
    time: "14h00",
    duration: "2h30",
    totalPlaces: 10,
    remainingPlaces: 6,
    price: 70,
  },
]

export function WorkshopsSection() {
  return (
    <section id="ateliers" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.title} {...workshop} />
          ))}
        </div>
      </div>
    </section>
  )
}

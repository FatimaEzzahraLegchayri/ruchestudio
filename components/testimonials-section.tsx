import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Une expérience magique ! J'ai découvert une passion pour la peinture que je ne soupçonnais pas. L'ambiance est tellement bienveillante.",
    author: "Marie L.",
    workshop: "Atelier Peinture sur Tissu",
  },
  {
    quote:
      "La Pause d'Art a été une vraie bouffée d'air frais. Entre le yoga, la créativité et les échanges, je suis repartie ressourcée et inspirée.",
    author: "Sophie D.",
    workshop: "La Pause d'Art",
  },
  {
    quote:
      "J'ai offert cet atelier à ma mère et nous l'avons fait ensemble. Un moment de complicité inoubliable et de belles créations à garder.",
    author: "Camille R.",
    workshop: "Création de Bougies",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Témoignages
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
            Ce qu'ils disent de nous
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg border border-border"
            >
              <Quote className="w-8 h-8 text-accent/40 mb-4" />
              <p className="text-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-medium text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.workshop}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

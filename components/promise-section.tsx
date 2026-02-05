import { Feather, Sparkles, Heart } from "lucide-react";

export function PromiseSection() {
  const values = [
    {
      icon: Feather,
      title: "Une pause",
      subtitle: "Un moment pour soi",
      description:
        "Une manière de se déconnecter du stress du quotidien et de retrouver un espace de calme.",
    },
    {
      icon: Sparkles,
      title: "Aucun prérequis",
      subtitle: "Venez comme vous êtes",
      description:
        "Aucune expérience, aucune compétence, aucun background artistique. Juste vous.",
    },
    {
      icon: Heart,
      title: "Un souvenir",
      subtitle: "Repartez avec votre création",
      description:
        "Une pièce unique, faite par vous-même, à garder ou à offrir.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
            Notre promesse
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
            Ce n'est pas qu'un atelier.
            <br />
            <span className="text-accent">C'est une expérience.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/50 text-accent transition-colors group-hover:bg-secondary">
                <value.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-accent text-sm font-medium tracking-wide mb-3">
                {value.subtitle}
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

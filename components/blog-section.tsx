import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const blogPosts = [
  {
    image: "/images/workshop-fabric.jpg",
    title: "Comment débuter la peinture sur tissu",
    excerpt:
      "Découvrez les techniques de base et le matériel nécessaire pour vous lancer dans la peinture textile.",
    category: "Techniques",
    readTime: "5 min",
  },
  {
    image: "/images/workshop-candle.jpg",
    title: "Choisir ses huiles essentielles pour bougies",
    excerpt:
      "Guide complet pour sélectionner et associer les parfums naturels dans vos créations.",
    category: "Conseils",
    readTime: "4 min",
  },
  {
    image: "/images/workshop-glass.jpg",
    title: "L'art de la peinture sur verre",
    excerpt:
      "Histoire et techniques modernes de cet art ancestral accessible à tous.",
    category: "Inspiration",
    readTime: "6 min",
  },
]

export function BlogSection() {
  return (
    <section id="blog" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Blog & Ressources
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
              Apprendre & S'inspirer
            </h2>
          </div>
          <Link
            href="#"
            className="text-sm text-foreground flex items-center gap-2 hover:text-accent transition-colors mt-4 md:mt-0"
          >
            Voir tous les articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              href="#"
              className="group"
            >
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <span>{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{post.readTime} de lecture</span>
              </div>
              <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

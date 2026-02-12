import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { client } from "@/lib/sanity/sanity.client"
import { urlFor } from "@/lib/sanity/sanity.image"

// 1. Fetch data from Sanity
async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) [0...3] {
    title,
    slug,
    body,
    mainImage,
    publishedAt
  }`
  return await client.fetch(query)
}

export async function BlogSection() {
  const posts = await getPosts()

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
            href="/blogs"
            className="text-sm text-foreground flex items-center gap-2 hover:text-accent transition-colors mt-4 md:mt-0"
          >
            Voir tous les articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post: any) => {
            const excerpt = post.body?.[0]?.children
            ?.map((child: any) => child.text)
            .join("") || "";
            
            return (
              <Link
                key={post.slug.current}
                href={`/blogs/${post.slug.current}`}
                className="group"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).width(800).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                </div>
                
                {/* Optional: Keep the date if you've removed categories */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                   <span>{new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h3>
                
                {/* Displaying 3 lines of content as requested */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {excerpt}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
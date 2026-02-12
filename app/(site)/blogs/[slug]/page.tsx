import { client } from '@/lib/sanity/sanity.client'
import { urlFor } from '@/lib/sanity/sanity.image'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}

export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return (
    <div className="flex items-center justify-center min-h-[50vh] font-sans">
      <p className="text-muted-foreground">Article non trouvé</p>
    </div>
  )

  return (
    <article className="max-w-4xl mx-auto px-5 py-8 md:py-16 lg:py-20">
      
      {/* Header Section */}
      <header className="mb-8 md:mb-12">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm font-sans text-muted-foreground">
           <time dateTime={post._createdAt}>
             {new Date(post._createdAt || Date.now()).toLocaleDateString('fr-FR', { 
               day: 'numeric', 
               month: 'long', 
               year: 'numeric' 
             })}
           </time>
           <span className="w-1 h-1 rounded-full bg-border" />
           <span>La Ruche Studio</span>
        </div>
      </header>

      {/* Featured Image */}
      {post.mainImage && (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] mb-10 md:mb-16">
          <Image
            src={urlFor(post.mainImage).width(1200).url()}
            alt={post.title}
            fill
            className="object-cover rounded-2xl md:rounded-3xl shadow-sm"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      )}
      
      {/* Content Section */}
      <div className="max-w-2xl mx-auto">
        <div className="prose prose-base md:prose-lg font-sans max-w-none 
          prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-foreground prose-img:rounded-xl">
          <PortableText value={post.body} />
        </div>
      </div>

    </article>
  )
}
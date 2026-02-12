import { client } from '@/lib/sanity/sanity.client'
import { urlFor } from '@/lib/sanity/sanity.image'
import Link from 'next/link'
import Image from 'next/image'

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    slug,
    body,
    mainImage
  }`
  return await client.fetch(query)
}

export default async function BlogListPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => {
          // Extract plain text for the 2-line preview
          const description = post.body?.[0]?.children
          ?.map((child: any) => child.text)
          .join("") || "";

          return (
            <Link 
              key={post.slug.current} 
              href={`/blogs/${post.slug.current}`}
              className="group flex flex-col space-y-3"
            >
              {/* Image with Rounded Corners */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100">
                {post.mainImage ? (
                  <Image
                    src={urlFor(post.mainImage).width(800).url()}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-col space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h2>
                
                {/* 2 lines of blog content */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
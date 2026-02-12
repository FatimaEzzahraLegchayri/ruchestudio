import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity/sanity.client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
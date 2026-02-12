'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const row1 = [
  { id: 1, src: "/images/gallery-1.jpg", title: "Abstrait Floral" },
  { id: 2, src: "/images/gallery-2.jpg", title: "Éclat d'Automne" },
  { id: 3, src: "/images/gallery-3.jpg", title: "Sérénité Bleue" },
  { id: 4, src: "/images/gallery-4.jpg", title: "Texture & Or" },
  { id: 5, src: "/images/gallery-5.jpg", title: "Mouvement" },
  { id: 6, src: "/images/gallery-6.jpg", title: "Lueur Rose" },
  { id: 7, src: "/images/gallery-7.jpg", title: "Ombres Portées" },
  { id: 8, src: "/images/gallery-8.jpg", title: "Composition No. 4" },
  { id: 9, src: "/images/gallery-9.jpg", title: "Esprit Libre" },
]

const row2 = [
  { id: 6, src: "/images/gallery-10.jpg", title: "Lueur Rose" },
  { id: 7, src: "/images/gallery-11.jpg", title: "Ombres Portées" },
  { id: 8, src: "/images/gallery-12.jpg", title: "Composition No. 4" },
  { id: 9, src: "/images/gallery-13.jpg", title: "Esprit Libre" },
  { id: 10, src: "/images/gallery-14.jpg", title: "Vibration" },
  { id: 11, src: "/images/gallery-15.jpg", title: "Vibration" },
  { id: 12, src: "/images/gallery-16.jpg", title: "Vibration" },
  { id: 10, src: "/images/gallery-17.jpg", title: "Vibration" },
  { id: 10, src: "/images/gallery-18.jpg", title: "Vibration" },
]

export function GallerySection() {
  const [row1Hovered, setRow1Hovered] = useState(false)
  const [row2Hovered, setRow2Hovered] = useState(false)
  const [activeImage, setActiveImage] = useState<typeof row1[0] | null>(null)

  return (
    <section className="py-24 bg-[#FDFBF7] overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center">
        <span className="text-[#AB507B] uppercase tracking-[0.3em] text-sm font-bold block mb-4">
          La Ruche Studio en images
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A]">
          Vos Créations, <span className="italic">Notre Fierté</span>
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1 */}
        <div className="flex overflow-hidden">
          <motion.div
            animate={row1Hovered ? {} : { x: "-50%" }}
            transition={{
              duration: 30,
              repeat: row1Hovered ? 0 : Infinity,
              ease: "linear",
            }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...row1, ...row1].map((item, idx) => (
              <GalleryCard
                key={`${item.id}-${idx}`}
                item={item}
                onHoverChange={setRow1Hovered}
                onOpen={setActiveImage}
              />
            ))}
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex overflow-hidden">
          <motion.div
            initial={{ x: "-50%" }}
            animate={row2Hovered ? {} : { x: 0 }}
            transition={{
              duration: 35,
              repeat: row2Hovered ? 0 : Infinity,
              ease: "linear",
            }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...row2, ...row2].map((item, idx) => (
              <GalleryCard
                key={`${item.id}-${idx}`}
                item={item}
                onHoverChange={setRow2Hovered}
                onOpen={setActiveImage}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Preview */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setActiveImage(null)}
          >
            <motion.img
              src={activeImage.src}
              alt={activeImage.title}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function GalleryCard({
  item,
  onHoverChange,
  onOpen,
}: {
  item: typeof row1[0]
  onHoverChange: (hovered: boolean) => void
  onOpen: (item: typeof row1[0]) => void
}) {
  return (
    <div
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={() => onOpen(item)}
      className="relative group w-[300px] md:w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-white border border-zinc-100 flex-shrink-0 cursor-pointer"
    >
      <img
        src={item.src}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
        <div className="text-white">
          <p className="text-xs uppercase tracking-widest mb-1 opacity-80">
            Collection
          </p>
          <h4 className="text-xl font-serif italic">{item.title}</h4>
        </div>
      </div> */}

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#AB507B] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
        La Ruche Studio
      </div>
    </div>
  )
}

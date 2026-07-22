'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@/lib/icons'

type Review = {
  id: string
  rating: number
  title: string | null
  body: string | null
  helpfulCount: number
}

const FALLBACK_REVIEWS = [
  {
    id: 'r1', rating: 5,
    title: 'Absolutely love this strap',
    body: 'I bought the leather strap for my Fossil watch and it feels premium. The stitching is immaculate and the clasp is solid.',
    helpfulCount: 12,
  },
  {
    id: 'r2', rating: 5,
    title: 'Better than Apple OEM',
    body: 'Swapped out my Apple Watch band for this silicone from Pro Straps. No comparison — softer, looks cleaner, and hasn\'t yellowed.',
    helpfulCount: 9,
  },
  {
    id: 'r3', rating: 5,
    title: 'A gift that landed perfectly',
    body: 'Gifted the metal chain strap to my dad for his Seiko 5. He literally said it looks like a Rolex Oyster. Worth every rupee.',
    helpfulCount: 21,
  },
]

export function TestimonialsSection({ reviews }: { reviews?: Review[] }) {
  const display = (reviews && reviews.length > 0 ? reviews.slice(0, 3) : FALLBACK_REVIEWS)

  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/40">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
      >
        <div>
          <span className="text-label text-muted-foreground flex items-center gap-2 mb-3">
            <span className="size-1 rounded-full bg-[#CCFF00]" /> Customer Reviews
          </span>
          <h2 className="text-display font-bold text-foreground lowercase font-sans">
            what our<br />customers say
          </h2>
        </div>

        {/* Aggregate rating */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/40 bg-[#F7F7F5] dark:bg-[#111] self-start sm:self-auto">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-foreground">4.9</span>
            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={12} className="fill-[#CCFF00] text-[#CCFF00]" />
              ))}
            </div>
          </div>
          <div className="h-10 w-px bg-border/40" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">330+</span>
            <span className="text-label text-muted-foreground">Reviews</span>
          </div>
        </div>
      </motion.div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {display.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 0.68, 0, 1.2] }}
            className={`rounded-3xl p-7 sm:p-8 flex flex-col gap-5 ${
              i === 0
                ? 'bg-[#CCFF00] text-black'
                : 'bg-[#F7F7F5] dark:bg-[#111] border border-border/40 text-foreground'
            }`}
          >
            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <StarIcon
                  key={j}
                  size={14}
                  className={`${i === 0 ? 'fill-black/40 text-black/40' : 'fill-[#CCFF00] text-[#CCFF00]'} ${j < r.rating ? 'opacity-100' : 'opacity-20'}`}
                />
              ))}
            </div>

            {/* Quote */}
            <span className={`text-4xl font-serif leading-none ${i === 0 ? 'text-black/20' : 'text-muted-foreground/20'}`}>&ldquo;</span>

            {r.title && (
              <h3 className={`text-lg font-bold leading-tight ${i === 0 ? 'text-black' : 'text-foreground'}`}>
                {r.title}
              </h3>
            )}

            {r.body && (
              <p className={`text-sm leading-relaxed line-clamp-4 ${i === 0 ? 'text-black/70' : 'text-muted-foreground'}`}>
                {r.body}
              </p>
            )}

            {/* Helpful count */}
            <span className={`text-label mt-auto ${i === 0 ? 'text-black/40' : 'text-muted-foreground/50'}`}>
              {r.helpfulCount} found this helpful
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
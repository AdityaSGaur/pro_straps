'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@/lib/icons'

export function LifestyleBannerSection() {
  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 0.68, 0, 1.2] }}
        className="relative w-full rounded-[3rem] overflow-hidden aspect-[21/9] min-h-[320px] sm:min-h-[420px] flex items-end bg-black group"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=90"
          alt="Luxury watch lifestyle — Pro Straps"
          fill
          className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
          sizes="100vw"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Horizontal rule decorative lines */}
        <div className="absolute top-8 left-10 right-10 h-px bg-white/10" />
        <div className="absolute bottom-8 left-10 right-10 h-px bg-white/10" />

        {/* Corner labels */}
        <span className="absolute top-8 left-10 text-label text-white/40">Pro Straps™</span>
        <span className="absolute top-8 right-10 text-label text-white/40">Since 2025</span>

        {/* Center content */}
        <div className="relative z-10 w-full px-8 sm:px-14 lg:px-20 pb-10 sm:pb-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-label text-[#CCFF00]">Premium Lifestyle</span>
            <h2 className="text-display font-bold text-white lowercase font-sans max-w-lg">
              the interior features vegan leather and optional ash wood accents
            </h2>
          </div>

          <Link
            href="/shop"
            className="group/btn shrink-0 inline-flex items-center gap-3 rounded-full border border-white/30 text-white px-7 py-4 text-sm font-bold uppercase tracking-wider backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            Shop Now
            <ArrowRightIcon size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRightIcon } from '@/lib/icons'

const MARQUEE_ITEMS = [
  'Leather Straps', '—', 'Silicone Bands', '—', 'Metal Chains', '—',
  'NATO Straps', '—', 'Apple Watch', '—', 'Fossil', '—',
  'Samsung Galaxy', '—', 'Garmin', '—', 'Seiko', '—',
  'Leather Straps', '—', 'Silicone Bands', '—', 'Metal Chains', '—',
  'NATO Straps', '—', 'Apple Watch', '—', 'Fossil', '—',
  'Samsung Galaxy', '—', 'Garmin', '—', 'Seiko', '—',
]

const FEATURED_STRAP = {
  src: '/products/chain_straps/chain_straps_black_v1.png',
  name: 'Midnight Onyx',
  material: 'Full-Grain Leather',
  price: '₹1,999',
  width: '22mm',
}

export function HeroSection() {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const imageY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const headingY   = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const opacity    = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const smoothImgY = useSpring(imageY, { stiffness: 60, damping: 20 })

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-[#F7F7F5] dark:bg-[#0A0A0A]">
      {/* ── Grain texture overlay ── */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"%3E%3C/rect%3E%3C/svg%3E')" }}
      />

      {/* ── TOP META BAR ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-6 pb-4 text-label text-muted-foreground"
      >
        <span>Pro Straps™ — Est. 2025</span>
        <span className="hidden sm:block">Handcrafted in India</span>
        <Link href="/shop" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          Shop All <ArrowRightIcon size={11} />
        </Link>
      </motion.div>

      {/* ── MAIN HERO GRID ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[90vh] lg:min-h-[88vh] px-6 sm:px-10 lg:px-16 pb-8 gap-0">

        {/* LEFT: Massive Editorial Headline */}
        <motion.div
          style={{ y: headingY, opacity }}
          className="lg:col-span-7 flex flex-col justify-center gap-6 sm:gap-8 pt-6 lg:pt-0 order-2 lg:order-1"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-3 self-start"
          >
            <span className="size-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
            <span className="text-label text-muted-foreground tracking-widest">New Collection 2025</span>
          </motion.div>

          {/* Giant Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.68, 0, 1.2] }}
            className="text-hero font-bold text-foreground lowercase font-sans leading-[0.95] tracking-[-0.04em]"
          >
            premium<br />
            <span className="relative inline-block">
              watch
              {/* Lime underline accent */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 0.68, 0, 1.2] }}
                className="absolute -bottom-1 left-0 w-full h-[5px] bg-[#CCFF00] origin-left rounded-full"
              />
            </span>
            <br />
            straps
          </motion.h1>

          {/* Floating Descriptor Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6"
          >
            {[
              { n: '200+', label: 'products' },
              { n: '4.9★', label: 'avg rating' },
              { n: '5yr', label: 'warranty' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{s.n}</span>
                <span className="text-label text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="max-w-xs sm:max-w-sm text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            Luxury watch straps handcrafted for the ones who move differently. Precision meets elegance.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group relative inline-flex items-center gap-3 rounded-full bg-foreground text-background px-7 py-4 text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:gap-4 hover:shadow-xl hover:shadow-black/20"
            >
              <span className="absolute inset-0 bg-[#CCFF00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">Explore Collection</span>
              <ArrowRightIcon size={14} className="relative z-10 transition-colors duration-300 group-hover:text-black" />
            </Link>
            <Link
              href="/shop?category=leather"
              className="text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Shop Leather
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT: Floating Product Render */}
        <div className="lg:col-span-5 relative flex items-center justify-center order-1 lg:order-2 min-h-[340px] sm:min-h-[420px] lg:min-h-0">
          {/* Ambient circle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] lg:w-[440px] aspect-square rounded-full bg-[#CCFF00]/8 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[300px] lg:w-[360px] aspect-square rounded-full border border-black/6 dark:border-white/6 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[210px] lg:w-[250px] aspect-square rounded-full border border-black/5 dark:border-white/5 pointer-events-none" />

          {/* Main product image with parallax */}
          <motion.div
            style={{ y: smoothImgY }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 0.68, 0, 1.2] }}
            className="relative w-[240px] sm:w-[300px] lg:w-[340px] aspect-[3/4] animate-float z-10"
          >
            <Image
              src={FEATURED_STRAP.src}
              alt={FEATURED_STRAP.name}
              fill
              priority
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 340px"
            />
          </motion.div>

          {/* Floating info card — top right */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="absolute top-8 right-0 lg:right-4 bg-white dark:bg-[#141414] rounded-2xl px-4 py-3 shadow-2xl border border-border/30 flex flex-col gap-1 z-20 min-w-[130px]"
          >
            <span className="text-label text-muted-foreground">material</span>
            <span className="text-xs font-bold text-foreground">{FEATURED_STRAP.material}</span>
          </motion.div>

          {/* Floating price card — bottom left */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="absolute bottom-10 left-0 lg:-left-4 bg-foreground text-background rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 z-20"
          >
            <div className="size-2 rounded-full bg-[#CCFF00]" />
            <span className="text-sm font-bold">{FEATURED_STRAP.price}</span>
            <span className="text-xs text-background/50">from</span>
          </motion.div>

          {/* Floating width badge — center right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="absolute bottom-24 right-0 lg:right-2 bg-[#CCFF00] text-black rounded-full px-3 py-1.5 text-label z-20 shadow-lg"
          >
            {FEATURED_STRAP.width}
          </motion.div>
        </div>
      </div>

      {/* ── MARQUEE TICKER ── */}
      <div className="relative z-10 border-t border-border/40 py-4 overflow-hidden bg-foreground dark:bg-[#111]">
        <div className="flex whitespace-nowrap animate-marquee gap-8">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className={`text-label shrink-0 ${item === '—' ? 'text-background/20 dark:text-white/20' : 'text-background/80 dark:text-white/80'}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
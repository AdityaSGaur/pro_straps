'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const MATERIALS = [
  {
    label: 'Leather',
    slug: 'leather',
    desc: 'Full-grain Italian & genuine leather. Timeless, breathable, elegant.',
    image: '/products/chain_straps/Whisk_2c5f31ee9e25fa383564f044f09d9024dr.jpeg',
    accent: '#1a1a1a',
    light: '#f5f0eb',
  },
  {
    label: 'Silicone',
    slug: 'silicone',
    desc: 'Medical-grade silicone. Built for sport, swim-proof, comfort-first.',
    image: '/products/synthetic_&_rubber_straps/w1.jpg',
    accent: '#003d1a',
    light: '#e8f5ed',
  },
  {
    label: 'Metal',
    slug: 'metal',
    desc: 'Stainless steel & titanium mesh. Industrial, refined, forever.',
    image: '/products/chain_straps/Matte-Titanium-Band-For-Apple-Watch-45-25.webp',
    accent: '#0a1628',
    light: '#e8edf5',
  },
  {
    label: 'NATO',
    slug: 'nato',
    desc: 'Woven nylon, quick-release keepers. Tactical roots, civilian soul.',
    image: '/products/synthetic_&_rubber_straps/w2.webp',
    accent: '#2a1a00',
    light: '#f5f0e0',
  },
]

export function MaterialsSection() {
  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/40">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14"
      >
        <div>
          <span className="text-label text-muted-foreground flex items-center gap-2 mb-3">
            <span className="size-1 rounded-full bg-[#CCFF00]" /> Shop by Material
          </span>
          <h2 className="text-display font-bold text-foreground lowercase font-sans">
            find your<br />perfect match
          </h2>
        </div>
        <Link
          href="/shop"
          className="self-start sm:self-auto text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 underline underline-offset-4 transition-colors shrink-0"
        >
          View All Materials
        </Link>
      </motion.div>

      {/* 4-column material grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {MATERIALS.map((mat, i) => (
          <motion.div
            key={mat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 0.68, 0, 1.2] }}
          >
            <Link
              href={`/shop?category=${mat.slug}`}
              className="group relative flex flex-col h-[300px] sm:h-[380px] lg:h-[440px] rounded-3xl overflow-hidden cursor-pointer"
              style={{ background: mat.light }}
            >
              {/* Product image */}
              <div className="absolute inset-0">
                <Image
                  src={mat.image}
                  alt={mat.label}
                  fill
                  className="object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                style={{ background: `linear-gradient(to top, ${mat.accent}ee 0%, ${mat.accent}44 60%, transparent 100%)` }}
              />

              {/* Content */}
              <div className="relative z-10 mt-auto p-5 sm:p-6">
                <h3 className="text-title font-bold text-white lowercase tracking-tight">{mat.label}</h3>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed line-clamp-2 max-w-[200px] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  {mat.desc}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[#CCFF00] text-label">
                  Shop {mat.label}
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                </div>
              </div>

              {/* Top right number */}
              <div className="absolute top-5 right-5 text-white/30 text-label z-10">
                0{i + 1}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

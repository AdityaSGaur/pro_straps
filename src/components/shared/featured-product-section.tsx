'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@/lib/icons'

const SPECS = [
  { label: 'Material', value: 'Full-Grain Leather' },
  { label: 'Width', value: '18mm / 20mm / 22mm' },
  { label: 'Buckle', value: 'Stainless Steel Clasp' },
  { label: 'Compatibility', value: 'Universal Lugs' },
  { label: 'Warranty', value: '5 Years Global' },
]

export function FeaturedProductSection() {
  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/40">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-16">
        <span className="size-1 rounded-full bg-[#CCFF00]" />
        <span className="text-label text-muted-foreground">Featured</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Big product render */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 0.68, 0, 1.2] }}
          className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-[#F7F7F5] dark:bg-[#111] border border-border/30 group"
        >
          {/* Accent rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="size-[70%] rounded-full border border-black/5 dark:border-white/5" />
            <div className="absolute size-[50%] rounded-full border border-black/5 dark:border-white/5" />
          </div>

          <Image
            src="/products/chain_straps/f-shgcdn-645cf54f67795.webp"
            alt="Midnight Chain Strap — Featured"
            fill
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Price tag */}
          <div className="absolute bottom-6 right-6 bg-foreground text-background rounded-2xl px-5 py-3 flex items-center gap-2 shadow-xl">
            <div className="size-2 rounded-full bg-[#CCFF00]" />
            <span className="text-base font-bold">₹2,499</span>
          </div>
        </motion.div>

        {/* Right: Editorial info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 0.68, 0, 1.2] }}
          className="flex flex-col gap-8"
        >
          {/* Eyebrow */}
          <div>
            <span className="text-label text-muted-foreground">Pro Straps / Chain Series</span>
            <h2 className="text-display font-bold text-foreground lowercase mt-2 font-sans">
              Midnight<br />Chain Strap
            </h2>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-sm">
            Precision-engineered stainless steel links with a brushed matte finish. Inspired by Rolex Oyster. Built for everyday luxury.
          </p>

          {/* Spec list */}
          <div className="divide-y divide-border/40 border-y border-border/40">
            {SPECS.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3">
                <span className="text-label text-muted-foreground">{s.label}</span>
                <span className="text-sm font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/shop?category=metal"
              className="group relative inline-flex items-center gap-3 rounded-full bg-foreground text-background px-7 py-4 text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:gap-4"
            >
              <span className="absolute inset-0 bg-[#CCFF00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">Shop Now</span>
              <ArrowRightIcon size={14} className="relative z-10 group-hover:text-black transition-colors duration-300" />
            </Link>
            <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
              View All Chains
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

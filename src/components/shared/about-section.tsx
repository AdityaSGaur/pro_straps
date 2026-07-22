'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@/lib/icons'

export function AboutSection() {
  return (
    <section className="w-full py-12 sm:py-16 border-t border-border/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Lifestyle Wrist Photo Card */}
        <motion.div
          className="lg:col-span-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-neutral-900 border border-border/40 shadow-xl group">
            <Image
              src="/products/leather_straps/l1.jpg"
              alt="Handcrafted leather strap lifestyle"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-lime mb-1">
                artisan craftsmanship
              </span>
              <p className="text-white text-sm sm:text-base font-medium max-w-md leading-relaxed">
                Handcrafted from authentic full-grain Italian leather and aircraft-grade stainless steel clasps.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-white text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-lime transition-all"
              >
                Shop Now <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Editorial Narrative Typography */}
        <motion.div
          className="lg:col-span-6 flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-foreground/60" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              About Us
            </h2>
          </div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight lowercase text-foreground leading-tight font-sans">
            Hear the gravel beneath you. See the night sky above.
          </h3>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Connect with the world around you. Every aspect of <strong className="text-foreground font-semibold">Pro Straps</strong> is engineered to elevate your watch face into an extension of your daily movement and personal statement.
          </p>

          <div className="pt-2 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">100%</span>
              <span className="text-xs text-muted-foreground font-medium">Authentic Leather &amp; Silicone</span>
            </div>
            <div className="h-10 w-px bg-border/60" />
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">5 Years</span>
              <span className="text-xs text-muted-foreground font-medium">Global Craft Warranty</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

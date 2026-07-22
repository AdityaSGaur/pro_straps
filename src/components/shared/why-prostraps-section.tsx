'use client'

import { motion } from 'framer-motion'

const PILLARS = [
  {
    number: '01',
    title: 'Artisan\nCraftsmanship',
    desc: 'Every stitch, every clasp, every edge is hand-finished by experienced craftsmen using traditional techniques from a modern lens.',
  },
  {
    number: '02',
    title: 'Premium\nMaterials',
    desc: 'We source only the finest full-grain leathers, medical-grade silicones, and aerospace-grade titanium alloys.',
  },
  {
    number: '03',
    title: 'Universal\nCompatibility',
    desc: 'Engineered to fit any lug width from 16mm to 26mm — from Apple Watch to Rolex to Garmin. No compromise.',
  },
  {
    number: '04',
    title: '5 Year\nWarranty',
    desc: 'Our confidence is backed by an unconditional 5-year global warranty on every single strap we produce.',
  },
]

export function WhyProStrapsSection() {
  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/40">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col gap-4 mb-16"
      >
        <span className="text-label text-muted-foreground flex items-center gap-2">
          <span className="size-1 rounded-full bg-[#CCFF00]" /> Why Choose Us
        </span>
        <h2 className="text-display font-bold text-foreground lowercase font-sans max-w-lg">
          the difference is in<br />the details
        </h2>
      </motion.div>

      {/* Pillars grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 rounded-3xl overflow-hidden border border-border/40">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 0.68, 0, 1.2] }}
            className="bg-background p-8 sm:p-10 flex flex-col gap-6 group hover:bg-[#F7F7F5] dark:hover:bg-[#111] transition-colors duration-300"
          >
            {/* Number */}
            <span className="text-label text-muted-foreground/50">{p.number}</span>

            {/* Lime divider */}
            <div className="w-8 h-0.5 bg-[#CCFF00] rounded-full group-hover:w-14 transition-all duration-400" />

            {/* Title */}
            <h3 className="text-title font-bold text-foreground lowercase whitespace-pre-line font-sans">
              {p.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

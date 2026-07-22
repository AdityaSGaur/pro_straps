'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon, CheckCircle2Icon } from '@/lib/icons'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitted(true)
  }

  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 0.68, 0, 1.2] }}
        className="relative w-full rounded-[3rem] overflow-hidden bg-foreground text-background p-10 sm:p-14 lg:p-20"
      >
        {/* Lime glow accent */}
        <div className="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full bg-[#CCFF00]/20 blur-3xl pointer-events-none" />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"%3E%3C/rect%3E%3C/svg%3E')" }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          {/* Left */}
          <div className="flex flex-col gap-4 max-w-lg">
            <span className="text-label text-background/40 flex items-center gap-2">
              <span className="size-1 rounded-full bg-[#CCFF00]" /> Newsletter
            </span>
            <h2 className="text-display font-bold text-background lowercase font-sans">
              stay ahead of<br />every drop
            </h2>
            <p className="text-sm text-background/60 leading-relaxed">
              Be the first to know about new collections, limited releases, and exclusive member discounts. No spam, just craft.
            </p>
          </div>

          {/* Right form */}
          <div className="w-full lg:w-auto lg:min-w-[400px]">
            {submitted ? (
              <div className="flex items-center gap-3 text-[#CCFF00]">
                <CheckCircle2Icon size={22} />
                <span className="text-sm font-bold">You&apos;re in. Watch your inbox for exclusive drops.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-full bg-background/10 border border-background/20 p-2 pl-6 backdrop-blur-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent text-sm text-background placeholder:text-background/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 group inline-flex items-center gap-2 rounded-full bg-[#CCFF00] text-black px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300"
                  >
                    Subscribe
                    <ArrowRightIcon size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                {error && <p className="text-xs text-red-400 pl-6">{error}</p>}
                <p className="text-[11px] text-background/30 pl-6">
                  By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="relative z-10 mt-14 pt-8 border-t border-background/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { n: '200+', label: 'Products' },
            { n: '10K+', label: 'Happy Customers' },
            { n: '50+', label: 'Watch Brands Supported' },
            { n: '5★', label: 'Average Rating' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-background">{s.n}</span>
              <span className="text-label text-background/40">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
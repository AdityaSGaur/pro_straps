import type { Metadata } from 'next'
import { AwardIcon, HandIcon, ShieldIcon, StarIcon, ShoppingBagIcon, RefreshCwIcon } from '@/lib/icons'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Pro Straps — our mission, craftsmanship philosophy, and the team behind India’s most loved premium watch strap brand.',
}


import { NewsletterSection } from '@/components/shared/newsletter-section'

const STATS = [
  { value: '10,000+', label: 'straps sold', icon: ShoppingBagIcon },
  { value: '50+', label: 'watch brands compatible', icon: AwardIcon },
  { value: '4.8/5', label: 'average rating', icon: StarIcon },
  { value: '15-day', label: 'easy returns', icon: RefreshCwIcon },
]

const TEAM = [
  { name: 'arjun mehra', role: 'founder & ceo', initials: 'AM' },
  { name: 'priya sharma', role: 'head of design', initials: 'PS' },
  { name: 'rahul verma', role: 'production lead', initials: 'RV' },
  { name: 'neha kapoor', role: 'customer experience', initials: 'NK' },
]

const QUALITY = [
  {
    icon: AwardIcon,
    title: 'premium materials',
    desc: 'every strap begins with ethically sourced, top-grade materials — from italian full-grain leather to japanese fkm rubber. we never compromise on what goes against your skin.',
  },
  {
    icon: HandIcon,
    title: 'handcrafted finish',
    desc: 'our artisans bring decades of leather-working expertise to every piece. hand-stitched edges, hand-burnished surfaces, and meticulous quality checks ensure perfection.',
  },
  {
    icon: ShieldIcon,
    title: 'rigorous testing',
    desc: 'each strap endures a 72-hour wear simulation, colourfastness testing, and a multi-point quality inspection before it earns the pro straps label.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-dark dark:bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight lowercase heading">
            our story
          </h1>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            what started as a personal quest for the perfect watch strap became a mission to make premium craftsmanship accessible to every watch lover in india.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20 lg:space-y-28">
        {/* Crafted with Passion */}
        <section className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight lowercase heading">
            crafted with passion
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              in 2021, our founder arjun mehra — a lifelong watch enthusiast based in mumbai — found himself frustrated by the lack of affordable, high-quality watch straps in india. every time he sourced a strap from europe, he paid as much in shipping and duties as the strap itself. and the local alternatives? they either fell apart within months or looked nothing like the product photos.
            </p>
            <p>
              armed with a background in product design and an obsessive attention to detail, arjun spent months visiting tanneries across italy and japan, studying stitching techniques passed down through generations of leather workers, and building relationships with suppliers who shared his uncompromising standards. the first pro straps collection — just five leather straps — launched from a small workshop with a simple belief: every watch deserves a strap that matches its craftsmanship.
            </p>
            <p>
              today, pro straps has grown from that tiny workshop into india&apos;s fastest-growing premium watch strap brand, but the philosophy remains exactly the same: obsessive quality, honest pricing, and a strap for every story.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="bg-secondary/50 rounded-2xl p-8 lg:p-12 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight lowercase heading">
            our mission
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            to democratise access to world-class watch straps. we believe you shouldn&apos;t have to spend ₹10,000+ to put a beautifully crafted strap on your wrist. by controlling our supply chain, cutting out middlemen, and selling directly to you, we deliver premium quality at honest prices.
          </p>
        </section>

        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-secondary/50 rounded-2xl p-6 text-center"
              >
                <stat.icon className="size-6 mx-auto mb-3 text-lime-dark dark:text-lime" />
                <div className="text-3xl lg:text-4xl font-bold tracking-tight heading">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The Team */}
        <section className="space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight lowercase heading">
            the team
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center space-y-3">
                <div className="mx-auto size-20 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground heading">
                    {member.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold lowercase">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quality Promise */}
        <section className="space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight lowercase heading">
            quality promise
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {QUALITY.map((item) => (
              <div key={item.title} className="bg-secondary/50 rounded-2xl p-6 space-y-3">
                <item.icon className="size-8 text-lime-dark dark:text-lime" />
                <h3 className="text-lg font-bold lowercase heading">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </div>
    </div>
  )
}
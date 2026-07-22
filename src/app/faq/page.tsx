'use client'

import { useState, useMemo } from 'react'
import { SearchIcon, ArrowRightIcon } from '@/lib/icons'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// ─── FAQ Data ─────────────────────────────────────────────────────

const FAQ_CATEGORIES = [
  {
    id: 'ordering',
    title: 'ordering',
    questions: [
      {
        q: 'how do i place an order?',
        a: 'browse our collection, select the strap you love, choose your preferred size and colour, and click "add to cart." proceed to checkout, enter your shipping details, and complete the payment. you\'ll receive an order confirmation email with tracking details once your order ships.',
      },
      {
        q: 'can i modify or cancel my order after placing it?',
        a: 'you can modify or cancel your order within 2 hours of placing it by contacting us at hello@prostraps.in with your order number. after 2 hours, we begin processing and may not be able to make changes. we\'ll do our best to help if you reach out early.',
      },
      {
        q: 'do you offer gift wrapping?',
        a: 'yes! we offer a premium gift-wrapping option at checkout for ₹99. your strap arrives in a sleek black box with tissue paper and a handwritten card. perfect for gifting a fellow watch enthusiast.',
      },
      {
        q: 'is there a minimum order value?',
        a: 'no, there\'s no minimum order value. order one strap or ten — we treat every order with the same care and attention. orders above ₹999 qualify for free shipping across india.',
      },
      {
        q: 'can i order a strap that\'s out of stock?',
        a: 'you can click the "notify me" button on any out-of-stock product page. we\'ll email you the moment it\'s back in stock. most restocks happen within 7–10 business days.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'shipping & delivery',
    questions: [
      {
        q: 'how long does delivery take?',
        a: 'standard delivery takes 3–5 business days across metro cities and 5–7 business days for other areas. express delivery (available in select metros) takes 1–2 business days.',
      },
      {
        q: 'do you ship internationally?',
        a: 'currently, we ship only within india. we\'re working on international shipping and expect to launch it by q3 2025. follow us on instagram for updates.',
      },
      {
        q: 'how much does shipping cost?',
        a: 'shipping is free for orders above ₹999. for orders below ₹999, standard shipping costs ₹79. express shipping (where available) costs ₹149.',
      },
      {
        q: 'how can i track my order?',
        a: 'once your order ships, you\'ll receive an email and sms with a tracking link. you can also track your order on our website using your order number.',
      },
      {
        q: 'which courier partners do you use?',
        a: 'we partner with delhivery, blue dart, and india post for reliable delivery across india. the courier partner is selected automatically based on your pin code for the fastest delivery.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'returns & exchanges',
    questions: [
      {
        q: 'what is your return policy?',
        a: 'we offer a 15-day return policy from the date of delivery. the strap must be unused, in its original packaging, with all tags attached. contact us to initiate a return, and we\'ll arrange a pickup at no extra cost.',
      },
      {
        q: 'how do i initiate a return or exchange?',
        a: 'email us at hello@prostraps.in with your order number and reason. we\'ll send you a return label within 24 hours. once we receive and inspect the item, we\'ll process your refund or exchange within 3–5 business days.',
      },
      {
        q: 'can i exchange for a different size or colour?',
        a: 'absolutely. exchanges are free for a different size or colour of the same product. if you\'d like to exchange for a different product, we\'ll issue a store credit for the full amount.',
      },
      {
        q: 'how long does a refund take?',
        a: 'refunds are processed within 3–5 business days after we receive the returned item. the amount is credited back to your original payment method. please allow an additional 5–7 business days for your bank to reflect the refund.',
      },
    ],
  },
  {
    id: 'products',
    title: 'products & materials',
    questions: [
      {
        q: 'what materials do you use for your leather straps?',
        a: 'our leather straps come in several grades: italian full-grain leather sourced from tanneries in tuscany, saffiano leather with its distinctive cross-hatch pattern, and premium calfskin for a softer, more supple feel. all our leather is ethically sourced and chromium-free tanned where possible.',
      },
      {
        q: 'are your silicone straps safe for sensitive skin?',
        a: 'yes. our silicone straps are made from medical-grade, hypoallergenic silicone that\'s free from bpa, latex, and phthalates. they\'re also sweat-resistant and extremely comfortable for all-day wear, especially during workouts.',
      },
      {
        q: 'what widths do your straps come in?',
        a: 'we offer straps in 18mm, 20mm, 22mm, and 24mm widths — covering the vast majority of watches on the market. if you\'re unsure about your watch\'s lug width, check your watch brand\'s spec sheet or use our compatibility guide.',
      },
      {
        q: 'do your straps fit smartwatches like apple watch and samsung galaxy watch?',
        a: 'yes! we have dedicated collections for apple watch (38/40/41mm and 42/44/45/49mm) and samsung galaxy watch. our nato and silicone straps are also compatible with most smartwatches that use standard spring bars.',
      },
      {
        q: 'how do i care for my leather strap?',
        a: 'wipe your leather strap with a soft, dry cloth after each wear. every 2–3 months, apply a thin layer of leather conditioner to keep it supple. avoid prolonged exposure to water, direct sunlight, and extreme temperatures. store it in a cool, dry place when not in use.',
      },
    ],
  },
  {
    id: 'custom',
    title: 'custom orders',
    questions: [
      {
        q: 'can i get a custom strap made?',
        a: 'yes! use our strap customizer to design your perfect strap — choose the material, colour, stitching, buckle style, and even add a custom engraving. custom orders typically ship within 5–7 business days.',
      },
      {
        q: 'can i get my initials engraved on the buckle?',
        a: 'absolutely. we offer buckle engraving (up to 30 characters) for ₹299. choose the engraving option in our customizer, and we\'ll laser-etch your text onto the buckle for a personal touch.',
      },
      {
        q: 'do you offer bulk or corporate orders?',
        a: 'yes, we offer special pricing for bulk orders (10+ straps) and corporate gifting. contact us at partnerships@prostraps.in with your requirements, and our team will create a custom proposal for you.',
      },
      {
        q: 'can i send my own material for a custom strap?',
        a: 'we currently work with our curated range of materials to ensure consistent quality. however, if you have a special request, reach out to us and we\'ll see what we can do.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'payments',
    questions: [
      {
        q: 'what payment methods do you accept?',
        a: 'we accept all major credit and debit cards (visa, mastercard, amex), upi, netbanking, and popular wallets like paytm and phonepe. we also offer cash on delivery (cod) for orders under ₹5,000.',
      },
      {
        q: 'is it safe to pay on your website?',
        a: 'absolutely. all transactions are processed through razorpay, india\'s leading payment gateway, with 256-bit ssl encryption. we never store your card details on our servers.',
      },
      {
        q: 'do you offer emi or instalment options?',
        a: 'yes, we offer no-cost emi on orders above ₹3,000 through select credit cards and select banking partners. the emi option is available at checkout.',
      },
      {
        q: 'do you accept international currency?',
        a: 'currently, all prices are listed in indian rupees (inr) and we only accept payments in inr. international shipping and multi-currency support are on our roadmap.',
      },
    ],
  },
]

export default function FAQPage() {
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return FAQ_CATEGORIES
    const q = search.toLowerCase()
    return FAQ_CATEGORIES.map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.questions.length > 0)
  }, [search])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-dark dark:bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lowercase heading">
            frequently asked questions
          </h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto text-sm sm:text-base">
            everything you need to know about our straps, shipping, and more.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search questions..."
              className="pl-11 h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-lime focus-visible:ring-lime/30"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <SearchIcon className="size-10 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">
              no questions found for &ldquo;{search}&rdquo;
            </p>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {filteredCategories.map((cat) => (
              <AccordionItem key={cat.id} value={cat.id}>
                <AccordionTrigger className="text-base font-semibold lowercase heading">
                  {cat.title}
                </AccordionTrigger>
                <AccordionContent className="space-y-0">
                  <div className="divide-y">
                    {cat.questions.map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0">
                        <p className="text-sm font-medium mb-1.5">{item.q}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Still have questions CTA */}
        <div className="mt-16 text-center bg-secondary/50 rounded-2xl p-8 lg:p-12 space-y-4">
          <h2 className="text-2xl font-bold lowercase heading">
            still have questions?
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            can&apos;t find what you&apos;re looking for? our team is here to help.
          </p>
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity text-sm">
              contact us
              <ArrowRightIcon className="size-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
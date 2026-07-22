import type { Metadata } from 'next'
import { MailIcon } from '@/lib/icons'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Pro Straps Terms of Service. Understand your rights and responsibilities when shopping with us.',
}



export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-dark dark:bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lowercase heading">
            terms of service
          </h1>
          <p className="mt-3 text-white/60 text-sm">last updated: june 2025</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          these terms of service (&ldquo;terms&rdquo;) govern your use of the pro straps website and the purchase of our products. by accessing or using our website, you agree to be bound by these terms.
        </p>

        <Section title="1. acceptance of terms">
          <p>by accessing, browsing, or using the pro straps website, you acknowledge that you have read, understood, and agree to be bound by these terms. if you do not agree, please do not use our website.</p>
        </Section>

        <Section title="2. account registration">
          <p>to place an order, you may be required to create an account. you agree to provide accurate and complete information and to keep your account credentials confidential. you are responsible for all activities under your account.</p>
        </Section>

        <Section title="3. products and pricing">
          <ul>
            <li>all product descriptions, images, and prices are subject to change without notice</li>
            <li>prices are listed in indian rupees (inr) and are inclusive of applicable taxes</li>
            <li>we reserve the right to limit quantities and refuse service to anyone</li>
            <li>colour accuracy may vary slightly due to screen settings and photography lighting</li>
            <li>product dimensions are approximate and may have minor variations due to the handmade nature of our products</li>
          </ul>
        </Section>

        <Section title="4. orders and payment">
          <ul>
            <li>placing an order constitutes an offer to purchase. acceptance occurs upon shipment</li>
            <li>we reserve the right to cancel orders due to pricing errors, stock unavailability, or suspected fraud</li>
            <li>payment must be made at the time of purchase through our accepted payment methods</li>
            <li>cod orders are limited to a maximum of ₹5,000</li>
          </ul>
        </Section>

        <Section title="5. shipping and delivery">
          <p>shipping terms and delivery timelines are as described in our <Link href="/shipping" className="underline underline-offset-2 hover:text-lime-dark dark:hover:text-lime transition-colors">shipping policy</Link>. delivery timelines are estimates and are not guaranteed. we are not liable for delays caused by courier partners, natural disasters, or other factors beyond our control.</p>
        </Section>

        <Section title="6. returns and refunds">
          <p>returns and refunds are governed by our <Link href="/returns" className="underline underline-offset-2 hover:text-lime-dark dark:hover:text-lime transition-colors">returns &amp; exchange policy</Link>. by placing an order, you acknowledge and agree to these policies.</p>
        </Section>

        <Section title="7. intellectual property">
          <p>all content on this website — including text, images, logos, graphics, and design — is the property of pro straps and is protected by intellectual property laws. you may not reproduce, distribute, or use our content without prior written permission.</p>
        </Section>

        <Section title="8. user conduct">
          <p>you agree not to use our website to:</p>
          <ul>
            <li>violate any applicable law or regulation</li>
            <li>infringe upon the rights of any third party</li>
            <li>transmit viruses, malware, or harmful code</li>
            <li>attempt to gain unauthorised access to our systems</li>
            <li>use automated tools to scrape or collect data from our website</li>
          </ul>
        </Section>

        <Section title="9. limitation of liability">
          <p>to the fullest extent permitted by law, pro straps shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products. our total liability shall not exceed the amount paid by you for the specific product or service giving rise to the claim.</p>
        </Section>

        <Section title="10. governing law">
          <p>these terms are governed by the laws of india. any disputes shall be subject to the exclusive jurisdiction of the courts in mumbai, maharashtra.</p>
        </Section>

        <Section title="11. changes to terms">
          <p>we may modify these terms at any time. continued use of our website after changes constitutes acceptance of the updated terms.</p>
        </Section>

        <Section title="12. contact">
          <p>for questions about these terms, contact us at:</p>
          <p>
            <MailIcon className="inline size-4 mr-1.5 -mt-0.5" />
            <Link href="mailto:legal@prostraps.in" className="underline underline-offset-2 hover:text-lime-dark dark:hover:text-lime transition-colors">
              legal@prostraps.in
            </Link>
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold lowercase heading">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2 [&_p]:leading-relaxed [&_li]:ml-4 [&_li]:list-disc">
        {children}
      </div>
    </section>
  )
}

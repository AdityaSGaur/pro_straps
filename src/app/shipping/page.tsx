import { TruckIcon, MailIcon } from '@/lib/icons'
import Link from 'next/link'

const ZONES = [
  {
    zone: 'metro cities',
    areas: 'mumbai, delhi, bangalore, chennai, hyderabad, kolkata, pune, ahmedabad',
    standard: '3–5 business days',
    express: '1–2 business days',
    charge: 'free above ₹999 / ₹79',
  },
  {
    zone: 'tier 1 & 2 cities',
    areas: 'jaipur, lucknow, chandigarh, kochi, indore, bhopal, and 100+ other cities',
    standard: '5–7 business days',
    express: '2–3 business days',
    charge: 'free above ₹999 / ₹79',
  },
  {
    zone: 'other areas',
    areas: 'north east india, j&amp;k, island territories, rural areas',
    standard: '7–10 business days',
    express: 'not available',
    charge: 'free above ₹999 / ₹99',
  },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-dark dark:bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lowercase heading">
            shipping information
          </h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto text-sm sm:text-base">
            fast, reliable delivery across india — free on orders above ₹999.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-10">
        {/* Free Shipping Banner */}
        <div className="bg-secondary/50 rounded-2xl p-6 lg:p-8 flex items-start gap-4">
          <TruckIcon className="size-8 text-lime-dark dark:text-lime shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold lowercase heading">free shipping on ₹999+</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              enjoy free standard shipping on all orders above ₹999. orders below this threshold are charged a flat shipping fee of ₹79–₹99 depending on your location.
            </p>
          </div>
        </div>

        {/* Shipping Zones Table */}
        <Section title="shipping zones &amp; delivery times">
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">zone</th>
                  <th className="text-left py-3 pr-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">standard</th>
                  <th className="text-left py-3 pr-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">express</th>
                  <th className="text-left py-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">charge</th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((z) => (
                  <tr key={z.zone} className="border-b border-border last:border-b-0">
                    <td className="py-4 pr-4">
                      <p className="font-medium">{z.zone}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{z.areas}</p>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">{z.standard}</td>
                    <td className="py-4 pr-4 text-muted-foreground">{z.express}</td>
                    <td className="py-4 text-muted-foreground whitespace-nowrap">{z.charge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="order processing">
          <p>orders placed before 2:00 pm ist on business days are typically processed and dispatched within 24 hours. orders placed after 2:00 pm or on weekends/holidays are processed the next business day.</p>
        </Section>

        <Section title="tracking your order">
          <p>once your order ships, you&apos;ll receive an email and sms with a tracking number and a link to track your package in real time. you can also log into your account on our website to view order status.</p>
        </Section>

        <Section title="packaging">
          <p>all straps are carefully packaged in our signature pro straps box with protective wrapping. gift wrapping is available at checkout for ₹99.</p>
        </Section>

        <Section title="important notes">
          <ul>
            <li>delivery timelines are estimates and are not guaranteed</li>
            <li>we are not responsible for delays caused by courier partners, customs, natural disasters, or other factors beyond our control</li>
            <li>currently, we ship only within india. international shipping is coming soon</li>
            <li>cod orders are limited to a maximum of ₹5,000</li>
            <li>incorrect or incomplete addresses may result in delivery delays or returns</li>
          </ul>
        </Section>

        <Section title="need help?">
          <p>
            if you have questions about your shipment, contact us at{' '}
            <MailIcon className="inline size-3.5 mr-1 -mt-0.5" />
            <Link href="mailto:hello@prostraps.in" className="underline underline-offset-2 hover:text-lime-dark dark:hover:text-lime transition-colors">
              hello@prostraps.in
            </Link>{' '}
            with your order number.
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

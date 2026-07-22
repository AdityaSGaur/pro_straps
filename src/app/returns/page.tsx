import { RefreshCwIcon, CheckCircle2Icon, TruckIcon, PackageIcon, MailIcon } from '@/lib/icons'
import Link from 'next/link'

const STEPS = [
  {
    icon: MailIcon,
    title: 'request a return',
    desc: 'email us at hello@prostraps.in with your order number and reason for return within 15 days of delivery.',
  },
  {
    icon: PackageIcon,
    title: 'pack it up',
    desc: 'we\'ll send you a prepaid return label. pack the strap in its original packaging with all tags and accessories.',
  },
  {
    icon: TruckIcon,
    title: 'ship it back',
    desc: 'hand over the package to our courier partner during pickup, or drop it off at the nearest courier hub.',
  },
  {
    icon: CheckCircle2Icon,
    title: 'refund or exchange',
    desc: 'once we inspect the returned item (3–5 business days), we\'ll process your refund or ship your exchange.',
  },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-dark dark:bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lowercase heading">
            returns &amp; exchange policy
          </h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto text-sm sm:text-base">
            hassle-free returns within 15 days. no questions asked.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
        {/* Policy Highlight */}
        <div className="bg-secondary/50 rounded-2xl p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <RefreshCwIcon className="size-8 text-lime-dark dark:text-lime shrink-0 mt-0.5" />
            <div className="space-y-3">
              <h2 className="text-xl font-bold lowercase heading">15-day easy returns</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                we want you to love your strap. if it doesn&apos;t meet your expectations, return it within 15 days of delivery for a full refund or exchange — no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <Section title="return conditions">
          <p>to be eligible for a return, your item must meet the following conditions:</p>
          <ul>
            <li>returned within 15 days of delivery</li>
            <li>unused, unworn, and in its original condition</li>
            <li>in original packaging with all tags, cards, and accessories intact</li>
            <li>not personalised, engraved, or made-to-order (custom straps are non-returnable unless defective)</li>
            <li>not purchased during a final sale or clearance event (these are marked as such)</li>
          </ul>
        </Section>

        {/* Non-returnable items */}
        <Section title="non-returnable items">
          <ul>
            <li>custom-made or engraved straps (unless there is a manufacturing defect)</li>
            <li>straps that have been worn, used, or altered in any way</li>
            <li>straps returned without original packaging or accessories</li>
            <li>items purchased during clearance or final sale events</li>
            <li>gift cards</li>
          </ul>
        </Section>

        {/* How to Return */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold lowercase heading">how to return</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            follow these simple steps to initiate your return:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {STEPS.map((step, idx) => (
              <div
                key={step.title}
                className="bg-secondary/50 rounded-xl p-5 space-y-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <step.icon className="size-4 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Exchanges */}
        <Section title="exchanges">
          <p>exchanges for a different size or colour of the same product are free and processed quickly. if you&apos;d like to exchange for a different product, we&apos;ll issue a store credit for the full purchase amount.</p>
          <p>exchange requests are subject to stock availability. if the desired item is out of stock, we&apos;ll offer a store credit or refund instead.</p>
        </Section>

        {/* Refunds */}
        <Section title="refund process">
          <ul>
            <li>refunds are processed within 3–5 business days after we receive and inspect the returned item</li>
            <li>the refund is credited back to your original payment method (card, upi, etc.)</li>
            <li>please allow an additional 5–7 business days for your bank to reflect the refund</li>
            <li>cod orders are refunded via bank transfer (neft) — you&apos;ll need to provide your bank details</li>
            <li>shipping charges are non-refundable for orders that did not qualify for free shipping</li>
          </ul>
        </Section>

        {/* Damaged/Defective */}
        <Section title="damaged or defective items">
          <p>if you receive a damaged or defective item, contact us within 48 hours of delivery with photos. we&apos;ll arrange a free return and send a replacement at no extra cost, or issue a full refund — your choice.</p>
        </Section>

        {/* Contact */}
        <Section title="need help?">
          <p>
            our support team is here to help. email us at{' '}
            <MailIcon className="inline size-3.5 mr-1 -mt-0.5" />
            <Link href="mailto:hello@prostraps.in" className="underline underline-offset-2 hover:text-lime-dark dark:hover:text-lime transition-colors">
              hello@prostraps.in
            </Link>{' '}
            with your order number and we&apos;ll get back to you within 24 hours.
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

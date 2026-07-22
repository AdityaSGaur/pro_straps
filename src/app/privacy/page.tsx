import type { Metadata } from 'next'
import { MailIcon } from '@/lib/icons'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Pro Straps Privacy Policy. Learn how we collect, use, and protect your personal information.',
}



export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-dark dark:bg-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lowercase heading">
            privacy policy
          </h1>
          <p className="mt-3 text-white/60 text-sm">last updated: june 2025</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          at pro straps, we take your privacy seriously. this privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our products.
        </p>

        <Section title="1. information we collect">
          <p>we collect information that you provide directly to us, including:</p>
          <ul>
            <li><strong>personal information:</strong> name, email address, phone number, shipping and billing addresses when you create an account or place an order.</li>
            <li><strong>payment information:</strong> credit/debit card details, upi id, or other payment method information. all payment data is processed through razorpay and is never stored on our servers.</li>
            <li><strong>communication data:</strong> messages, emails, and support tickets you send us.</li>
            <li><strong>preferences:</strong> newsletter subscriptions, marketing preferences, and website personalization settings.</li>
          </ul>
          <p>we also automatically collect certain information when you visit our website, including your ip address, browser type, device information, pages visited, and referring urls through cookies and similar technologies.</p>
        </Section>

        <Section title="2. how we use your information">
          <p>we use the information we collect to:</p>
          <ul>
            <li>process and fulfil your orders, including shipping, returns, and exchanges</li>
            <li>communicate with you about your orders, products, and promotions</li>
            <li>send you marketing communications (with your consent)</li>
            <li>improve our website, products, and services</li>
            <li>detect and prevent fraud, abuse, and security issues</li>
            <li>comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="3. information sharing">
          <p>we do not sell, trade, or rent your personal information to third parties. we may share your information with:</p>
          <ul>
            <li><strong>service providers:</strong> courier partners (delhivery, blue dart), payment processors (razorpay), and email service providers</li>
            <li><strong>legal requirements:</strong> when required by law, regulation, or legal process</li>
            <li><strong>business transfers:</strong> in connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </Section>

        <Section title="4. cookies and tracking">
          <p>we use cookies and similar technologies to enhance your browsing experience, analyse website traffic, and understand user behaviour. you can control cookie settings through your browser.</p>
          <ul>
            <li><strong>essential cookies:</strong> required for site functionality (cart, sessions, authentication)</li>
            <li><strong>analytics cookies:</strong> help us understand how visitors interact with our site</li>
            <li><strong>marketing cookies:</strong> used to deliver relevant advertisements (only with your consent)</li>
          </ul>
        </Section>

        <Section title="5. data security">
          <p>we implement industry-standard security measures including 256-bit ssl encryption, secure payment processing, and regular security audits to protect your information.</p>
        </Section>

        <Section title="6. data retention">
          <p>we retain your personal information for as long as your account is active or as needed to provide services. order records are retained for a minimum of 6 years for tax and compliance purposes.</p>
        </Section>

        <Section title="7. your rights">
          <p>under applicable data protection laws, you have the right to:</p>
          <ul>
            <li>access the personal information we hold about you</li>
            <li>request correction of inaccurate information</li>
            <li>request deletion of your personal information</li>
            <li>opt out of marketing communications at any time</li>
            <li>request data portability</li>
          </ul>
        </Section>

        <Section title="8. children&apos;s privacy">
          <p>our services are not intended for children under 13. we do not knowingly collect personal information from children.</p>
        </Section>

        <Section title="9. changes to this policy">
          <p>we may update this privacy policy from time to time. the updated version will be posted on this page with a revised &ldquo;last updated&rdquo; date.</p>
        </Section>

        <Section title="10. contact us">
          <p>if you have any questions about this privacy policy, please contact us at:</p>
          <p>
            <MailIcon className="inline size-4 mr-1.5 -mt-0.5" />
            <Link href="mailto:privacy@prostraps.in" className="underline underline-offset-2 hover:text-lime-dark dark:hover:text-lime transition-colors">
              privacy@prostraps.in
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

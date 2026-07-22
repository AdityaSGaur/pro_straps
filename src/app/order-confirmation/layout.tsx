import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your Pro Straps order has been placed. Thank you for shopping with us!',
  robots: { index: false, follow: false },
}

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

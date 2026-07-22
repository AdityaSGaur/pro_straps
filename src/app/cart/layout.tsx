import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected Pro Straps watch bands before checkout. Free shipping on orders above ₹999.',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

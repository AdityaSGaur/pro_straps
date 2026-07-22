import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your Pro Straps wishlist — save your favourite watch straps and bands for later.',
  robots: { index: false, follow: false },
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

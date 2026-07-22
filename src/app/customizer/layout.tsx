import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Watch Strap Customizer',
  description: 'Design your own custom watch strap with the Pro Straps Customizer. Pick material, colour, width, and buckle to match your style.',
}

export default function CustomizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

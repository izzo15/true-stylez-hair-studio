import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { getSeasonalThemeVars } from '@/lib/seasonalTheme'
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'True Stylez Hair Studio | J The Barber',
  description: 'Premium barber shop in Troy, NY. Precision cuts, sharp style. Book your appointment online.',
  keywords: 'barber, haircut, fade, beard trim, troy ny, mens grooming',
  openGraph: {
    title: 'True Stylez Hair Studio | J The Barber',
    description: 'Premium barber shop in Troy, NY. Precision cuts, sharp style.',
    url: 'https://truestylez.com',
    siteName: 'True Stylez Hair Studio',
    images: [{ url: '/og-image.jpg' }],
    locale: 'en_US',
    type: 'website',
  },
}

const seasonalStyles = getSeasonalThemeVars()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `html{ ${seasonalStyles} }` }} />
        <link rel="manifest" href="/manifest.json" />
        <script
          async
          defer
          data-domain="truestylez.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <SessionProvider>
        <body className="antialiased">
          <ServiceWorkerProvider />
          {children}
        </body>
      </SessionProvider>
    </html>
  )
}

import '@/styles/globals.css'
import Providers from '@/components/Providers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
  icons: {
    icon: '/favicon.ico',
  },
}

const seasonalStyles = getSeasonalThemeVars()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

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
      <body className="antialiased">
        <Providers session={session}>
          <ServiceWorkerProvider />
          {children}
        </Providers>
      </body>
    </html>
  )
}

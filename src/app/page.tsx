'use client'

import { useState, useEffect, useCallback } from 'react'
import { HeroContent } from '@/components/Hero/HeroContent'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BarberProfiles } from '@/components/BarberProfiles'
import { Services } from '@/components/Services'
import { ReviewCarousel } from '@/components/Reviews/ReviewCarousel'
import { Chatbot } from '@/components/Chatbot'
import { motion } from 'framer-motion'
import { BookingWidget } from '@/components/BookingWidget'
import { TrimText } from '@/components/TrimText'
import { ShopCam } from '@/components/ShopCam'
import { AIStyleRecommender } from '@/components/AIStyleRecommender'
import { SeasonalOverlay } from '@/components/SeasonalOverlay'
import CssBarberChair from '@/components/CssBarberChair'
import ShopVideo from '@/components/ShopVideo'

// JSON-LD Structured Data for LocalBusiness
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "True Stylez Hair Studio",
  "image": ["https://truestylez.com/og-image.jpg"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Barber Street",
    "addressLocality": "Troy",
    "addressRegion": "NY",
    "postalCode": "12180",
    "addressCountry": "US"
  },
  "telephone": "+1-555-123-4567",
  "url": "https://truestylez.com",
  "priceRange": "$$",
  "servesCuisine": "Barber shop",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 42.7284,
    "longitude": -73.6918
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:00",
    "closes": "19:00"
  }],
  "department": [{
    "@type": "BarberShop",
    "name": "True Stylez Hair Studio",
    "url": "https://truestylez.com"
  }]
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!visible) return null

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:bg-accent/80 transition-colors"
      aria-label="Back to top"
      title="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  )
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd, null, 2) }} />
      <Navbar />
      <BackToTopButton />
      <main className="relative">
        <section id="hero" className="min-h-screen">
          <HeroContent />
        </section>
        
        <section id="about" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              <TrimText text="True Stylez" alternate="J The Barber" />
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-lg text-center max-w-3xl mx-auto text-gray-300">
                Where precision meets artistry. Located in the heart of Troy, NY, we deliver 
                sharp cuts and legendary fades. Your style journey starts here.
              </p>
            </motion.div>
            <ShopCam />
          </div>
        </section>

        <section id="barbers" className="py-20 px-4 bg-primary-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Master Barbers</h2>
            <BarberProfiles />
          </div>
        </section>

        <section id="services" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
            <Services />
          </div>
        </section>

        <section id="book" className="py-20 px-4 bg-primary-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Book Your Cut</h2>
            <p className="text-center text-gray-400 mb-12">Select your service and time</p>
            <BookingWidget />
          </div>
        </section>

        <section id="style-match" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Style Match AI</h2>
            <AIStyleRecommender />
          </div>
        </section>

        <section id="3d-showcase" className="py-20 px-4 bg-primary-800/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">The Chair</h2>
            <CssBarberChair />
          </div>
        </section>

        <section id="reviews" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">What They Say</h2>
            <ReviewCarousel />
          </div>
        </section>

        <Chatbot />
        <SeasonalOverlay />
      </main>
      <Footer />
    </>
  )
}
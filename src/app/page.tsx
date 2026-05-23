'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

// ── Existing named-export components ────────────────────────────────────────
import { Navbar }               from '@/components/Navbar'
import { Footer }               from '@/components/Footer'
import { Services }             from '@/components/Services'
import { ReviewCarousel }       from '@/components/Reviews/ReviewCarousel'
import { HeroContent }          from '@/components/Hero/HeroContent'
import { ShopCam }              from '@/components/ShopCam'
import { ShopVideo }            from '@/components/ShopVideo'
import { TrimText }             from '@/components/TrimText'
import { TheCraft }             from '@/components/sections/TheCraft'
import { TheTransformation }    from '@/components/sections/TheTransformation'
import { LivingPolaroid, BarberProfile } from '@/components/sections/LivingPolaroid'
import { MobileQuickBook }      from '@/components/MobileQuickBook'
import { Screensaver }          from '@/components/Screensaver'
import { BookingWidget }        from '@/components/BookingWidget'

// ── Default-export components (lazy-load chatbot for page weight budget) ───
import dynamic from 'next/dynamic'

const Chatbot  = dynamic(() => import('@/components/Chatbot').then(m => m.default || m), { ssr: false })
const ChatToggle = dynamic(() => import('@/components/Chatbot/ChatToggle').then(m => m.default || m), { ssr: false })
import AIStyleRecommender from '@/components/AIStyleRecommender'

// ── JSON-LD Structured Data ──────────────────────────────────────────────────
const localBusinessJsonLd = {
  '@context'  : 'https://schema.org',
  '@type'     : 'LocalBusiness',
  name        : 'True Stylez Hair Studio',
  image       : ['https://truestylez.com/og-image.jpg'],
  address     : {
    '@type'           : 'PostalAddress',
    streetAddress     : '332 Congress St, Suite 1',
    addressLocality   : 'Troy',
    addressRegion     : 'NY',
    postalCode        : '12180',
    addressCountry    : 'US',
  },
  telephone   : '+1-518-961-6997',
  url         : 'https://truestylez.com',
  priceRange  : '$$',
  geo         : {
    '@type'    : 'GeoCoordinates',
    latitude  : 42.7284,
    longitude : -73.6918,
  },
  openingHoursSpecification: [
    {
      '@type'    : 'OpeningHoursSpecification',
      dayOfWeek  : ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens      : '10:00',
      closes     : '18:00',
    },
    {
      '@type'    : 'OpeningHoursSpecification',
      dayOfWeek  : ['Saturday'],
      opens      : '10:00',
      closes     : '16:30',
    },
  ],
}

// ── Skip-to-content (accessibility) ─────────────────────────────────────────
function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                 focus:z-[9999] focus:px-5 focus:py-3 focus:bg-accent
                 focus:text-white focus:rounded-full focus:font-semibold
                 focus:shadow-lg focus:outline-none transition-all"
    >
      Skip to main content
    </a>
  )
}

// ── Back-to-top button ───────────────────────────────────────────────────────
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
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full
                 bg-accent text-white flex items-center justify-center
                 shadow-lg hover:shadow-accent/40 transition-shadow duration-300
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
      aria-label="Back to top"
      title="Back to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  )
}

// ── Section heading helper ───────────────────────────────────────────────────
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={`mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {eyebrow && (
        <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const scrollToBookNow = useCallback(() => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /* ── Chat panel state (lifted from <Chatbot /> component) ────────── */
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [bookingPrefill, setBookingPrefill] = useState<{
    serviceId?: string; barberId?: string | null; date?: string | null; time?: string | null
  } | null>(null)

  /* Prefetch API data so navigation is instant */
  useEffect(() => {
    // Warm the API caches
    fetch('/api/services', { priority: 'low' as any }).catch(() => {})
    fetch('/api/barbers',   { priority: 'low' as any }).catch(() => {})
  }, [])

  /*
   * Track unread messages:
   *   'chatbot-on-message' → fired by Chatbot after every bot msg
   *   'chatbot-toggle'   → fired by Chatbot whenever isOpen changes
   */
  useEffect(() => {
    const onBotMsg = () => {
      if (!isChatOpen) setUnreadCount((c) => c + 1)
    }
    const onToggle = (e: Event) => {
      const ev = e as CustomEvent<boolean>
      setIsChatOpen(ev.detail)
      if (ev.detail) setUnreadCount(0)   // clear badge on open
    }

    window.addEventListener('chatbot-on-message', onBotMsg as EventListener)
    window.addEventListener('chatbot-toggle',   onToggle as EventListener)
    return () => {
      window.removeEventListener('chatbot-on-message', onBotMsg as EventListener)
      window.removeEventListener('chatbot-toggle',   onToggle as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen])

  /*
   * Forward 'chatbot-close' (with optional prefill payload) from the
   * Chatbot panel into local state so BookingWidget can consume it.
   */
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{
        serviceId?: string; barberId?: string | null; date?: string | null; time?: string | null
      } | undefined>
      setBookingPrefill(ev.detail ?? null)
      setIsChatOpen(false)
      // Scroll to the booking section
      setTimeout(() => {
        document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
    window.addEventListener('chatbot-close', handler as EventListener)
    return () =>
      window.removeEventListener('chatbot-close', handler as EventListener)
  }, [])

  return (
    <>
      {/* ── Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd, null, 2),
        }}
      />

      {/* ── Accessibility ── */}
      <SkipToContent />

      {/* ── Overlay Components ── */}
      <Screensaver />
      <MobileQuickBook />

      <Navbar />

      <BackToTopButton />

      {/* Chat toggle — rendered here so it’s in the page layout, controlled by Chatbot events */}
      <ChatToggle isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} unreadCount={unreadCount} />

      <main id="main" className="relative">
        {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
        <section id="hero" aria-label="Welcome — True Stylez Hair Studio">
          <HeroContent />
        </section>

        {/* ── 2. The Craft ────────────────────────────────────────────────── */}
        <section id="the-craft" aria-label="Our craft">
          <TheCraft />
        </section>

        {/* ── 3. The Transformation ────────────────────────────────────────── */}
        <section
          id="the-transformation"
          aria-label="Before and after transformations"
        >
          <TheTransformation />
        </section>

        {/* ── 4. About ────────────────────────────────────────────────────── */}
        <section id="about" className="py-24 md:py-32 px-4" aria-labelledby="about-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="The Studio"
              title={<TrimText text="True Stylez" alternate="J The Barber" />}
              subtitle="Where precision meets artistry. Located in the heart of Troy, NY, we deliver sharp cuts and legendary fades. Your style journey starts here."
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <ShopVideo />
              <ShopCam />
            </motion.div>
          </div>
        </section>

        {/* ── 5. The Throne ────────────────────────────────────────────────── */}
        <section id="throne" className="py-24 md:py-32 px-4 bg-primary-800/30" aria-labelledby="throne-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="The Throne" subtitle="Sharp enough to see yourself 10 years from now." />
            <div className="flex justify-center">
              <CssBarberChair />
            </div>
          </div>
        </section>

        {/* ── 6. Barber Profile ────────────────────────────────────────────── */}
        <section
          id="barbers"
          className="py-24 md:py-32 px-4 bg-primary-800/50"
          aria-labelledby="barbers-heading"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="The Master" />
            <BarberProfile />
          </div>
        </section>

        {/* ── 7. Services ─────────────────────────────────────────────────── */}
        <section id="services" className="py-24 md:py-32 px-4" aria-labelledby="services-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Menu"
              title="Our Services"
              subtitle="Every cut is a conversation between clipper and canvas."
            />
            <Services />
          </div>
        </section>

        {/* ── 8. AI Hairstyle Recommender ─────────────────────────────────── */}
        <section
          id="ai-recommender"
          className="py-24 md:py-32 px-4 bg-primary-800/30"
          aria-labelledby="ai-heading"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="AI-Powered"
              title="AI Hairstyle Recommender"
              subtitle="Upload a photo and let our AI match your face shape to the perfect cut."
            />
            <AIStyleRecommender />
          </div>
        </section>

        {/* ── 9. Book ─────────────────────────────────────────────────────── */}
        <section
          id="book"
          className="py-24 md:py-32 px-4 bg-primary-800/30"
          aria-labelledby="book-heading"
        >
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              eyebrow="Reserve"
              title="Book Your Cut"
              subtitle="Choose your service, pick your barber, and lock in your slot."
            />
            <BookingWidget
              prefill={bookingPrefill ?? undefined}
            />
          </div>
        </section>

        {/* ── 10. Reviews ─────────────────────────────────────────────────── */}
        <section id="reviews" className="py-24 md:py-32 px-4" aria-labelledby="reviews-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="What They Say" />
            <ReviewCarousel />
          </div>
        </section>
      </main>

      {/* ── Chat ──────────────────────────────────────────────────────────── */}
      <Chatbot
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        unreadCount={unreadCount}
        bookingPrefill={bookingPrefill}
        onPrefillConsumed={() => setBookingPrefill(null)}
      />

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <Footer />
    </>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

// ── Section-rhythm system ────────────────────────────────────────────────────
// Two named surface tiers applied by a strict alternating rule down the page,
// so pacing reads as intentional rather than an ad hoc mix of opacity values.
const SURFACE_RAISED = 'bg-obsidian-800/40'

// ── Existing named-export components ────────────────────────────────────────
import { Services }     from '@/components/Services'
import { HeroContent }  from '@/components/Hero/HeroContent'
import ShopCam          from '@/components/ShopCam'
import ShopVideo        from '@/components/ShopVideo'
import { TrimText }     from '@/components/TrimText'
import CssBarberChair   from '@/components/CssBarberChair'
import { TheCraft }     from '@/components/sections/TheCraft'
import { BarberProfile } from '@/components/sections/LivingPolaroid'
import { Screensaver }         from '@/components/Screensaver'
import { MobileQuickBook }     from '@/components/MobileQuickBook'
import { BookingWidget }       from '@/components/BookingWidget'
import { Products }            from '@/components/Products'
import dynamic from 'next/dynamic'

// ── New / updated components ──────────────────────────────────────────────────
import { BeforeAfterSlider }  from '@/components/BeforeAfterSlider'
import { BeforeAfterPlaceholderPanel } from '@/components/BeforeAfterPlaceholder'
import { MobileBookCTA }      from '@/components/MobileBookCTA'
import { LiveReviews }        from '@/components/Reviews/LiveReviews'
import { InstagramFeed }      from '@/components/InstagramFeed'

// ── Default-export components (lazy-loaded for page weight) ───────────────────
const Chatbot    = dynamic(() => import('@/components/Chatbot').then(m => m.default || m),  { ssr: false })
const ChatToggle = dynamic(() => import('@/components/Chatbot/ChatToggle').then(m => m.default || m), { ssr: false })
import { AIStyleRecommender } from '@/components/AIStyleRecommender'

// ── JSON-LD Structured Data ──────────────────────────────────────────────────
const localBusinessJsonLd = {
  '@context'  : 'https://schema.org',
  '@type'     : 'LocalBusiness',
  name        : 'True Stylez Hair Studio',
  image       : ['https://truestylez.com/og-image.jpg'],
  address     : {
    '@type'        : 'PostalAddress',
    streetAddress  : '332 Congress St, Suite 1',
    addressLocality: 'Troy',
    addressRegion  : 'NY',
    postalCode     : '12180',
    addressCountry : 'US',
  },
  telephone   : '+1-518-961-6997',
  url         : 'https://truestylez.com',
  priceRange  : '$$',
  geo         : {
    '@type'   : 'GeoCoordinates',
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
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  )
}

// ── Section heading helper ───────────────────────────────────────────────────
function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  id?: string
  eyebrow?: string
  title: React.ReactNode
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
      <h2 id={id} className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading">
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

// ── Blog promo section ───────────────────────────────────────────────────────
function BlogPromo() {
  return (
    <section className={`py-16 md:py-20 px-4 ${SURFACE_RAISED}`} aria-labelledby="blog-promo-heading">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">
          From the Chair
        </p>
        <h2 id="blog-promo-heading" className="text-2xl md:text-3xl font-bold font-heading">
          Tips &amp; Insights
        </h2>
        <p className="mt-3 text-gray-400 max-w-lg mx-auto">
          Expert barbering advice and grooming hacks from Jonathan — straight from the chair.
        </p>
        <a
          href="/blog"
          className="
            inline-flex items-center gap-2
            mt-6
            bg-clove/10 border border-clove/40
            text-clove-light font-semibold
            px-5 py-2.5 rounded-lg
            text-sm
            hover:bg-clove/20 transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-clove
          "
        >
          Read the Blog
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const scrollToBookNow = useCallback(() => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /* ── Chat panel state (lifted from <Chatbot /> component) ───────────────── */
  const [isChatOpen, setIsChatOpen]       = useState(false)
  const [unreadCount, setUnreadCount]     = useState(0)
  const [bookingPrefill, setBookingPrefill] = useState<{
    serviceId?: string; barberId?: string | null; date?: string | null; time?: string | null
  } | null>(null)

  /* Prefetch API data so navigation is instant */
  useEffect(() => {
    fetch('/api/services', { priority: 'low' as any }).catch(() => {})
    fetch('/api/barbers',   { priority: 'low' as any }).catch(() => {})
  }, [])

  useEffect(() => {
    const onBotMsg = () => { if (!isChatOpen) setUnreadCount(c => c + 1) }
    const onToggle = (e: Event) => {
      const ev = e as CustomEvent<boolean>
      setIsChatOpen(ev.detail)
      if (ev.detail) setUnreadCount(0)
    }
    window.addEventListener('chatbot-on-message', onBotMsg as EventListener)
    window.addEventListener('chatbot-toggle',   onToggle as EventListener)
    return () => {
      window.removeEventListener('chatbot-on-message', onBotMsg as EventListener)
      window.removeEventListener('chatbot-toggle',   onToggle as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen])

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{
        serviceId?: string; barberId?: string | null; date?: string | null; time?: string | null
      } | undefined>
      setBookingPrefill(ev.detail ?? null)
      setIsChatOpen(false)
      setTimeout(() => {
        document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
    window.addEventListener('chatbot-close', handler as EventListener)
    return () => window.removeEventListener('chatbot-close', handler as EventListener)
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

      <BackToTopButton />

      <ChatToggle isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} unreadCount={unreadCount} />

      {/* MobileBookCTA — fixed bottom bar for mobile */}
      <MobileBookCTA />

      {/* The main container gets extra bottom padding on mobile so the
          fixed CTA bar never covers the last section */}
      <main id="main" className="relative pb-20 md:pb-0">

        {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
        <section id="hero" aria-label="Welcome — True Stylez Hair Studio">
          <HeroContent />
        </section>

        {/* ── 2. The Craft ────────────────────────────────────────────────── */}
        <section id="the-craft" aria-label="Our craft">
          <TheCraft />
        </section>

        {/* ── 3. Transformation — Before & After Slider ───────────────────── */}
        <section
          id="the-transformation"
          aria-label="Before and after transformation showcase"
        >
          <BeforeAfterSlider
            beforeContent={<BeforeAfterPlaceholderPanel variant="before" />}
            afterContent={<BeforeAfterPlaceholderPanel variant="after" />}
            beforeAlt="Before hair transformation at True Stylez"
            afterAlt="After hair transformation at True Stylez"
            isSample
          />
        </section>

        {/* ── 4. About ────────────────────────────────────────────────────── */}
        <section id="about" className="py-24 md:py-32 px-4" aria-labelledby="about-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              id="about-heading"
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
        <section id="throne" className={`py-24 md:py-32 px-4 ${SURFACE_RAISED}`} aria-labelledby="throne-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading id="throne-heading" title="The Throne" subtitle="Sharp enough to see yourself 10 years from now." />
            <div className="flex justify-center">
              <CssBarberChair />
            </div>
          </div>
        </section>

        {/* ── 6. Barber Profile ────────────────────────────────────────────── */}
        {/* No extra padding/heading wrapper here — LivingPolaroid renders its
            own full section (heading, padding, background); this just needs
            to exist so the #barbers nav anchor has somewhere to land. */}
        <div id="barbers">
          <BarberProfile headingId="barbers-heading" />
        </div>

        {/* ── 6.5. Products (Grooming Essentials) ──────────────────────────── */}
        <Products />

        {/* ── 7. Services ─────────────────────────────────────────────────── */}
        <section id="services" className="py-24 md:py-32 px-4" aria-labelledby="services-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              id="services-heading"
              eyebrow="Menu"
              title="Our Services"
              subtitle="Every cut is a conversation between clipper and canvas."
            />
            <Services />
          </div>
        </section>

        {/* ── 8. Blog promo ─────────────────────────────────────────────────── */}
        <BlogPromo />

        {/* ── 9. AI Hairstyle Recommender ─────────────────────────────────── */}
        <section
          id="ai-recommender"
          className="py-24 md:py-32 px-4"
          aria-labelledby="ai-heading"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              id="ai-heading"
              eyebrow="AI-Powered"
              title="AI Hairstyle Recommender"
              subtitle="Upload a photo and let our AI match your face shape to the perfect cut."
            />
            <AIStyleRecommender />
          </div>
        </section>

        {/* ── 10. Book ─────────────────────────────────────────────────────── */}
        <section
          id="book"
          className={`py-24 md:py-32 px-4 ${SURFACE_RAISED}`}
          aria-labelledby="book-heading"
        >
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              id="book-heading"
              eyebrow="Reserve"
              title="Book Your Cut"
              subtitle="Choose your service, pick your barber, and lock in your slot."
            />
            <BookingWidget
              prefill={bookingPrefill ?? undefined}
            />
          </div>
        </section>

        {/* ── 11. Live Google Reviews ───────────────────────────────────────── */}
        <section id="reviews" className="py-24 md:py-32 px-4" aria-labelledby="reviews-heading">
          <div className="max-w-6xl mx-auto">
            <SectionHeading id="reviews-heading" title="What They Say" />
            <LiveReviews />
          </div>
        </section>

        {/* ── 12. Instagram Feed ─────────────────────────────────────────────── */}
        <InstagramFeed />
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
    </>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { KonamiCode } from '@/components/KonamiCode'
import { GestureNav } from '@/components/GestureNav'

/* ── Navbar variants ───────────────────────────────────────────────────────── */

const scrolledClasses = 'glass shadow-glass'

const brandStyle = {
  initial : { opacity: 0.7, scale: 1,   y:  0 },
  scrolled: { opacity: 1,   scale: 0.9, y: 10 },
}
const brandTagStyle = {
  initial : { opacity: 0,  scale: 0.9, y:  0 },
  scrolled: { opacity: 1,  scale: 1.1, y: -10 },
}

const navLinks = ['About', 'Services', 'Barbers', 'Reviews'] as const

/** Blog link — always routes to /blog, not an anchor */
const blogLink: { label: string; href: string } = {
  label: 'Blog',
  href: '/blog',
}

/* ── Sub-component: Confetti rain ──────────────────────────────────────────── */

function ConfettiRain({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 text-clove select-none"
          initial={{ opacity: 0, scale: 0, y: -20 }}
          animate={{
            opacity : [0, 1, 0],
            scale   : [0, 1, 0],
            x       : (Math.random() - 0.5) * 420,
            y       : (Math.random() - 0.5) * 420,
            rotate  : Math.random() * 360,
          }}
          transition={{ delay: i * 0.022, duration: 1.1, ease: 'easeOut' }}
        >
          ✂️
        </motion.div>
      ))}
    </div>
  )
}

/* ── Sub-component: Logo mark ──────────────────────────────────────────────── */

function LogoMark({ scrolled, isBirthday }: {
  scrolled   : boolean
  isBirthday : boolean
}) {
  const [triggers, setTriggers] = useState(0)

  const handleFire = useCallback(() => {
    setTriggers((n) => {
      if (n + 1 >= 5) {
        setTimeout(() => setTriggers(0), 500)
        return 0
      }
      return n + 1
    })
  }, [])

  return (
    <Link
      href="/"
      onClick={handleFire}
      className="text-2xl font-heading font-extrabold tracking-tight select-none
                 logo-trigger logo-vibrate"
      aria-label="True Stylez Hair Studio — Home"
    >
      <motion.span
        initial={brandStyle.initial}
        animate={brandStyle.scrolled}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        True Stylez
      </motion.span>
      <motion.span
        initial={brandTagStyle.initial}
        animate={brandTagStyle.scrolled}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="text-clove"
      >
        {' '}
        J The Barber
        {isBirthday && (
          <span
            className="ml-1 inline-block"
            role="img"
            aria-label="today is the barber's birthday"
            title="Jonathan's birthday"
          >
            🎩
          </span>
        )}
      </motion.span>
    </Link>
  )
}

/* ── Sub-component: Desktop nav links ─────────────────────────────────────── */

function DesktopNav({ scrolled, isHome }: { scrolled: boolean; isHome: boolean }) {
  return (
    <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
      {navLinks.map((item) => (
        <Link
          key={item}
          href={isHome ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`}
          className="relative text-sm font-medium tracking-wide
                     text-gray-300 hover:text-white
                     transition-colors duration-200
                     after:absolute after:bottom-[-3px] after:left-0
                     after:h-[2px] after:w-0 after:bg-clove
                     after:transition-all after:duration-300
                     hover:after:w-full"
        >
          {item}
        </Link>
      ))}
      {/* Blog — full-page link */}
      <Link
        href={blogLink.href}
        className="relative text-sm font-medium tracking-wide
                   text-gray-300 hover:text-white
                   transition-colors duration-200
                   after:absolute after:bottom-[-3px] after:left-0
                   after:h-[2px] after:w-0 after:bg-clove
                   after:transition-all after:duration-300
                   hover:after:w-full"
      >
        {blogLink.label}
      </Link>
    </nav>
  )
}

/* ── Sub-component: Desktop CTA button ─────────────────────────────────────── */

const bookNowClasses = `
  px-6 py-2 rounded-full font-semibold text-sm tracking-wide
  bg-clove text-white
  hover:bg-clove-light active:bg-clove-dark
  transition-colors duration-200
  shadow-glow-clove hover:shadow-glow-clove-lg
  logo-vibrate
`

function BookNowButton({ isHome }: { isHome: boolean }) {
  const handleClick = useCallback(() => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  if (!isHome) {
    return (
      <Link href="/#book" className={bookNowClasses}>
        Book Now
      </Link>
    )
  }

  return (
    <button type="button" onClick={handleClick} className={bookNowClasses}>
      Book Now
    </button>
  )
}

/* ── Sub-component: Hamburger (mobile) ─────────────────────────────────────── */

function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="md:hidden relative w-8 h-8 flex flex-col items-center
                 justify-center gap-[5px] bg-transparent
                 focus:outline-none focus-visible:ring-2
                 focus-visible:ring-clove focus-visible:rounded"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      <span
        className={`block h-[2px] w-5 bg-white rounded-full
                    transition-all duration-200 origin-center
                    ${open ? 'translate-y-[7px] rotate-45' : ''}`}
      />
      <span
        className={`block h-[2px] w-5 bg-white rounded-full
                    transition-all duration-200
                    ${open ? 'opacity-0 scale-x-0' : ''}`}
      />
      <span
        className={`block h-[2px] w-5 bg-white rounded-full
                    transition-all duration-200 origin-center
                    ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
      />
    </button>
  )
}

/* ── Sub-component: Mobile drawer ─────────────────────────────────────────── */

function MobileDrawer({ open, onClose, isHome }: { open: boolean; onClose: () => void; isHome: boolean }) {
  const handleLinkClick = useCallback(() => { onClose() }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      initial={{ x: '100%' }}
      animate={{ x: open ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="fixed inset-y-0 right-0 z-[60] w-72 bg-obsidian-800/95
                 backdrop-blur-xl border-l border-white/[0.07]
                 px-6 py-20 flex flex-col gap-6 md:hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {navLinks.map((item) => (
        <Link
          key={item}
          href={isHome ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`}
          onClick={handleLinkClick}
          className="text-xl font-heading font-semibold text-gray-200
                     hover:text-clove transition-colors"
        >
          {item}
        </Link>
      ))}
      {/* Blog — full-page link */}
      <Link
        href={blogLink.href}
        onClick={handleLinkClick}
        className="text-xl font-heading font-semibold text-gray-200
                   hover:text-clove transition-colors"
      >
        {blogLink.label}
      </Link>
      {isHome ? (
        <button
          type="button"
          onClick={() => {
            handleLinkClick()
            document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="mt-2 w-full py-3 rounded-full bg-clove text-white
                     font-semibold text-sm tracking-wide text-center"
        >
          Book Now
        </button>
      ) : (
        <Link
          href="/#book"
          onClick={handleLinkClick}
          className="mt-2 w-full py-3 rounded-full bg-clove text-white
                     font-semibold text-sm tracking-wide text-center"
        >
          Book Now
        </Link>
      )}
    </motion.div>
  )
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [isBirthday, setIsBirthday] = useState(false)
  const [triggerCount, setTriggerCount] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const clickTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Birthday check ── */
  useEffect(() => {
    const now = new Date()
    setIsBirthday(now.getMonth() === 4 && now.getDate() === 22)
  }, [])

  /* ── Intercept Escape to close mobile drawer ── */
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  /* ── Close drawer on route hash-links ── */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onHashChange = () => setDrawerOpen(false)
      window.addEventListener('hashchange', onHashChange)
      return () => window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const scrollToBook = useCallback(() => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <KonamiCode />
      <GestureNav />

      {/* Click-count easter-egg state indicator */}
      {triggerCount > 0 && (
        <div className="fixed top-14 right-4 z-50 text-xs text-clove/60 font-mono">
          {`✂ ${triggerCount}/5`}
        </div>
      )}

      <ConfettiRain show={triggerCount >= 5} />

      <motion.nav
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-300
          ${scrolled ? scrolledClasses : 'bg-transparent py-4 md:py-5'}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        role="navigation"
        aria-label="Site navigation"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <LogoMark scrolled={scrolled} isBirthday={isBirthday} />

          {/* Desktop links + CTA */}
          <div className="hidden md:flex items-center gap-10">
            <DesktopNav scrolled={scrolled} isHome={isHome} />
            <BookNowButton isHome={isHome} />
          </div>

          {/* Hamburger */}
          <Hamburger open={drawerOpen} onClick={() => setDrawerOpen((o) => !o)} />
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} isHome={isHome} />
    </>
  )
}

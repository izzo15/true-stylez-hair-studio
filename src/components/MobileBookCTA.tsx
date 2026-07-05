'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * MobileBookCTA
 *
 * A fixed "Book Now" button that only appears on mobile screens (below `md`).
 * Uses an Intersection Observer to auto-hide itself when the booking widget
 * section (`#book`) is already visible in the viewport.
 *
 * Intended to be rendered once inside the main page layout (e.g. `page.tsx`).
 */
export function MobileBookCTA() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isHidden, setIsHidden] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const bookingSection = document.getElementById('book')
    if (!bookingSection) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsHidden(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '0px' },
    )

    observerRef.current.observe(bookingSection)

    return () => observerRef.current?.disconnect()
  }, [isMounted])

  const scrollToBook = useCallback(() => {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Avoid hydration mismatch — only render after mount
  if (!isMounted) return null

  return (
    <motion.div
      className={`
        fixed bottom-0 left-0 right-0 z-50 p-4
        md:hidden
        ${isHidden ? 'translate-y-full opacity-0 pointer-events-none' : ''}
      `}
      initial={{ y: 100, opacity: 0 }}
      animate={
        isHidden
          ? { y: 100, opacity: 0 }
          : { y: 0, opacity: 1 }
      }
      transition={
        prefersReduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 30 }
      }
    >
      <button
        onClick={scrollToBook}
        className="
          w-full
          bg-clove text-white font-bold
          py-3 px-6 rounded-xl
          text-lg tracking-wide
          shadow-glow-clove
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-clove focus-visible:ring-offset-2
          focus-visible:ring-offset-primary-900
        "
        aria-label="Book your appointment now"
      >
        Book Now ✂️
      </button>
    </motion.div>
  )
}

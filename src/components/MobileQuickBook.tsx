'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function MobileQuickBook() {
  const barRef = useRef<HTMLDivElement>(null)
  const dismissedRef = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  // isMobile starts false (matching SSR, where `window` doesn't exist) and is
  // only computed on the client after mount, to avoid a hydration mismatch.
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const shouldShow = isMounted && isMobile && !dismissedRef.current

  const smoothScrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
    },
    [prefersReducedMotion]
  )

  useEffect(() => {
    if (!shouldShow) return

    const handleScroll = () => {
      if (!barRef.current) return
      const scrolled = window.scrollY > 80
      barRef.current.style.transform = scrolled
        ? 'translateY(0)'
        : 'translateY(120%)'
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldShow])

  const dismiss = () => {
    dismissedRef.current = true
    if (barRef.current) {
      barRef.current.style.transform = 'translateY(120%)'
    }
  }

  if (!shouldShow) return null

  return (
    <motion.div
      ref={barRef}
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="mx-3 mb-3 rounded-2xl glass border border-accent/20 shadow-[0_-4px_30px_rgba(217,70,0,0.15)] overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm flex-1">
              <span className="text-accent font-bold">Book your cut</span>
              <span className="text-gray-300 block text-xs">
                Available today at 3 pm
              </span>
            </p>
            <button
              onClick={() => smoothScrollTo('book')}
              className="px-5 py-2.5 bg-accent text-white text-sm font-bold rounded-full hover:bg-accent/90 active:scale-95 transition-all shadow-[0_0_16px_var(--color-accent,#d94600)] whitespace-nowrap"
            >
              Book Now
            </button>
          </div>

          <button
            onClick={dismiss}
            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors text-xs"
            aria-label="Dismiss quick book bar"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  )
}

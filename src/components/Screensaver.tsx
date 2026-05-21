'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SCREENSAVER_INACTIVITY_MS = 60_000

export function Screensaver() {
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (active && !prefersReduced) {
      timerRef.current = setTimeout(() => {
        setActive(true)
        setVisible(true)
      }, 3_000)
    }
  }, [active, prefersReduced])

  const dismiss = useCallback(() => {
    setActive(false)
    setVisible(false)
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    if (prefersReduced) return

    if (active) {
      document.body.style.overflow = 'hidden'
      document.body.style.cursor = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.cursor = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.cursor = ''
    }
  }, [active, prefersReduced])

  useEffect(() => {
    if (prefersReduced) return

    const startInactivityTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setActive(true)
        setVisible(true)
      }, SCREENSAVER_INACTIVITY_MS)
    }

    startInactivityTimer()

    const handleActivity = () => {
      if (active) return
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setActive(true)
        setVisible(true)
      }, SCREENSAVER_INACTIVITY_MS)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) dismiss()
      if (!active) {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setActive(true)
          setVisible(true)
        }, SCREENSAVER_INACTIVITY_MS)
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (active && visible && containerRef.current?.contains(e.target as Node)) {
        dismiss()
      }
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClick)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, visible, dismiss, prefersReduced])

  if (!active || prefersReduced) return null

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.2, ease: 'power2.inOut' }}
      onClick={dismiss}
      role="button"
      tabIndex={0}
      aria-label="Dismiss screensaver — press Escape or click anywhere"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') dismiss()
      }}
    >
      <div className="absolute inset-0 bg-primary-900/95 backdrop-blur-sm" />

      <motion.div
        className="relative flex flex-col items-center"
        animate={{ rotateY: 360 }}
        transition={{
          rotateY: { duration: 4, repeat: Infinity, ease: 'linear' },
          opacity: { duration: visible ? 1.2 : 0, ease: 'power2.inOut' },
        }}
        style={{ perspective: 800 }}
      >
        <div className="relative w-16 h-44 rounded-full overflow-hidden">
          <div className="barber-pole absolute inset-0" />
          <div className="poledot-spin absolute inset-0">
            <div className="w-3 h-3 rounded-full bg-accent absolute top-1/2 left-1/2" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-bold font-heading"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            True Stylez
          </motion.h2>
          <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">
            Move mouse or press Escape to wake
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

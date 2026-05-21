'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function TheTransformation() {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPos(pct)
    },
    []
  )

  const handlePointerDown = () => setIsDragging(true)

  const handlePointerUp = () => setIsDragging(false)

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX)
  }

  return (
    <section className="relative py-24 md:py-40 bg-primary-900">
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-6xl font-bold font-heading mb-4">
          The <span className="text-accent">Transformation</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Drag the handle to see the before & after.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div
          ref={containerRef}
          className="relative w-full aspect-[3/4] md:aspect-[4/3] rounded-2xl overflow-hidden select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handlePointerUp}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/textures/barber-bg.jpg')" }}
            aria-label="After transformation"
          >
            <div className="absolute bottom-6 right-6 px-4 py-2 glass rounded-lg">
              <span className="text-accent font-bold text-sm tracking-widest uppercase">
                After
              </span>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/textures/barber-bg.jpg')",
              filter: 'grayscale(0.8) brightness(0.7)',
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
            aria-label="Before transformation"
          >
            <div className="absolute bottom-6 left-6 px-4 py-2 glass rounded-lg">
              <span className="text-gray-300 font-bold text-sm tracking-widest uppercase">
                Before
              </span>
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-accent shadow-[0_0_20px_var(--color-accent,#d94600)] cursor-ew-resize"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            onPointerDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            role="slider"
            aria-valuenow={Math.round(sliderPos)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Before / after slider"
            tabIndex={0}
          />

          <motion.div
            className="absolute top-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-accent rounded-full flex items-center justify-center shadow-[0_0_25px_var(--color-accent,#d94600)] cursor-ew-resize pointer-events-none"
            style={{ left: `${sliderPos}%` }}
            animate={prefersReduced ? {} : { scale: isDragging ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-white pointer-events-none"
            >
              <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-300 text-sm max-w-2xl mx-auto">
            Same cut, different day. Every client leaves seeing the best version of themselves.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

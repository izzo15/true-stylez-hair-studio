'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface BeforeAfterSliderProps {
  /** Image URL shown on the left ("before") side. Omit if beforeContent is provided. */
  beforeImg?: string
  /** Image URL shown on the right ("after") side. Omit if afterContent is provided. */
  afterImg?: string
  /** Alt text for before image */
  beforeAlt?: string
  /** Alt text for after image */
  afterAlt?: string
  /** Custom content to render instead of the before image (e.g. a placeholder panel) */
  beforeContent?: React.ReactNode
  /** Custom content to render instead of the after image (e.g. a placeholder panel) */
  afterContent?: React.ReactNode
  /** Whether this is showing sample/placeholder content rather than a real transformation */
  isSample?: boolean
  /** Initial slider position as a percentage (0-100) */
  defaultPosition?: number
  /** Aspect ratio of the slider container */
  aspect?: string
}

/** Clipper SVG icon used as the drag handle */
function ClipperIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3v13" />
      <path d="M18 3v13" />
      <path d="M6 8h12" />
      <path d="M8 3H6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" />
      <path d="M16 3h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <rect x="3" y="13" width="6" height="5" rx="1" />
      <rect x="9" y="13" width="6" height="5" rx="1" />
      <rect x="15" y="13" width="6" height="5" rx="1" />
    </svg>
  )
}

export function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeAlt = 'Before transformation',
  afterAlt = 'After transformation',
  beforeContent,
  afterContent,
  isSample = false,
  defaultPosition = 50,
  aspect = 'aspect-[4/3]',
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(defaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
      const pct = (x / rect.width) * 100
      setSliderPos(pct)
    },
    [],
  )

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    // TS 5.9 correctly types SyntheticEvent.preventDefault as void (readonly) in strict mode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(e as any).preventDefault()
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    setIsDragging(true)
    handleMove(e.clientX)
  }, [handleMove])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (isDragging) handleMove(e.clientX)
  }, [isDragging, handleMove])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX)
  }, [isDragging, handleMove])

  // Keyboard accessibility for the slider
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setSliderPos(p => Math.min(100, p + 1))
    } else if (e.key === 'ArrowLeft') {
      setSliderPos(p => Math.max(0, p - 1))
    }
  }, [])

  return (
    <section className="relative py-24 md:py-40 bg-primary-900" aria-label="Before and after transformation showcase">
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-6xl font-bold font-heading mb-4">
          The <span className="text-accent">Transformation</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Drag the handle to see the before &amp; after.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div
          ref={containerRef}
          className={`relative w-full ${aspect} rounded-2xl overflow-hidden select-none touch-none`}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handlePointerUp}
          role="img"
          aria-label="Before and after image comparison slider"
        >
          {/* ─── After image (bottom layer, always fully visible) ─────────────── */}
          <div className="absolute inset-0" aria-hidden="true">
            {afterContent ?? (
              <img
                src={afterImg}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
                draggable={false}
              />
            )}
            <div className="absolute bottom-6 right-6 px-4 py-2 glass rounded-lg z-10">
              <span className="text-accent font-bold text-sm tracking-widest uppercase">
                After
              </span>
            </div>
          </div>

          {/* ─── Before image (top layer, clipped by slider position) ─────────── */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
            aria-label={beforeAlt}
          >
            {beforeContent ?? (
              <img
                src={beforeImg}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
                draggable={false}
              />
            )}
            <div className="absolute bottom-6 left-6 px-4 py-2 glass rounded-lg z-10">
              <span className="text-gray-300 font-bold text-sm tracking-widest uppercase">
                Before
              </span>
            </div>
          </div>

          {/* ─── Divider line ─────────────────────────────────────────────────── */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gold-500 z-20"
            style={{
              left: `${sliderPos}%`,
              transform: 'translateX(-50%)',
              boxShadow: '0 0 15px rgba(201,166,107,0.6)',
            }}
            aria-hidden="true"
          >
            {/* ─── Drag handle ───────────────────────────────────────────────── */}
            <button
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-10 h-10 rounded-full
                bg-obsidian-900
                border-2 border-gold-500
                flex items-center justify-center
                cursor-ew-resize
                text-gold-400
                hover:scale-110
                transition-transform duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900
                ${!isDragging && !prefersReduced ? 'comb-pulse' : ''}
              `}
              onPointerDown={handlePointerDown}
              role="slider"
              aria-valuenow={Math.round(sliderPos)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Drag left or right to compare before and after images"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <ClipperIcon />
            </button>
          </div>
        </div>

        {/* ─── Caption ──────────────────────────────────────────────────────── */}
        <motion.p
          className="mt-8 text-center text-gray-300 text-sm max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {isSample
            ? 'Sample preview — real client transformations coming soon.'
            : 'Slide to see the True Stylez difference.'}
        </motion.p>
      </div>
    </section>
  )
}

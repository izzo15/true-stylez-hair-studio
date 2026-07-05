'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface PolaroidProps {
  name: string
  role: string
  years: string
  quote?: string
  /** Real photo slot — set this once real photography is available (see docs/PHOTO_SLOTS.md) */
  photoUrl?: string
  /** id applied to the section heading, so a wrapping <section> can aria-labelledby it */
  headingId?: string
}

export function LivingPolaroid({ name, role, years, quote, photoUrl, headingId }: PolaroidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -8
      const rotateY = ((x - centerX) / centerX) * 8
      gsap.to(ref.current, {
        rotateX,
        rotateY,
        transformPerspective: 900,
        duration: 0.3,
        ease: 'power2.out',
      })
    },
    [prefersReduced]
  )

  const handleLeave = useCallback(() => {
    if (prefersReduced || !ref.current) return
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [prefersReduced])

  useEffect(() => {
    if (prefersReduced || !ref.current) return
    gsap.fromTo(
      ref.current,
      { rotateX: 12, rotateY: -8, opacity: 0 },
      {
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.6)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [prefersReduced])

  return (
    <section className="relative py-24 md:py-40 bg-primary-900 overflow-hidden" aria-labelledby={headingId}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(217,70,0,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-6">
        <div className="text-center mb-14">
          <h2 id={headingId} className="text-4xl md:text-6xl font-bold font-heading mb-4">
            Meet <span className="text-accent">Jonathan</span>
          </h2>
          <p className="text-gray-400 text-lg">
            The hands behind the chair.
          </p>
        </div>

        <div className="flex justify-center">
          <div
            ref={ref}
            className="relative w-full max-w-sm"
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ perspective: 900 }}
          >
            <div className="relative bg-white/95 rounded-lg p-4 pb-16 shadow-2xl">
              <div className="relative aspect-square rounded overflow-hidden bg-gradient-to-br from-obsidian-800 via-obsidian-700 to-clove-800 flex items-center justify-center">
                {photoUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${photoUrl})` }}
                    role="img"
                    aria-label={`${name}, ${role}`}
                  />
                ) : (
                  <span
                    className="font-display font-bold text-gold-400/90 select-none"
                    style={{ fontSize: 'clamp(4rem, 18vw, 7rem)' }}
                    aria-hidden="true"
                  >
                    J
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-2 bg-primary-800/20 blur-sm rounded-full" />

              <div className="pt-6 text-center text-primary-900">
                <h3 className="text-2xl font-bold font-heading">{name}</h3>
                <p className="text-accent font-semibold text-sm tracking-wide mt-1">
                  {role}
                </p>
                <p className="text-gray-500 text-xs mt-1">{years} in the chair</p>
                {quote && (
                  <p className="mt-4 italic text-gray-600 text-sm leading-relaxed">
                    "{quote}"
                  </p>
                )}
              </div>

              <div className="absolute top-3 right-3 barber-pole w-1.5 h-10 rounded-full opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function BarberProfile({ headingId }: { headingId?: string }) {
  return (
    <LivingPolaroid
      name="Jonathan"
      role="Master Barber"
      years="10"
      quote="A good fade tells a story before you even say hello."
      headingId={headingId}
    />
  )
}

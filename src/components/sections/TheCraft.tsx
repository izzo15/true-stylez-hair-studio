'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type CraftVariant = 'fades' | 'ritual' | 'beard'

interface CraftItem {
  id: number
  variant: CraftVariant
  title: string
  description: string
  /** Real photo slot — set this once real photography is available (see docs/PHOTO_SLOTS.md) */
  image?: string
  imageAlt?: string
}

const CRAFT_ITEMS: CraftItem[] = [
  {
    id: 1,
    variant: 'fades',
    title: 'Precision Fades',
    description: 'Every line drawn with intention. Jonathan treats each fade like canvas work — clean gradients, zero harsh edges.',
  },
  {
    id: 2,
    variant: 'ritual',
    title: 'The Ritual',
    description: 'Hot towels, straight-razor edges, and the kind of quiet focus that turns a haircut into an experience.',
  },
  {
    id: 3,
    variant: 'beard',
    title: 'Beard Architecture',
    description: 'Shape, texture, and line. Jonathan sculpts facial hair with the same care he puts into every head fade.',
  },
]

const CRAFT_GRADIENTS: Record<CraftVariant, string> = {
  fades : 'from-clove-800 via-clove-700 to-obsidian-800',
  ritual: 'from-gold-800 via-gold-700 to-obsidian-800',
  beard : 'from-obsidian-700 via-clove-800 to-obsidian-900',
}

/** Simple line-art icon matching each craft item's theme */
function CraftIcon({ variant }: { variant: CraftVariant }) {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 text-white/85" fill="none" aria-hidden="true">
      {variant === 'fades' && (
        <>
          {/* Clippers */}
          <rect x="30" y="55" width="16" height="24" rx="3" stroke="currentColor" strokeWidth="3" />
          <rect x="46" y="55" width="16" height="24" rx="3" stroke="currentColor" strokeWidth="3" />
          <path d="M38 55V38a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v17" stroke="currentColor" strokeWidth="3" />
          <path d="M54 55V38a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v17" stroke="currentColor" strokeWidth="3" />
          <path d="M35 30h30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {variant === 'ritual' && (
        <>
          {/* Steam over folded towel */}
          <path d="M32 40q4-8 0-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M50 40q4-8 0-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M68 40q4-8 0-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <rect x="24" y="46" width="52" height="30" rx="4" stroke="currentColor" strokeWidth="3" />
          <path d="M24 58h52" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        </>
      )}
      {variant === 'beard' && (
        <>
          {/* Razor + comb */}
          <path d="M28 30l40 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 30l8 8-32 32-8-8z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M30 62h28M30 68h28M30 74h28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        </>
      )}
    </svg>
  )
}

export function TheCraft() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    imageRefs.current.forEach((img, i) => {
      if (!img) return
      gsap.fromTo(
        img,
        { y: i % 2 === 0 ? -60 : 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1.2,
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    textRefs.current.forEach((text, i) => {
      if (!text) return
      gsap.fromTo(
        text,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.15 * i,
        }
      )
    })
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900 via-primary-800/50 to-primary-900" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold font-heading mb-4">
            The <span className="text-accent">Craft</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            A lifetime of cuts, one chair at a time.
          </p>
        </div>

        <div className="space-y-32 md:space-y-48">
          {CRAFT_ITEMS.map((item, i) => (
            <div
              key={item.id}
              className={`flex flex-col ${
                i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              } items-center gap-8 md:gap-16`}
            >
              <div
                ref={(el) => { imageRefs.current[i] = el }}
                className="relative w-full md:w-3/5 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
              >
                {item.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                    role="img"
                    aria-label={item.imageAlt ?? item.title}
                  />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${CRAFT_GRADIENTS[item.variant]}`}>
                    <CraftIcon variant={item.variant} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                    0{item.id}
                  </span>
                </div>
              </div>

              <div
                ref={(el) => { textRefs.current[i] = el }}
                className={`w-full md:w-2/5 space-y-4 ${
                  i % 2 === 1 ? 'md:text-right' : 'md:text-left'
                }`}
              >
                <h3 className="text-3xl md:text-4xl font-bold font-heading">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface CraftItem {
  id: number
  image: string
  alt: string
  title: string
  description: string
}

const CRAFT_ITEMS: CraftItem[] = [
  {
    id: 1,
    image: '/textures/barber-bg.jpg',
    alt: 'Jonathan cutting hair',
    title: 'Precision Fades',
    description: 'Every line drawn with intention. Jonathan treats each fade like canvas work — clean gradients, zero harsh edges.',
  },
  {
    id: 2,
    image: '/textures/barber-bg.jpg',
    alt: 'Hot towel treatment',
    title: 'The Ritual',
    description: 'Hot towels, straight-razor edges, and the kind of quiet focus that turns a haircut into an experience.',
  },
  {
    id: 3,
    image: '/textures/barber-bg.jpg',
    alt: 'Beard trimming',
    title: 'Beard Architecture',
    description: 'Shape, texture, and line. Jonathan sculpts facial hair with the same care he puts into every head fade.',
  },
]

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
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
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

'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ClipperReveal({ onRevealComplete }: { onRevealComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const bladeRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) {
      onRevealComplete()
      return
    }

    const tl = gsap.timeline({
      onComplete: onRevealComplete
    })

    tl.to(bladeRef.current, {
      x: '-100%',
      duration: 1.5,
      ease: 'power2.inOut',
      modifiers: {
        x: (x) => {
          const wiggle = Math.sin(Date.now() * 0.01) * 5
          return `calc(${x} + ${wiggle}px)`
        }
      }
    })
    .to(overlayRef.current, {
      width: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 0)
  }, [prefersReduced, onRevealComplete])

  if (prefersReduced) return null

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-primary-900 flex items-center justify-center overflow-hidden"
    >
      <div 
        ref={bladeRef}
        className="absolute top-0 right-0 w-1.5 h-full bg-accent shadow-[0_0_30px_theme(colors.accent)]"
        style={{ transform: 'translateX(0)' }}
      />
      <div 
        className="absolute top-0 right-0 w-[3px] h-full bg-accent/40 blur-[4px] pointer-events-none"
        style={{ transform: 'translateX(0)' }}
        aria-hidden="true"
      />
      <div 
        className="absolute top-8 right-8 w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_theme(colors.accent),0_0_24px_theme(colors.accent)] pointer-events-none opacity-80 animate-pulse"
        aria-hidden="true"
      />
      <div className="text-4xl font-bold opacity-30">
        True Stylez
      </div>
    </div>
  )
}
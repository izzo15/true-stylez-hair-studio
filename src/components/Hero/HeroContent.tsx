'use client'

import { useState } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ClipperReveal } from './ClipperReveal'
import { HairParticles } from './HairParticles'

export function HeroContent() {
  const prefersReduced = useReducedMotion()
  const [showContent, setShowContent] = useState(false)

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <ClipperReveal onRevealComplete={() => setShowContent(true)} />
      
      {showContent && <HairParticles />}

      <div className="absolute inset-0 bg-[url('/textures/barber-bg.jpg')] bg-cover bg-center opacity-30" />
      
      <div className="barber-pole absolute top-4 right-4 w-8 h-32 rounded opacity-50" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="hero-logo">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gold-400">
            True Stylez
            <span className="block text-accent text-2xl md:text-3xl font-medium mt-2">
              feat. J The Barber
            </span>
          </h1>
        </div>
        
        <p className="hero-headline text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
          Fresh Fades. True Style.
        </p>

        <button 
          className="hero-cta px-8 py-4 bg-accent text-white font-bold rounded-full hover:scale-105 transition-transform animate-pulse-gold"
          onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Book Your Cut
        </button>
      </div>
    </div>
  )
}
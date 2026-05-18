'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { KonamiCode } from '@/components/KonamiCode'
import { GestureNav } from '@/components/GestureNav'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isBirthday, setIsBirthday] = useState(false)
  const clickRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const now = new Date()
    setIsBirthday(now.getMonth() === 4 && now.getDate() === 22)
  }, [])

  const fireConfetti = async () => {
    try {
      // @ts-ignore - canvas-confetti has no bundled types
      const confettiModule = await import('canvas-confetti')
      const confetti = confettiModule.default ?? confettiModule
      await confetti({ particleCount: 100, spread: 70, origin: { y: 0.3 } })
    } catch {
      // Fallback to existing particle animation
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  const handleClick = () => {
    clickRef.current += 1
    if (clickRef.current >= 5) {
      clickRef.current = 0
      fireConfetti()
    }
  }

  return (
    <>
      <KonamiCode />
      <GestureNav />

      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass py-3' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
       <Link href="/" className="text-2xl font-bold logo-trigger logo-vibrate" onClick={handleClick}>
         <motion.div
           animate={{ opacity: scrolled ? 1 : 0.7 }}
           transition={{ duration: 0.3 }}
         >
           {/* Morphing logo animation */}
           <motion.span
             initial={{ 
               opacity: scrolled ? 0 : 1,
               scale: scrolled ? 0.9 : 1,
               y: scrolled ? 10 : 0
             }}
             animate={{ 
               opacity: scrolled ? 0 : 1,
               scale: scrolled ? 0.9 : 1,
               y: scrolled ? 10 : 0
             }}
             transition={{ 
               opacity: { duration: 0.3 },
               scale: { duration: 0.3 },
               y: { duration: 0.3 }
             }}
           >
             True Stylez
           </motion.span>
           <motion.span
             initial={{ 
               opacity: scrolled ? 1 : 0,
               scale: scrolled ? 1.1 : 0.9,
               y: scrolled ? -10 : 0
             }}
             animate={{ 
               opacity: scrolled ? 1 : 0,
               scale: scrolled ? 1.1 : 0.9,
               y: scrolled ? -10 : 0
             }}
             transition={{ 
               opacity: { duration: 0.3 },
               scale: { duration: 0.3 },
               y: { duration: 0.3 }
             }}
             className="text-accent"
           >
               J The Barber{isBirthday && (
                 <span role="img" aria-label="birthday" className="ml-1 inline-block" title="Jonathan's birthday">
                   🎩
                 </span>
               )}
           </motion.span>
         </motion.div>
       </Link>

          <div className="hidden md:flex items-center space-x-8">
            {['About', 'Services', 'Barbers', 'Reviews'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <button 
            className="px-6 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors logo-vibrate"
            onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Now
          </button>
        </div>
      </motion.nav>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 text-accent"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400
              }}
              transition={{ delay: i * 0.02, duration: 1 }}
            >
              ✂️
            </motion.div>
          ))}
        </div>
      )}
    </>
  )
}

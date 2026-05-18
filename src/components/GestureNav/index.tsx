'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function GestureNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [longPressActive, setLongPressActive] = useState(false)
  const pressTimer = useRef<NodeJS.Timeout>()
  const swipeStart = useRef<{ x: number; y: number }>()

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.logo-trigger')) {
        pressTimer.current = setTimeout(() => {
          setLongPressActive(true)
          setIsVisible(true)
        }, 600)
      }
      
      if (e.touches.length === 2) {
        swipeStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
      }
    }

    const handleTouchEnd = () => {
      if (pressTimer.current) clearTimeout(pressTimer.current)
      setLongPressActive(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (swipeStart.current && e.touches.length === 2) {
        const deltaX = e.touches[0].clientX - swipeStart.current.x
        const deltaY = Math.abs(e.touches[0].clientY - swipeStart.current.y)
        
        if (deltaX > 100 && deltaY < 50) {
          setIsVisible(true)
          swipeStart.current = undefined
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="fixed top-0 left-0 h-full w-64 glass z-50 p-6"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
          
          <div className="mt-12 space-y-6">
            {['About', 'Services', 'Barbers', 'Reviews', 'Book'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-2xl font-bold hover:text-accent transition-colors"
                onClick={() => setIsVisible(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
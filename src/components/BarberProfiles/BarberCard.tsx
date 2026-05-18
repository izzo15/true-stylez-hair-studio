'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const SPECIALTY_ICONS: Record<string, string> = {
  'Skin Fades': '✂️',
  'Beard Sculpting': '💈',
  'Hot Towel Shaves': '🧖',
  'Haircut': '✂️',
  'Line Up': '📐',
}

interface BarberCardProps {
  barber: {
    id: string
    name: string
    bio: string | null
    photoUrl: string | null
    specialties: string[]
  }
  single?: boolean
}

export function BarberCard({ barber, single = false }: BarberCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      className={`relative ${single ? 'w-80 h-96' : 'w-64 h-80'} rounded-2xl overflow-hidden glass transition-all duration-300`}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 256 320"
      >
        <path
          d="M50 80 Q50 50 80 50 L176 50 Q206 50 206 80 L206 200 Q206 230 176 230 L80 230 Q50 230 50 200 Z"
          fill="none"
          stroke="rgba(217, 70, 0, 0.5)"
          strokeWidth="2"
          strokeDasharray="1000"
          strokeDashoffset={isInView ? '0' : '1000'}
          style={{ transition: 'stroke-dashoffset 1.5s ease' }}
        />
      </svg>

      <div className="absolute inset-4 rounded-xl overflow-hidden">
        {barber.photoUrl ? (
          <img
            src={barber.photoUrl}
            alt={barber.name}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isInView ? 'grayscale-0' : 'grayscale'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-primary-800 flex items-center justify-center">
            <span className="text-6xl opacity-20">✂️</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-xl font-bold">{barber.name}</h3>
        <div className="flex gap-1 mt-1 flex-wrap">
          {barber.specialties.map((spec) => (
            <span key={spec} className="text-xs bg-accent/20 px-2 py-0.5 rounded">
              {SPECIALTY_ICONS[spec] || '✂️'} {spec}
            </span>
          ))}
        </div>
        {barber.bio && (
          <p className={`text-xs text-gray-400 mt-1 ${single ? '' : 'line-clamp-2'}`}>{barber.bio}</p>
        )}
      </div>

      <button
        className="absolute top-4 right-4 px-3 py-1 bg-accent text-white rounded-full text-sm"
        onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Book
      </button>
    </motion.div>
  )
}

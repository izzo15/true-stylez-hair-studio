'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const REVIEWS = [
  {
    id: 1,
    name: 'Mike S.',
    rating: 5,
    text: 'Best fade in the Capital District. Jonathan is a true artist with the clippers.'
  },
  {
    id: 2,
    name: 'Chris R.',
    rating: 5,
    text: 'Been coming here for 3 years. Consistent quality every time. Worth every penny.'
  },
  {
    id: 3,
    name: 'Dan K.',
    rating: 5,
    text: 'The hot towel shave is next level. Like a spa day for your face.'
  },
]

export function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-center items-center gap-4 mb-12">
        <div className="text-center">
          <div className="text-5xl font-bold text-accent">5.0</div>
          <div className="flex justify-center text-yellow-400 mb-1">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                ★
              </motion.span>
            ))}
          </div>
          <div className="text-gray-400">69 Google Reviews</div>
        </div>
      </div>

      <div className="relative h-64 perspective-1000">
        <div className="barber-pole absolute inset-0 opacity-10" />
        
        {REVIEWS.map((review, index) => {
          const offset = (index - currentIndex + REVIEWS.length) % REVIEWS.length
          
          return (
            <motion.div
              key={review.id}
              className="absolute inset-0 glass rounded-xl p-8"
              initial={{ rotateY: 90, opacity: 0, zIndex: 0 }}
              animate={{ 
                rotateY: offset === 0 ? 0 : offset === 1 ? -60 : 60,
                opacity: offset === 0 ? 1 : 0.3,
                zIndex: offset === 0 ? 10 : 0,
                x: offset === 0 ? 0 : offset === 1 ? '-30%' : '30%'
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex text-yellow-400 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{review.text}"</p>
              <div className="text-accent font-medium">- {review.name}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? 'bg-accent w-6' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
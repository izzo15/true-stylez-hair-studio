'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Review {
  id: string
  author_name: string
  rating: number
  text: string
  relative_time_description: string
}

/** Renders a single Unicode star, filled if active */
function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-yellow-400 text-sm" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} aria-hidden="true" className={i < rating ? '' : 'opacity-30'}>
          ★
        </span>
      ))}
    </span>
  )
}

/** Single review card — glass-morphism theme */
function ReviewCard({ review }: { review: Review }) {
  return (
    <article
      className="glass rounded-xl p-6 flex-shrink-0 w-full max-w-sm"
      aria-label={`Review by ${review.author_name}`}
    >
      <ReviewStars rating={review.rating} />
      <blockquote className="mt-3 text-gray-300 text-sm leading-relaxed line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-accent font-semibold text-sm">{review.author_name}</span>
        <time className="text-xs text-mist" dateTime="">
          {review.relative_time_description}
        </time>
      </div>
    </article>
  )
}

/**
 * LiveReviews
 *
 * Fetches reviews from /api/reviews and renders them as a horizontally
 * scrollable carousel. Refreshes every 10 minutes in the background.
 */
export function LiveReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isFallback, setIsFallback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const prefersReduced = useReducedMotion()

  // Fetch reviews on mount
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/reviews', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: { reviews: Review[]; isFallback: boolean } = await res.json()
        if (!cancelled) {
          setReviews(data.reviews)
          setIsFallback(data.isFallback)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    // Auto-refresh every 10 minutes
    const interval = setInterval(load, 10 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Skeleton while loading
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center gap-4 mb-12">
          <div className="text-center">
            <div className="text-5xl font-bold text-accent animate-pulse">5.0</div>
            <div className="w-32 h-4 bg-smoke rounded mt-2 mx-auto" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 w-full max-w-sm flex-shrink-0 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-smoke-light rounded" />
                <div className="h-3 w-full bg-smoke-light rounded" />
                <div className="h-3 w-3/4 bg-smoke-light rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Hard fallback (should never render if API is working)
  if (error || reviews.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto">
      {/* ─── Section heading ─────────────────────────────────────────── */}
      <div className="flex justify-center items-center gap-4 mb-12">
        {isFallback ? (
          <div className="text-center">
            <div className="flex justify-center">
              <ReviewStars rating={5} />
            </div>
            <div className="text-mist text-sm mt-2">What Clients Say</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl font-bold text-accent">5.0</div>
            <div className="flex justify-center mt-1">
              <ReviewStars rating={5} />
            </div>
            <div className="text-mist text-sm mt-1">69+ Google Reviews</div>
          </div>
        )}
      </div>

      {/* ─── Horizontal scrollable carousel ──────────────────────────── */}
      <div
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar snap-x snap-mandatory"
        role="region"
        aria-label="Client reviews carousel"
        aria-roledescription="carousel"
      >
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="snap-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
          >
            <ReviewCard review={review} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

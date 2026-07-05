/**
 * GET /api/reviews
 *
 * Fetches the 5 most-recent 5-star reviews from Google Places API for
 * True Stylez Hair Studio.
 *
 * Results are cached in-memory for 1 hour to avoid rate-limit exhaustion.
 * If the Google API key is missing or the request fails, the route falls
 * back to the existing hardcoded review array so the frontend never breaks.
 */

import { NextRequest, NextResponse } from 'next/server'

// ── In-memory cache ──────────────────────────────────────────────────────────
let _cache: { data: unknown; expires: number } | null = null
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// ── Fallback (current hardcoded reviews) ─────────────────────────────────────
const FALLBACK_REVIEWS: Review[] = [
  {
    id: 'fb-1',
    author_name: 'Mike S.',
    rating: 5,
    text: 'Best fade in the Capital District. Jonathan is a true artist with the clippers.',
    relative_time_description: 'recently',
  },
  {
    id: 'fb-2',
    author_name: 'Chris R.',
    rating: 5,
    text: 'Been coming here for 3 years. Consistent quality every time. Worth every penny.',
    relative_time_description: 'recently',
  },
  {
    id: 'fb-3',
    author_name: 'Dan K.',
    rating: 5,
    text: 'The hot towel shave is next level. Like a spa day for your face.',
    relative_time_description: 'recently',
  },
  {
    id: 'fb-4',
    author_name: 'James M.',
    rating: 5,
    text: 'Jonathan hooked me up with the cleanest skin fade I have ever had. Highly recommend.',
    relative_time_description: 'recently',
  },
  {
    id: 'fb-5',
    author_name: 'Tyler W.',
    rating: 5,
    text: 'True Stylez is the only spot I trust with my hair. Professional, clean, and sharp every cut.',
    relative_time_description: 'recently',
  },
]

interface Review {
  id: string
  author_name: string
  rating: number
  text: string
  relative_time_description: string
}

interface GooglePlaceDetailsResponse {
  result?: {
    reviews?: Array<{
      author_name: string
      rating: number
      text: string
      time: number
      profile_photo_url?: string
    }>
  }
  status: string
  error_message?: string
}

function toRelativeTime(unixTs: number): string {
  const seconds = Math.floor(Date.now() / 1000 - unixTs)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

/** Convert one raw Google review record into our Review shape */
function toReview(r: {[key: string]: unknown}): Review {
  return {
    id: `gr-${(r.time as number || Math.random().toString(36).slice(2))}`,
    author_name: r.author_name as string,
    rating:     r.rating as number,
    text:       r.text as string,
    relative_time_description: toRelativeTime(r.time as number),
  }
}

async function fetchGoogleReviews(apiKey: string, placeId: string): Promise<Review[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'reviews')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Google Places HTTP ${res.status}`)

  const body: GooglePlaceDetailsResponse = await res.json()
  if (body.status !== 'OK' || !body.result?.reviews) {
    throw new Error(body.error_message || `Google Places status: ${body.status}`)
  }

  // Filter 5-star reviews, sort newest first, take top 5
  const fiveStar = body.result.reviews
    .filter((r) => r.rating === 5)
    .sort((a, b) => (b.time || 0) - (a.time || 0))
    .slice(0, 5)

  return fiveStar.map((r): Review => ({
    id: `gr-${r.time || Math.random().toString(36).slice(2)}`,
    author_name: r.author_name,
    rating: r.rating,
    text: r.text,
    relative_time_description: toRelativeTime(r.time),
  }))
}

export async function GET(request: NextRequest) {
  // ── Serve from cache if still fresh ──────────────────────────────────────
  if (_cache && Date.now() < _cache.expires) {
    return NextResponse.json(_cache.data)
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID // opaque place-ID string

  if (!apiKey || !placeId) {
    console.warn('[api/reviews] Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID — serving fallback')
    const data = { reviews: FALLBACK_REVIEWS, isFallback: true }
    _cache = { data, expires: Date.now() + CACHE_TTL_MS }
    return NextResponse.json(data)
  }

  try {
    const reviews = await fetchGoogleReviews(apiKey, placeId)
    const data = { reviews, isFallback: false }
    _cache = { data, expires: Date.now() + CACHE_TTL_MS }
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/reviews] fetch failed:', err)
    const data = { reviews: FALLBACK_REVIEWS, isFallback: true }
    _cache = { data, expires: Date.now() + CACHE_TTL_MS }
    return NextResponse.json(data)
  }
}

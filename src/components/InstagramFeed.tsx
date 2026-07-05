'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Post = {
  id: string
  media_url: string
  permalink: string
  caption: string
}

/**
 * InstagramFeed
 *
 * Renders a 2×3 lazy-loaded grid (`aspect-square`) of the latest 6
 * Instagram posts from @j_thebarberny.
 *
 * Each tile opens the Instagram post in a new tab on click.
 * The whole section hides itself if the API request fails / returns empty data
 * (fallback: none — keep the UI clean).
 */
export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [userErr, setUserErr] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/instagram', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Post[] = await res.json()
        if (!cancelled) setPosts(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setUserErr(true)
      }
    }

    load()

    // Refresh every 10 minutes
    const interval = setInterval(load, 10 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [isMounted])

  // ── Nothing to render yet (pre-mount) ─────────────────────────────────────
  if (!isMounted) return null

  // ── Compact on-brand fallback when the feed has no token / fails to load ──
  if (userErr || posts.length === 0) {
    return (
      <section className="py-16 px-4" aria-labelledby="instagram-fallback-heading">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            From Instagram
          </p>
          <h2 id="instagram-fallback-heading" className="text-2xl md:text-3xl font-bold font-heading">
            Follow the Chair
          </h2>
          <a
            href="https://instagram.com/j_thebarberny"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 bg-clove/10 border border-clove/40 text-clove-light font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-clove/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clove"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @j_thebarberny
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 md:py-32 px-4" aria-labelledby="instagram-heading">
      <div className="max-w-6xl mx-auto">
        {/* ─── Section heading ─────────────────────────────────────────── */}
        <div className="mb-12 text-left">
          <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            From Instagram
          </p>
          <h2
            id="instagram-heading"
            className="text-4xl md:text-5xl font-bold font-heading"
          >
            Fresh Cuts from the Chair
          </h2>
          <a
            href="https://instagram.com/j_thebarberny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 text-sm font-semibold mt-2 inline-block hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
          >
            @j_thebarberny &rarr;
          </a>
        </div>

        {/* ─── 2-column mobile / 3-column desktop grid ─────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-clove/30 hover:border-clove transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-clove"
              initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              aria-label={`Instagram post by j_thebarberny${post.caption ? `: ${post.caption.slice(0, 50)}` : ''}`}
            >
              <img
                src={post.media_url}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* ─── Scan overlay on hover ───────────────────────────────── */}
              <div className="scan-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

              {/* ─── Instagram icon badge (always visible) ─────────────── */}
              <div
                className="
                  absolute top-2 right-2
                  bg-black/60 backdrop-blur-sm
                  rounded-full p-1.5
                  text-white
                "
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

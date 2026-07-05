'use client'

import { useState } from 'react'
import { shopClips } from '@/data/videos'

/**
 * ShopCam
 * A 3×3 grid of "clip slots". Any slot with a matching entry in
 * src/data/videos.ts plays that real self-hosted clip on click; any slot
 * without one falls back to the original placeholder scanning animation.
 */

const TOTAL_SLOTS = 9

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-obsidian-900 translate-x-0.5" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default function ShopCam() {
  const [playingId, setPlayingId] = useState<number | null>(null)

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <div className="relative glass rounded-2xl p-4 shadow-glass">
        {/* Scanning bar decoration */}
        <div className="absolute top-2 right-4 flex items-center gap-2 z-10" aria-hidden="true">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clove opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-clove" />
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-clove/80 uppercase">
            Live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => i + 1).map((n) => {
            const clip = shopClips.find((c) => c.id === n)
            const isPlaying = playingId === n

            return (
              <div
                key={n}
                className="aspect-video rounded-lg overflow-hidden bg-obsidian-800 relative border border-white/[0.04]"
              >
                {!clip && (
                  <>
                    {/* Placeholder gradient background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 60%)',
                      }}
                      aria-hidden="true"
                    />
                    {/* Scanning circle */}
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                      <div
                        className="w-[260%] h-[260%] rounded-full
                                   border border-clove/20
                                   animate-[spin_4s_linear_infinite]"
                        style={{
                          borderTopColor    : 'transparent',
                          borderRightColor  : 'transparent',
                          animationDirection: n % 2 === 0 ? 'normal' : 'reverse',
                        }}
                      />
                    </div>
                    <div className="absolute bottom-1 left-1.5">
                      <span className="text-[9px] tracking-widest text-white/25 font-heading font-bold uppercase">
                        Clip #{n}
                      </span>
                    </div>
                  </>
                )}

                {clip && !isPlaying && (
                  <button
                    type="button"
                    onClick={() => setPlayingId(n)}
                    className="group w-full h-full relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-clove"
                    aria-label={clip.caption ? `Play video: ${clip.caption}` : `Play clip ${n}`}
                  >
                    {clip.poster ? (
                      <img src={clip.poster} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-obsidian-700 to-clove-900" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <PlayIcon />
                      </div>
                    </div>
                    {clip.caption && (
                      <div className="absolute bottom-1 left-1.5 right-1.5">
                        <span className="text-[9px] tracking-wide text-white/80 font-heading font-semibold line-clamp-1">
                          {clip.caption}
                        </span>
                      </div>
                    )}
                  </button>
                )}

                {clip && isPlaying && (
                  <video
                    className="w-full h-full object-cover"
                    src={clip.src}
                    poster={clip.poster}
                    controls
                    autoPlay
                    playsInline
                    aria-label={clip.caption ?? `Clip ${n}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

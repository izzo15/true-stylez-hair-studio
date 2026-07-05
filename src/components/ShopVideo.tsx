'use client'

import { useState } from 'react'

/**
 * ShopVideo
 * Autoplaying, muted, looping background video for the About section.
 * Included on first render.
 */

export default function ShopVideo() {
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-10 rounded-2xl overflow-hidden shadow-glass-lg">
      {/* Decorative top edge */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-clove to-transparent z-10" />

      {/* Gradient vignette overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, transparent 60%, rgba(15,15,17,0.7) 100%)',
        }}
      />

      {videoFailed ? (
        <div
          className="w-full h-[320px] md:h-[480px] bg-gradient-to-br from-obsidian-700 to-obsidian-900"
          style={{ backgroundImage: "url('/textures/barber-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden="true"
        />
      ) : (
        <video
          className="w-full max-h-[480px] object-cover block"
          autoPlay
          muted          // Required for autoplay in all browsers
          loop
          playsInline    // Required on iOS to prevent full-screen takeover
          preload="metadata"
          aria-hidden="true"
          poster="/textures/barber-bg.jpg"
          onError={() => setVideoFailed(true)}
        >
          <source
            src="https://videos.pexels.com/video-files/3754986/3754986-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}

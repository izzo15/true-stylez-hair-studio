'use client'

/**
 * Sample "before"/"after" panels used until real client transformation
 * photos are available. Distinct treatments per side so the slider's drag
 * interaction is honestly demonstrable rather than showing the same image
 * twice — see docs/PHOTO_SLOTS.md for where to drop in real photos.
 */
function HeadSilhouette({ variant }: { variant: 'before' | 'after' }) {
  return (
    <svg viewBox="0 0 200 200" className="w-28 h-28 md:w-36 md:h-36" fill="none" aria-hidden="true">
      {/* Shoulders */}
      <path d="M30 190 Q30 140 100 140 Q170 140 170 190" stroke="currentColor" strokeWidth="3" opacity="0.5" />
      {/* Head */}
      <circle cx="100" cy="95" r="45" stroke="currentColor" strokeWidth="3" opacity="0.7" />
      {variant === 'before' ? (
        <>
          {/* Shaggy, uneven hair */}
          <path d="M58 70 Q65 40 80 55 Q90 30 100 52 Q112 28 122 54 Q136 38 142 68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 80 Q70 68 78 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M122 78 Q130 68 140 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </>
      ) : (
        <>
          {/* Clean, tapered fade lines */}
          <path d="M58 66 Q100 44 142 66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M62 76 Q100 58 138 76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M66 86 Q100 72 134 86" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      )}
    </svg>
  )
}

export function BeforeAfterPlaceholderPanel({ variant }: { variant: 'before' | 'after' }) {
  const isAfter = variant === 'after'

  return (
    <div
      className={
        isAfter
          ? 'w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-clove-700 via-clove-600 to-gold-600 text-white'
          : 'w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-obsidian-700 to-obsidian-900 text-mist'
      }
    >
      <HeadSilhouette variant={variant} />
      <p className="text-xs tracking-[0.2em] uppercase font-semibold opacity-80">
        Sample preview
      </p>
    </div>
  )
}

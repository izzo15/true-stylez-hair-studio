'use client'

/**
 * ShopCam
 * A 3×3 grid of "clip slots" — each with a spinning scanning-circle indicator.
 * Purely decorative; conveys a live-feed feel for the shop interior.
 */

const CLIP_SLOTS = Array.from({ length: 9 }, (_, i) => i + 1)

export default function ShopCam() {
  return (
    <div className="mt-10 max-w-4xl mx-auto" aria-hidden="true">
      <div className="relative glass rounded-2xl p-4 shadow-glass">
        {/* Scanning bar decoration */}
        <div className="absolute top-2 right-4 flex items-center gap-2 z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clove opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-clove" />
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-clove/80 uppercase">
            Live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CLIP_SLOTS.map((n) => (
            <div
              key={n}
              className="aspect-video rounded-lg overflow-hidden
                         bg-obsidian-800 relative
                         border border-white/[0.04]"
            >
              {/* Placeholder gradient background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 60%)',
                }}
              />

              {/* Scanning circle */}
              <div className="absolute inset-0 flex items-center justify-center">
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

              {/* Clip label */}
              <div className="absolute bottom-1 left-1.5">
                <span className="text-[9px] tracking-widest text-white/25 font-heading font-bold uppercase">
                  Clip #{n}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

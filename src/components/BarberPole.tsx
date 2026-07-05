/**
 * BarberPole — a classic red/white/blue barbershop pole: metal cap top and
 * bottom, a spinning diagonal-striped cylinder body, and a glass highlight
 * down one edge for a bit of dimensionality. Purely CSS/SVG, no images.
 */
export function BarberPole({ className = 'w-8 h-32' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Top cap */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[130%] h-3 rounded-full bg-gradient-to-b from-gray-100 via-gray-400 to-gray-600 shadow-md z-10" />

      {/* Pole body */}
      <div className="absolute inset-0 rounded-full overflow-hidden shadow-lg">
        <div className="barber-pole absolute inset-0" />
        {/* Glass shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Bottom cap */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[130%] h-3 rounded-full bg-gradient-to-b from-gray-100 via-gray-400 to-gray-600 shadow-md z-10" />
    </div>
  )
}

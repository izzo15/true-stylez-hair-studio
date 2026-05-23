'use client'

/**
 * ServiceCard — rich card rendered inside a bot message.
 *
 * Shows service name, price, duration, category.
 * "Book This →" button fires the onBook callback, which in turn
 * closes the chat and pre-fills the booking widget via the URL-state/store.
 */

type Service = {
  id: string
  name: string
  price: number
  duration: number
  category: string
  description?: string
  stylingTips?: string[]
}

type ServiceCardProps = {
  service: Service
  onBook: () => void
}

const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const description =
    service.description ||
    `${service.name} — our expert barbers will leave you looking sharp.`

  return (
    <div className="relative group">
      {/* scan sweep overlay */}
      <div className="scan-overlay rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div
        className="
          relative rounded-xl p-4
          bg-obsidian-700/70 border border-neon-blue/20
          transition-all duration-200
          hover:border-neon-blue/40 hover:bg-obsidian-700/90
        "
      >
        {/* Header row */}
        <div className="mb-2">
          <h3 className="font-semibold text-white">{service.name}</h3>
          <p className="text-xs text-neon-blue/40 mt-0.5">{service.category}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-3">{description}</p>

        {/* Price / duration + CTA */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            <span className="font-semibold text-white">${service.price}</span>
            <span className="mx-1.5">·</span>
            {service.duration} min
          </span>
          <button
            type="button"
            onClick={onBook}
            className="
              btn-futuristic
              bg-neon-blue/20 text-white border border-neon-blue/30
              rounded-xl px-3 py-1.5
              hover:bg-neon-blue/30 hover:border-neon-blue/50
              text-sm font-medium transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/60
            "
          >
            Book This →
          </button>
        </div>

        {/* Styling tips (only for recommendations) */}
        {service.stylingTips && service.stylingTips.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neon-purple/15">
            <p className="text-xs text-neon-purple/50 uppercase tracking-wide mb-1">
              Styling Tips
            </p>
            <ul className="space-y-1">
              {service.stylingTips.map((tip, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.55em] before:w-1 before:h-1 before:rounded-full before:bg-neon-purple/50"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceCard

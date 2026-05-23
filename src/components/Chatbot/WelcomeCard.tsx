'use client'

/**
 * WelcomeCard — shown when the chat is empty.
 *
 * Displays a friendly greeting and 4 quick-action buttons.
 * Each button dispatches a `chatbot-quick-reply` custom event whose
 * `detail` string is handled by the parent Chatbot/index.tsx.
 */

const QUICK_REPLIES = [
  { action: 'services',  label: '✂️  Services & Pricing'  },
  { action: 'available', label: '📅  Check Availability'   },
  { action: 'style',     label: '💈  Style Advice'         },
  { action: 'hours',     label: '📍  Hours & Location'     },
] as const

const WelcomeCard = () => {
  const handleQuickReply = (action: string) => {
    window.dispatchEvent(
      new CustomEvent('chatbot-quick-reply', { detail: action }),
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-neon-blue/80 text-sm leading-relaxed">
        Yo! I'm <strong className="text-neon-blue">The Apprentice</strong>.
        Jonathan's busy making people look sharp, so I'm here to help.
        What can I do for you?
      </p>
      <div className="grid gap-3">
        {[
          [QUICK_REPLIES[0], QUICK_REPLIES[1]],
          [QUICK_REPLIES[2], QUICK_REPLIES[3]],
        ].map(([a, b], rowIdx) => (
          <div key={rowIdx} className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleQuickReply(a.action)}
              className="
                flex-1
                bg-obsidian-800 border border-neon-blue/30
                hover:bg-neon-blue/15 hover:border-neon-blue/50
                text-white rounded-xl px-4 py-2.5
                text-sm font-medium transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/60
              "
            >
              {a.label}
            </button>
            <button
              onClick={() => handleQuickReply(b.action)}
              className="
                flex-1
                bg-obsidian-800 border border-neon-blue/30
                hover:bg-neon-blue/15 hover:border-neon-blue/50
                text-white rounded-xl px-4 py-2.5
                text-sm font-medium transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue/60
              "
            >
              {b.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WelcomeCard

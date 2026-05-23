'use client'

/**
 * QuickReplyButtons — rendered inside a bot message to offer the user
 * one-tap options (e.g. available time slots or suggested next steps).
 *
 * Each button dispatches a `chatbot-quick-reply` custom event with the
 * button text as `event.detail`, which the parent Chatbot listens for.
 */

type QuickReplyButtonsProps = {
  replies: string[]
}

const QuickReplyButtons = ({ replies }: QuickReplyButtonsProps) => {
  const handleClick = (reply: string) => {
    window.dispatchEvent(
      new CustomEvent('chatbot-quick-reply', { detail: reply }),
    )
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Quick replies">
      {replies.map((reply, index) => (
        <button
          key={`${reply}-${index}`}
          type="button"
          onClick={() => handleClick(reply)}
          className="
            bg-obsidian-800 border border-neon-blue/30
            hover:bg-neon-blue/15 hover:border-neon-blue/50
            text-white rounded-xl px-3 py-1.5
            text-xs font-medium transition-all duration-150
            focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-blue/60
          "
        >
          {reply}
        </button>
      ))}
    </div>
  )
}

export default QuickReplyButtons

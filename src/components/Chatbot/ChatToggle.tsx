'use client'

import { motion } from 'framer-motion'

/**
 * ChatToggle — floating button in the bottom-right corner.
 *
 * Controlled component: receives `isOpen` and `onToggle` from the parent
 * (page.tsx) so the parent and the Chatbot panel stay in sync.
 * Shows an unread-badge counter when the chat is closed and there are
 * unread messages.
 */

type ChatToggleProps = {
  isOpen: boolean
  onToggle: () => void
  unreadCount: number
}

const ChatToggle = ({ isOpen, onToggle, unreadCount }: ChatToggleProps) => {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Close chat with The Apprentice' : 'Open chat with The Apprentice'}
      aria-expanded={isOpen}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="
        fixed right-4 bottom-24 md:right-6 md:bottom-6 z-50
        w-14 h-14 rounded-full
        bg-neon-blue/20 flex items-center justify-center
        border border-neon-blue/30 backdrop-blur-md
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-neon-blue
        focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-900
        chat-toggle-glow chat-glow
        transition-opacity
      "
    >
      {!isOpen && (
        /* ── comb silhouette icon ── */
        <motion.div
          key="comb"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 20 }}
          className="relative w-6 h-6"
        >
          <div className="absolute inset-0 rounded bg-neon-blue/40" />
          <div className="absolute inset-0 flex items-center justify-center gap-px">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-0.5 h-5 rounded bg-white" />
            ))}
          </div>
        </motion.div>
      )}

      {isOpen && (
        /* ── show "Close" (simplified X) symbol when panel is open ── */
        <motion.svg
          key="close-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
          className="text-neon-blue"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </motion.svg>
      )}
    </motion.button>
  )
}

export default ChatToggle

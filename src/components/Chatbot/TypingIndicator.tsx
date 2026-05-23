'use client'

/**
 * TypingIndicator — shown while waiting for the bot's streaming response.
 *
 * Replaces the three bouncing dots with a single comb icon that
 * glows and fades in a `comb-pulse` animation.
 */

import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 text-xs text-neon-blue/40 py-1"
      role="status"
      aria-label="Assistant is typing"
      aria-live="polite"
    >
      <motion.div
        className="comb-pulse flex items-center gap-0.5"
        aria-hidden="true"
      >
        {/* Comb silhouette */}
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 w-full h-full rounded bg-neon-blue/30" />
          <div className="absolute inset-0 flex items-center justify-center gap-px">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-0.5 h-4 rounded bg-neon-blue/60"
              />
            ))}
          </div>
        </div>
      </motion.div>
      <span className="text-neon-blue/30 tracking-wide text-[0.625rem] uppercase font-medium">
        Thinking
      </span>
    </motion.div>
  )
}

export default TypingIndicator

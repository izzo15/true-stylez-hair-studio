'use client'

/**
 * The Apprentice — Main Chat Panel
 *
 * ── Responsibilities
 *  1. Render the slide-in chat panel (Framer Motion)
 *  2. Stream SSE responses from /api/chatbot, parse <<VISUAL_DATA>> blocks
 *  3. Handle chatbot-quick-reply events from WelcomeCard & QuickReplyButtons
 *  4. Handle chatbot-close event (optionally with booking prefill payload)
 *  5. Collect style-advice answers (3-question flow → direct recommendStyle call)
 *  6. Manage unread count via Chat badge
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WelcomeCard from './WelcomeCard'
import MessageBubble from './MessageBubble'
import QuickReplyButtons from './QuickReplyButtons'
import TypingIndicator from './TypingIndicator'

/* ════════════════════════════════════════════════════════════════════════
   Types
════════════════════════════════════════════════════════════════════════ */

type VisualType =
  | 'serviceList'
  | 'serviceRecommendation'
  | 'availabilitySlots'
  | 'hours'
  | 'barbers'
  | null

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  visualType?: VisualType
  visualData?: unknown
}

/* ════════════════════════════════════════════════════════════════════════
   Style-advice state machine
   Collects three answers before calling /api/chatbot/recommend (inline)
════════════════════════════════════════════════════════════════════════ */

type AdvicePhase = 'idle' | 'face_shape' | 'maintenance' | 'vibe'

interface AdviceState {
  phase: AdvicePhase
  faceShape: string
  maintenance: string
  vibe: string
}

const blankAdvice: AdviceState = {
  phase: 'idle',
  faceShape: '',
  maintenance: '',
  vibe: '',
}

/* ════════════════════════════════════════════════════════════════════════
   Quick-reply → message mapping
════════════════════════════════════════════════════════════════════════ */

type QuickReplyAction =
  | 'services'
  | 'available'
  | 'style'
  | 'hours'

type GroupedQuickReply = {
  action: QuickReplyAction
  label: string
}

const WELCOME_QUICK_REPLIES: readonly GroupedQuickReply[] = [
  { action: 'services',  label: '✂️  Services & Pricing' },
  { action: 'available', label: '📅  Check Availability'  },
  { action: 'style',     label: '💈  Style Advice'         },
  { action: 'hours',     label: '📍  Hours & Location'     },
]

const ACTION_MESSAGES: Record<QuickReplyAction, string> = {
  services: "I'd like to see your services & prices",
  available: "What availability do you have coming up?",
  style: "I'd like some style advice / a recommendation",
  hours: "What are your opening hours and where are you located?",
}

/* ════════════════════════════════════════════════════════════════════════
   Component
════════════════════════════════════════════════════════════════════════ */

interface ChatbotProps {
  /** Controlled open / closed state (lifted to parent in page.tsx) */
  isOpen: boolean
  /** Called to open the panel (from ChatToggle) */
  onOpen: () => void
  /** Called to close the panel */
  onClose: () => void
  /** Current unread badge count (supplied by page.tsx based on events) */
  unreadCount: number
  /** Pass a booking prefill object from the page-level handler */
  bookingPrefill?: {
    serviceId?: string
    barberId?: string | null
    date?: string | null
    time?: string | null
  } | null
  /** Clears the active prefill once the booking widget has consumed it */
  onPrefillConsumed: () => void
}

export default function Chatbot({
  isOpen,
  onOpen,
  onClose,
  unreadCount,
  bookingPrefill,
  onPrefillConsumed,
}: ChatbotProps) {
  /* ── Conversation state ─────────────────────────────────────────── */
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  /* ── Visual data refs — updated alongside React state ───────────── */
  const visualTypeRef = useRef<VisualType>(null)
  const visualDataRef = useRef<unknown>(null)

  /* ── Scroll anchor ──────────────────────────────────────────────── */
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  /* ── Style-advice state machine ─────────────────────────────────── */
  const [advice, setAdvice] = useState<AdviceState>(blankAdvice)

  /* ── When prefill arrives, append a bot "noted!" message ─────────── */
  useEffect(() => {
    if (!bookingPrefill?.serviceId) return
    const serviceName = bookingPrefill.serviceId ? 'that service' : 'your selection'
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `Nice — I've noted your booking${bookingPrefill.date ? ` for ${bookingPrefill.date}` : ''}. Close this chat and the booking widget will open right where you left it.`,
      },
    ])
    onPrefillConsumed()
  }, [bookingPrefill, onPrefillConsumed])

  /* ════════════════════════════════════════════════════════════════════
     Scroll to bottom on new messages / visual data change
  ════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  /* ════════════════════════════════════════════════════════════════════
     Track messages for unread badge
     Emit 'chatbot-on-message' after each bot message so page.tsx can
     count unread messages while the panel is closed.
  ════════════════════════════════════════════════════════════════════ */
  const lastBotCountRef = useRef(0)

  useEffect(() => {
    const botCount = messages.filter((m) => m.role === 'assistant').length
    if (botCount > lastBotCountRef.current && !isOpen) {
      window.dispatchEvent(new CustomEvent('chatbot-on-message'))
    }
    lastBotCountRef.current = botCount
  }, [messages, isOpen])

  /* ════════════════════════════════════════════════════════════════════
     Close / open helpers used by ChatToggle
  ════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('chatbot-toggle', { detail: isOpen }))
  }, [isOpen])

  /* ════════════════════════════════════════════════════════════════════
     Display hard-coded quick-reply chips for the in-progress style flow
  ════════════════════════════════════════════════════════════════════ */
  const [adviceChips, setAdviceChips] = useState<string[]>([])

  useEffect(() => {
    switch (advice.phase) {
      case 'face_shape':
        setAdviceChips(['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond', "Not sure"])
        break
      case 'maintenance':
        setAdviceChips(['Low (wash & go)', 'Medium (some product)', 'High (daily styling)'])
        break
      case 'vibe':
        setAdviceChips(['Professional', 'Edgy', 'Classic', 'Trendy'])
        break
      default:
        setAdviceChips([])
    }
  }, [advice.phase])

  /* ════════════════════════════════════════════════════════════════════
     Visual data helpers
  ════════════════════════════════════════════════════════════════════ */

  function setVisuals(type: VisualType, data: unknown) {
    visualTypeRef.current = type
    visualDataRef.current = data
  }

  /* ════════════════════════════════════════════════════════════════════
     Parse <<VISUAL_DATA>> blocks from accumulated streamed text
  ════════════════════════════════════════════════════════════════════ */
  function extractVisualData(text: string): {
    clean: string
    type: VisualType
    data: unknown
  } {
    const regex = /<<VISUAL_DATA>>\s*([\s\S]*?)\s*<<END_VISUAL_DATA>>/
    const match = text.match(regex)
    if (!match) return { clean: text, type: null, data: null }

    try {
      const parsed = JSON.parse(match[1])
      if (parsed?.type && parsed.data !== undefined) {
        return {
          clean: text.replace(match[0], '').trim(),
          type: parsed.type as VisualType,
          data: parsed.data,
        }
      }
    } catch {
      // malformed JSON — ignore
    }
    return { clean: text, type: null, data: null }
  }

  /* ════════════════════════════════════════════════════════════════════
     Low-level SSE stream reader
  ════════════════════════════════════════════════════════════════════ */
  async function readStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ): Promise<string> {
    let accumulated = ''
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (!payload) continue
        try {
          const evt = JSON.parse(payload)
          const delta = evt.choices?.[0]?.delta?.content
          if (delta) accumulated += delta
        } catch {
          // non-JSON SSE tokens (e.g. "[DONE]")
        }
      }
    }

    // Drain any remainder
    if (buffer) {
      const lines = buffer.split('\n')
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (!payload) continue
        try {
          const evt = JSON.parse(payload)
          const delta = evt.choices?.[0]?.delta?.content
          if (delta) accumulated += delta
        } catch {
          // ignore
        }
      }
    }

    return accumulated
  }

  /* ════════════════════════════════════════════════════════════════════
     Fire the recommendStyle backend function and surface the result as
     a visual block — bypasses OpenAI latency entirely (≈0 ms).
  ════════════════════════════════════════════════════════════════════ */
  async function runRecommendStyleInline(
    faceShape: string,
    maintenance: string,
    vibe: string,
  ) {
    setIsTyping(true)

    try {
      const res = await fetch('/api/chatbot/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceShape, maintenance, vibe }),
      })

      if (!res.ok) {
        throw new Error(`recommend API ${res.status}`)
      }

      const data = (await res.json()) as {
        type: string
        data: Record<string, unknown> & { stylingTips?: string[] }
        message?: string
      }

      // Show the AI's follow-up text first, then the recommendation card
      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message as string },
        ])
      }

      setVisuals('serviceRecommendation', data.data)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          visualType: 'serviceRecommendation',
          visualData: data.data,
        },
      ])
    } catch (err) {
      console.error('[chatbot] recommendStyle inline error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I ran into an issue generating that recommendation — want to book with Jonathan directly? He'll sort you out in person.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     Core send function — stream → parse → update state
  ════════════════════════════════════════════════════════════════════ */
  async function doSend(userText: string) {
    // Quick-refuse if already typing or empty
    if (!userText.trim() || isTyping) return

    const trimmed = userText.trim()

    // Add user message immediately
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsTyping(true)
    setVisuals(null, null)

    // Build the conversation history for this turn (same 20-message cap
    // used by the original implementation to control prompt length)
    const historyPayload = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Save the user text so the right bot reply matches this turn
    const thisTurnUserText = trimmed

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No body reader')

      const accumulated = await readStream(reader)
      const { clean: finalText, type: finalType, data: finalData } =
        extractVisualData(accumulated)

      // Update visual refs first (no dependency on bot message message)
      setVisuals(finalType, finalData)

      // Append the bot message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: finalText || "I'm having trouble connecting right now. Try again in a moment.",
          visualType: finalType,
          visualData: finalData,
        },
      ])
    } catch (err) {
      console.error('[chatbot] stream error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "That's on me — my connection stuttered for a second. Give me another shot or call the shop at (518) 961-6997.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     Form submit handler (Enter key)
  ════════════════════════════════════════════════════════════════════ */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (input.trim() && !isTyping) {
        await doSend(input.trim())
      }
    },
    [input, isTyping],
  )

  /* ════════════════════════════════════════════════════════════════════
     Quick-reply event bridge
     Buttons in WelcomeCard and QuickReplyButtons dispatch
     'chatbot-quick-reply' with { detail: string }.
  ════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as CustomEvent<string>
      const detail: string = event.detail
      const lower = detail.toLowerCase()

      // ── If we're mid-advice, the quick-reply is an answer to the current question ──
      if (advice.phase !== 'idle' && !isTimeSlot(detail)) {
        handleAdviceChip(detail)
        return
      }

      // ── Quick-reply in idle mode maps to an action ──
      switch (detail) {
        case 'services':
          void doSend(ACTION_MESSAGES.services)
          break
        case 'available':
          void doSend(ACTION_MESSAGES.available)
          break
        case 'hours':
          void doSend(ACTION_MESSAGES.hours)
          break
        case 'style':
          startAdviceFlow()
          break
        default:
          void doSend(detail)
      }
    }

    window.addEventListener('chatbot-quick-reply', handler as EventListener)
    return () =>
      window.removeEventListener('chatbot-quick-reply', handler as EventListener)
  }, [advice.phase])

  /* ════════════════════════════════════════════════════════════════════
     Style-advice handlers
  ════════════════════════════════════════════════════════════════════ */

  /**
   * Called when the user taps a quick-reply chip during the advice flow.
   * - Records the answer in state
   * - Advances to the next question phase
   * - When all 3 answers are in → calls runRecommendStyleInline directly
   */
  function handleAdviceChip(answer: string) {
    setAdvice((prev) => {
      if (prev.phase === 'idle') return prev

      const next = { ...prev }

      if (prev.phase === 'face_shape') {
        next.phase = 'maintenance'
        next.faceShape = mapFaceShape(answer)
        void doSend(`What's your maintenance style? (Low / Medium / High)`)
      } else if (prev.phase === 'maintenance') {
        next.phase = 'vibe'
        next.maintenance = mapMaintenance(answer)
        void doSend(`And what vibe are you going for? (Professional / Edgy / Classic / Trendy)`)
      } else if (prev.phase === 'vibe') {
        next.vibe = mapVibe(answer)
        next.phase = 'idle'
        // Fire recommendation AFTER state is updated so onVibeCollected
        // has the full normalized state.
        setTimeout(() => {
          runRecommendStyleInline(next.faceShape, next.maintenance, next.vibe)
        }, 0)
      }

      return next
    })
  }

  /**
   * Called when the user clicks "💈 Style Advice" in the welcome card
   * or any explicit style-recommendation trigger.
   */
  function startAdviceFlow() {
    setAdvice({ phase: 'face_shape', faceShape: '', maintenance: '', vibe: '' })
    void doSend("Let's find your perfect cut — just 3 quick questions.\n\n**Question 1 / 3:** What's your face shape?")
  }

  /* ════════════════════════════════════════════════════════════════════
     Focus input when panel opens
  ════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: isOpen ? 0 : '100%', opacity: isOpen ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="
        fixed right-0 top-0 z-50
        h-full w-full sm:max-w-[390px]
        bg-obsidian-900/85 backdrop-blur-md
        border-l border-neon-blue/20
        flex flex-col shadow-2xl
      "
      role="dialog"
      aria-label="The Apprentice — chat assistant"
      aria-modal="true"
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <ChatHeader onClose={onClose} />

      {/* ── Messages ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !isTyping && advice.phase === 'idle' ? (
          <WelcomeCard />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={`msg-${i}`}
                role={msg.role}
                content={msg.content}
                visualType={msg.visualType ?? undefined}
                visualData={msg.visualData}
                onBook={(prefill) => {
                  // Close chat + bubble the prefill up to page.tsx
                  window.dispatchEvent(
                    new CustomEvent('chatbot-close', { detail: prefill }),
                  )
                }}
              />
            ))}

            {/* Quick-reply chips for the current advice question */}
            {adviceChips.length > 0 && (
              <QuickReplyButtons replies={adviceChips} />
            )}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ── Input bar ──────────────────────────────────────────────── */}
      <ChatInputBar
        input={input}
        setInput={setInput}
        isTyping={isTyping}
        onSubmit={handleSubmit}
        inputRef={inputRef}
      />
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   Sub-components
════════════════════════════════════════════════════════════════════════ */

function ChatHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-neon-blue/20 shrink-0">
      <div className="flex items-center gap-3">
        <div
          className="
            w-8 h-8 rounded-full
            bg-neon-blue/20 flex items-center justify-center
            border border-neon-blue/30
          "
          aria-hidden="true"
        >
          {/* mini comb silhouette */}
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 rounded bg-neon-blue/50" />
            <div className="absolute inset-0 flex items-center justify-center gap-px">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-0.5 h-3 rounded-full bg-white" />
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-white text-sm font-semibold leading-tight">
            The Apprentice
          </h3>
          <p className="text-[0.625rem] text-neon-blue/40 leading-tight">
            Cuts · Fades · Bookings
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="
          text-gray-500 hover:text-neon-blue/70
          transition-colors p-1 rounded
          focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-blue
        "
        aria-label="Close chat"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ChatInputBar({
  input,
  setInput,
  isTyping,
  onSubmit,
  inputRef,
}: {
  input: string
  setInput: (v: string) => void
  isTyping: boolean
  onSubmit: (e: React.FormEvent) => void
  inputRef: React.Ref<HTMLInputElement>
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-2 px-4 py-3 border-t border-neon-blue/20 shrink-0"
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about cuts, fades, prices…"
        disabled={isTyping}
        aria-label="Chat message"
        className="
          flex-1
          bg-obsidian-800 border border-neon-blue/30
          rounded-xl px-4 py-2.5
          text-sm text-white
          placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-neon-blue/50
          disabled:opacity-50
          transition-colors
        "
      />
      <button
        type="submit"
        disabled={!input.trim() || isTyping}
        aria-label="Send message"
        className="
          bg-neon-blue/20 border border-neon-blue/30
          rounded-xl px-4 py-2.5
          text-white
          hover:bg-neon-blue/30
          focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors chat-glow
        "
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9-2-9-18-9 18 9-2z"
          />
        </svg>
      </button>
    </form>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   Pure helpers
════════════════════════════════════════════════════════════════════════ */

/** Returns true when the string looks like a time-slot label */
function isTimeSlot(text: string): boolean {
  return /\d{1,2}:\d{2}\s*(am|pm)?/i.test(text)
}

/** Normalize freeform face-shape text to the enum value * registered with the model */
function mapFaceShape(raw: string): string {
  const m = raw.toLowerCase()
  if (m.includes('oval'))   return 'OVAL'
  if (m.includes('round'))  return 'ROUND'
  if (m.includes('square')) return 'SQUARE'
  if (m.includes('heart'))  return 'HEART'
  if (m.includes('oblong')) return 'OBLONG'
  if (m.includes('diamond'))return 'DIAMOND'
  return 'UNKNOWN'
}

/** Normalize freeform maintenance text to LOW / MEDIUM / HIGH */
function mapMaintenance(raw: string): string {
  const m = raw.toLowerCase()
  if (m.includes('low') || m.includes('wash') || m.includes('go')) return 'LOW'
  if (m.includes('high') || m.includes('daily'))                   return 'HIGH'
  return 'MEDIUM'
}

/** Normalize freeform vibe text to the registered enum value */
function mapVibe(raw: string): string {
  const m = raw.toLowerCase()
  if (m.includes('professional') || m.includes('office')) return 'PROFESSIONAL'
  if (m.includes('edgy')    || m.includes('bold'))        return 'EDGY'
  if (m.includes('classic') || m.includes('timeless'))    return 'CLASSIC'
  return 'TRENDY'
}

/* Indicate this is a client component — keep the border clean */
export { }

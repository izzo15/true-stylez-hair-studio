'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import ServiceCard from './ServiceCard'
import QuickReplyButtons from './QuickReplyButtons'

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
  | undefined

type MessageBubbleProps = {
  role: 'user' | 'assistant'
  content?: string
  visualType?: VisualType
  visualData?: unknown
  /**
   * Called when the user clicks "Book This →" on a service card.
   * Receives the service + optional prefill so the parent can:
   *  1. close the chat panel
   *  2. scroll the page to the booking widget
   *  3. pass the prefill to BookingWidget via the store/event system
   */
  onBook?: (prefill: {
    serviceId: string
    barberId?: string | null
    date?: string | null
    time?: string | null
  }) => void
}

/* ════════════════════════════════════════════════════════════════════════
   Public methods
════════════════════════════════════════════════════════════════════════ */

function renderVisuals(
  visualType: VisualType,
  visualData: unknown,
  onBook?: MessageBubbleProps['onBook'],
) {
  if (!visualType || !visualData) return null

  switch (visualType) {
    /* ── Service list grid ── */
    case 'serviceList': {
      const list = visualData as Array<{
        id: string; name: string; price: number
        duration: number; category: string
      }>
      if (!Array.isArray(list)) return null
      return (
        <div className="grid gap-3 mt-3">
          {list.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onBook={() =>
                onBook?.({
                  serviceId: svc.id,
                  barberId: null,
                  date: null,
                  time: null,
                })
              }
            />
          ))}
        </div>
      )
    }

    /* ── Single recommendation card ── */
    case 'serviceRecommendation': {
      const rec = visualData as {
        id: string; name: string; price: number
        duration: number; category: string
        stylingTips?: string[]
      }
      if (!rec?.id) return null
      return (
        <div className="mt-3">
          <ServiceCard
            service={rec}
            onBook={() =>
              onBook?.({
                serviceId: rec.id,
                barberId: null,
                date: null,
                time: null,
              })
            }
          />
        </div>
      )
    }

    /* ── Availability time-slot chips ── */
    case 'availabilitySlots': {
      const slots = visualData as string[]
      if (!Array.isArray(slots)) return null
      return (
        <div className="mt-3">
          <p className="text-sm text-neon-blue/70 mb-2">Available time slots:</p>
          <QuickReplyButtons replies={slots} />
        </div>
      )
    }

    /* ── Shop hours card ── */
    case 'hours': {
      const h = visualData as {
        hours: Record<string, string>
        address: string
        phone: string
      }
      const entries = Object.entries(h?.hours ?? {})
      return (
        <div
          className="mt-3 rounded-lg p-4
                     bg-obsidian-800/50 border border-neon-blue/20"
        >
          <h3 className="font-semibold text-neon-blue text-sm mb-2 tracking-wide uppercase">
            Shop Information
          </h3>
          <div className="space-y-2.5">
            <div>
              <p className="font-medium text-white text-sm">Hours</p>
              {entries.map(([day, time]) => (
                <p key={day} className="text-sm text-gray-300">
                  <span className="mr-1.5 text-gray-500">{day}:</span>
                  {time}
                </p>
              ))}
            </div>
            <div>
              <p className="font-medium text-white text-sm">Address</p>
              <p className="text-sm text-gray-300">{h.address}</p>
            </div>
            <div>
              <p className="font-medium text-white text-sm">Phone</p>
              <a
                href={`tel:${h.phone.replace(/\D/g, '')}`}
                className="text-sm text-neon-blue/80 hover:text-neon-blue transition-colors"
              >
                {h.phone}
              </a>
            </div>
          </div>
        </div>
      )
    }

    /* ── Barber cards ── */
    case 'barbers': {
      const barbers = visualData as Array<{
        id: string; name: string; specialties: string[]
      }>
      if (!Array.isArray(barbers)) return null
      return (
        <div className="grid gap-3 mt-3">
          {barbers.map((b) => (
            <div
              key={b.id}
              className="rounded-xl p-4
                         bg-obsidian-700/50 border border-neon-purple/20"
            >
              <h3 className="font-semibold text-white text-sm">{b.name}</h3>
              {b.specialties?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-neon-purple/50 uppercase tracking-wide">
                    Specialties
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    {b.specialties.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    default:
      return null
  }
}

/* ════════════════════════════════════════════════════════════════════════
   Motion variants
════════════════════════════════════════════════════════════════════════ */

const bubbleVariants: Variants = {
  enter : { y: 16, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit  : { y: -8, opacity: 0 },
}

const bubbleTransition = { type: 'spring', stiffness: 300, damping: 28 }

/* ════════════════════════════════════════════════════════════════════════
   Component
════════════════════════════════════════════════════════════════════════ */

export default function MessageBubble({
  role,
  content,
  visualType,
  visualData,
  onBook,
}: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={bubbleVariants}
      transition={bubbleTransition}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
       <div
        className={`
          max-w-[82%] rounded-2xl px-4 py-2.5
          ${isUser
            ? 'bg-neon-blue/15 text-white rounded-br-sm border border-neon-blue/25'
            : 'bg-obsidian-800/80 text-white rounded-bl-sm border border-neon-purple/15'
          }
        `}
      >
        {content && (
          <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed">
            {content}
          </p>
        )}
        {renderVisuals(visualType, visualData, onBook)}
      </div>
    </motion.div>
  )
}

/**
 * The Apprentice — Function Definitions & Executors
 *
 * Each exported object follows the OpenAI function-calling shape:
 *   { name, description, parameters, execute(args) }
 * The `execute` method is the server-side handler called by the API route.
 */

import { db } from '@/lib/db'
import { getAvailableSlots, formatSlotTime } from '@/lib/availability'

/* ═══════════════════════════════════════════════════════
   Shared types
═══════════════════════════════════════════════════════ */

export interface ServiceRecord {
  id: string
  name: string
  price: number
  duration: number
  category: string | null
  description?: string
}

export interface BarberRecord {
  id: string
  name: string
  specialties: string[]
}

export interface BookingPrefill {
  serviceId: string
  barberId: string | null
  date: string | null
  time: string | null
}

export interface HoursRecord {
  hours: Record<string, string>
  address: string
  phone: string
}

export interface StyleRecommendation extends ServiceRecord {
  stylingTips: string[]
}

/* ═══════════════════════════════════════════════════════
   Function 1 — getServices
═══════════════════════════════════════════════════════ */

export const getServices = {
  name: 'getServices',
  description:
    'Get all available services with their names, prices, and durations. Use this whenever the customer asks about services, menu, prices, cuts, or fades.',
  parameters: {
    type: 'object',
    properties: {},
  },

  execute: async (): Promise<ServiceRecord[]> => {
    try {
      const services = await db.service.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
          category: true,
        },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      })
      return services
    } catch (error) {
      console.error('[chatbot] getServices error:', error)
      throw new Error('Failed to retrieve services')
    }
  },
}

/* ═══════════════════════════════════════════════════════
   Function 2 — getBarbers
═══════════════════════════════════════════════════════ */

export const getBarbers = {
  name: 'getBarbers',
  description:
    'Get all barbers with their names and specialties. Use this when the customer asks about the team, staff, or specific barbers.',
  parameters: {
    type: 'object',
    properties: {},
  },

  execute: async (): Promise<BarberRecord[]> => {
    try {
      const barbers = await db.barber.findMany({
        select: {
          id: true,
          name: true,
          specialties: true,
        },
      })
      return barbers
    } catch (error) {
      console.error('[chatbot] getBarbers error:', error)
      throw new Error('Failed to retrieve barbers')
    }
  },
}

/* ═══════════════════════════════════════════════════════
   Function 3 — getAvailability
═══════════════════════════════════════════════════════ */

export const getAvailability = {
  name: 'getAvailability',
  description:
    'Get available time slots for a given date, service, and optional barber. Returns an array of human-readable time strings like ["10:00 AM", "10:30 AM"].',
  parameters: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        description: 'Date in YYYY-MM-DD format (required)',
      },
      serviceId: {
        type: 'string',
        description: 'ID of the service being booked (required)',
      },
      barberId: {
        type: 'string',
        description: 'Optional barber ID to check a specific barber only',
      },
    },
    required: ['date', 'serviceId'],
  },

  execute: async ({
    date,
    serviceId,
    barberId,
  }: {
    date: string
    serviceId: string
    barberId?: string
  }): Promise<string[]> => {
    try {
      // Fetch service duration
      const service = await db.service.findUnique({
        where: { id: serviceId },
        select: { duration: true },
      })
      if (!service) {
        return [`Service ${serviceId} not found — please try again.`]
      }

      // Fetch existing bookings for this day
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const where: any = {
        serviceId,
        startTime: { gte: dayStart, lte: dayEnd },
        status: { in: ['PENDING', 'CONFIRMED'] },
      }
      if (barberId) where.barberId = barberId

      const existing = await db.booking.findMany({
        where,
        select: { startTime: true, endTime: true },
      })

      const bookedSlots = existing.map((b) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      }))

      const slots = getAvailableSlots(new Date(date), service.duration, bookedSlots)
      return slots.map((s) => formatSlotTime(s.startTime))
    } catch (error) {
      console.error('[chatbot] getAvailability error:', error)
      throw new Error('Failed to retrieve availability')
    }
  },
}

/* ═══════════════════════════════════════════════════════
   Function 4 — getHours
═══════════════════════════════════════════════════════ */

export const getHours = {
  name: 'getHours',
  description:
    'Get shop hours, address, and phone number. Use this for any hours, location, address, or directions question.',
  parameters: {
    type: 'object',
    properties: {},
  },

  execute: async (): Promise<HoursRecord> => ({
    hours: {
      Tuesday: '10:00 AM – 6:00 PM',
      Wednesday: '10:00 AM – 6:00 PM',
      Thursday: '10:00 AM – 6:00 PM',
      Friday: '10:00 AM – 6:00 PM',
      Saturday: '10:00 AM – 4:30 PM',
      Sunday: 'Closed',
      Monday: 'Closed',
    },
    address: '332 Congress St, Suite 1, Troy, NY 12180',
    phone: '(518) 961-6997',
  }),
}

/* ═══════════════════════════════════════════════════════
   Function 5 — recommendStyle
═══════════════════════════════════════════════════════ */

export const recommendStyle = {
  name: 'recommendStyle',
  description:
    'Recommend a service based on the customer\'s face shape, maintenance preference, and desired vibe. Returns the recommended service object plus styling tips.',
  parameters: {
    type: 'object',
    properties: {
      faceShape: {
        type: 'string',
        enum: ['OVAL', 'ROUND', 'SQUARE', 'HEART', 'OBLONG', 'DIAMOND', 'UNKNOWN'],
        description: 'The customer\'s face shape',
      },
      maintenance: {
        type: 'string',
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        description: 'LOW = wash & go, MEDIUM = some product, HIGH = daily styling',
      },
      vibe: {
        type: 'string',
        enum: ['PROFESSIONAL', 'EDGY', 'CLASSIC', 'TRENDY'],
        description: 'The desired vibe or style direction',
      },
    },
    required: ['faceShape', 'maintenance', 'vibe'],
  },

  execute: async ({
    faceShape,
    maintenance,
    vibe,
  }: {
    faceShape: string
    maintenance: string
    vibe: string
  }): Promise<StyleRecommendation> => {
    // ── Face-shape → base service mapping ──
    const baseServiceMap: Record<string, string> = {
      OVAL: 'Haircut',
      ROUND: 'Skin Fade',
      SQUARE: 'Haircut & Beard',
      HEART: 'Mid Skin Fade',
      OBLONG: 'Haircut & Beard',
      DIAMOND: 'High Skin Fade',
      UNKNOWN: 'Haircut',
    }

    let serviceName = baseServiceMap[faceShape] ?? 'Haircut'
    const tips: string[] = []

    // ── Maintenance tips ──
    switch (maintenance) {
      case 'LOW':
        tips.push('Go for a wash-and-go style — minimal product needed.')
        break
      case 'MEDIUM':
        tips.push('A matte paste or cream will give you hold and texture without the shine.')
        break
      case 'HIGH':
        tips.push('Daily product game is key — consider a pomade or clay for all-day hold.')
        break
    }

    // ── Vibe tips ──
    switch (vibe) {
      case 'PROFESSIONAL':
        tips.push('Keep it clean — a classic taper or side part never lets you down in the office.')
        break
      case 'EDGY':
        tips.push('Textured disconnected layers or a hard part will turn heads.')
        break
      case 'CLASSIC':
        tips.push('A timeless taper or classic crew cut — it works now and in 10 years.')
        break
      case 'TRENDY':
        tips.push('Try a modern textured fringe or a burst fade for that fresh look.')
        break
    }

    // ── Look up exact price/duration in DB ──
    try {
      const match = await db.service.findFirst({
        where: { name: serviceName },
        select: { id: true, name: true, price: true, duration: true, category: true },
        orderBy: { price: 'asc' },
      })
      if (match) {
        return { ...match, stylingTips: tips }
      }
    } catch (error) {
      console.error('[chatbot] recommendStyle DB lookup error:', error)
    }

    // ── Fallback (shouldn't normally reach here if DB is seeded) ──
    return {
      id: `rec-${faceShape}-${maintenance}-${vibe}`,
      name: serviceName,
      price: 0,
      duration: 0,
      category: 'Recommended',
      stylingTips: tips,
    }
  },
}

/* ═══════════════════════════════════════════════════════
   Function 6 — createBookingIntent
═══════════════════════════════════════════════════════ */

export const createBookingIntent = {
  name: 'createBookingIntent',
  description:
    'Create a booking intent. Validates the service (and optional barber) exist in the database and returns prefill data suitable for the booking widget. Never write to the database here — the user completes the booking in the widget.',
  parameters: {
    type: 'object',
    properties: {
      serviceId: {
        type: 'string',
        description: 'ID of the service to book (required)',
      },
      barberId: {
        type: 'string',
        description: 'ID of the preferred barber (optional)',
      },
      date: {
        type: 'string',
        description: 'Preferred date in YYYY-MM-DD format (optional)',
      },
      time: {
        type: 'string',
        description: 'Preferred time in HH:MM 24-h format (optional)',
      },
    },
    required: ['serviceId'],
  },

  execute: async ({
    serviceId,
    barberId,
    date,
    time,
  }: {
    serviceId: string
    barberId?: string
    date?: string
    time?: string
  }): Promise<BookingPrefill> => {
    // Validate service
    const service = await db.service.findUnique({
      where: { id: serviceId },
      select: { id: true, name: true },
    })
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`)
    }

    // Validate barber (if provided)
    if (barberId) {
      const barber = await db.barber.findUnique({
        where: { id: barberId },
        select: { id: true },
      })
      if (!barber) {
        throw new Error(`Barber not found: ${barberId}`)
      }
    }

    return {
      serviceId,
      barberId: barberId ?? null,
      date: date ?? null,
      time: time ?? null,
    }
  },
}

/* ═══════════════════════════════════════════════════════
   Convenience export
═══════════════════════════════════════════════════════ */

export const functions = {
  getServices,
  getBarbers,
  getAvailability,
  getHours,
  recommendStyle,
  createBookingIntent,
}

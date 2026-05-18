import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { getAvailableSlots } from '@/lib/availability'
import { sendBookingConfirmation } from '@/lib/email'

const bookingSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  note: z.string().optional(),
  serviceId: z.string(),
  barberId: z.string().optional(),
  startTime: z.string().datetime(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date')
  const status = searchParams.get('status')

  let where: any = {}
  
  if (date) {
    const selectedDate = new Date(date)
    where.startTime = {
      gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
      lte: new Date(selectedDate.setHours(23, 59, 59, 999)),
    }
  }
  
  if (status) {
    where.status = status
  }

  const bookings = await db.booking.findMany({
    where,
    include: { service: true, barber: true },
    orderBy: { startTime: 'asc' },
  })

  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = bookingSchema.parse(body)

    const service = await db.service.findUnique({ where: { id: data.serviceId } })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    const startTime = new Date(data.startTime)
    const endTime = new Date(startTime.getTime() + service.duration * 60000)

    let existingBookings: { startTime: Date; endTime: Date }[] = []
    if (data.barberId) {
      existingBookings = await db.booking.findMany({
        where: {
          barberId: data.barberId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          OR: [
            { startTime: { lte: startTime }, endTime: { gt: startTime } },
            { startTime: { lt: endTime }, endTime: { gte: endTime } },
          ],
        },
      })
    }

    const slots = getAvailableSlots(startTime, service.duration, existingBookings)
    const slotAvailable = slots.some(slot => 
      slot.startTime.getTime() === startTime.getTime()
    )

    if (!slotAvailable && data.barberId) {
      return NextResponse.json({ error: 'Time slot not available' }, { status: 400 })
    }

    const booking = await db.booking.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        note: data.note,
        serviceId: data.serviceId,
        barberId: data.barberId,
        startTime,
        endTime,
      },
      include: { service: true, barber: true },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAvailableSlots } from '@/lib/availability'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')
  const barberId = searchParams.get('barberId')

  if (!date || !serviceId) {
    return NextResponse.json({ error: 'Missing required params' }, { status: 400 })
  }

  const selectedDate = new Date(date)
  const service = await db.service.findUnique({ where: { id: serviceId } })

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  let existingBookings: { startTime: Date; endTime: Date }[] = []
  if (barberId) {
    const dayStart = new Date(selectedDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(selectedDate)
    dayEnd.setHours(23, 59, 59, 999)
    existingBookings = await db.booking.findMany({
      where: {
        barberId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: { startTime: true, endTime: true },
    })
  }

  const slots = getAvailableSlots(selectedDate, service.duration, existingBookings)
  
  return NextResponse.json(slots.map(slot => ({
    startTime: slot.startTime.toISOString(),
    endTime: slot.endTime.toISOString(),
  })))
}
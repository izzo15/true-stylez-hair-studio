import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { sendBookingConfirmation } from '@/lib/email'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  note: z.string().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)

    const booking = await db.booking.update({
      where: { id },
      data,
      include: { service: true, barber: true },
    })

    if (data.status === 'CONFIRMED' && booking.email) {
      await sendBookingConfirmation(booking.email, {
        customerName: booking.customerName,
        serviceName: booking.service.name,
        startTime: booking.startTime,
        endTime: booking.endTime,
      })
    }

    return NextResponse.json(booking)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
}
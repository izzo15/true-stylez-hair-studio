import { addMinutes, format, parse, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns'

export const BUSINESS_HOURS = {
  tuesday: { open: 10, close: 18 },
  wednesday: { open: 10, close: 18 },
  thursday: { open: 10, close: 18 },
  friday: { open: 10, close: 18 },
  saturday: { open: 10, close: 16.5 },
  sunday: null,
  monday: null,
}

export function getAvailableSlots(date: Date, serviceDuration: number, existingBookings: { startTime: Date; endTime: Date }[] = []) {
  const dayOfWeek = format(date, 'EEEE').toLowerCase()
  const hours = BUSINESS_HOURS[dayOfWeek as keyof typeof BUSINESS_HOURS]

  if (!hours) return []

  const slots: { startTime: Date; endTime: Date }[] = []
  const startHour = hours.open
  const endHour = hours.close

  let currentStart = new Date(date)
  currentStart.setHours(Math.floor(startHour), (startHour % 1) * 60, 0, 0)

  const endDateTime = new Date(date)
  endDateTime.setHours(Math.floor(endHour), (endHour % 1) * 60, 0, 0)

  while (isBefore(addMinutes(currentStart, serviceDuration), endDateTime) || 
         format(addMinutes(currentStart, serviceDuration), 'HH:mm') === format(endDateTime, 'HH:mm')) {
    const slotEnd = addMinutes(currentStart, serviceDuration)
    const isAvailable = !existingBookings.some(booking => 
      (isAfter(currentStart, booking.startTime) && isBefore(currentStart, booking.endTime)) ||
      (isAfter(slotEnd, booking.startTime) && isBefore(slotEnd, booking.endTime)) ||
      (isBefore(currentStart, booking.startTime) && isAfter(slotEnd, booking.endTime))
    )

    if (isAvailable) {
      slots.push({ startTime: new Date(currentStart), endTime: slotEnd })
    }

    currentStart = addMinutes(currentStart, 30)
  }

  return slots
}

export function formatSlotTime(date: Date) {
  return format(date, 'h:mm a')
}

export function isBusinessDay(date: Date) {
  const day = format(date, 'EEEE').toLowerCase()
  return day in BUSINESS_HOURS && BUSINESS_HOURS[day as keyof typeof BUSINESS_HOURS] !== null
}
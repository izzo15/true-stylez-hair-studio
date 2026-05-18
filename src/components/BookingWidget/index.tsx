'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  price: number
  duration: number
  category: string
}

interface Barber {
  id: string
  name: string
}

interface Slot {
  startTime: string
  endTime: string
}

interface Booking {
  id: string
  customerName: string
  email?: string
  phone?: string
  note?: string
  service: { id: string; name: string; price: number; duration: number }
  barber?: { id: string; name: string }
  startTime: string
  endTime: string
  status: string
}

function extractSlots(slots: Slot[]): string[] {
  return slots.map(slot =>
    new Date(slot.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

export function BookingWidget() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingBarbers, setLoadingBarbers] = useState(true)
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedBarber, setSelectedBarber] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string>('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data)
        setLoadingServices(false)
      })
      .catch(() => setLoadingServices(false))

fetch('/api/barbers')
       .then(res => res.json())
       .then(data => {
         setBarbers(data)
         setLoadingBarbers(false)
       })
       .catch(() => setLoadingBarbers(false))
   }, [])

   useEffect(() => {
     const handler = (e: CustomEvent) => {
       const serviceId = e.detail
       if (serviceId && services.some(s => s.id === serviceId)) {
         setSelectedService(serviceId)
         setStep(2)
       }
     }
     window.addEventListener('prefill-service', handler as any)
     return () => window.removeEventListener('prefill-service', handler as any)
   }, [services])

      useEffect(() => {
        if (selectedDate && selectedService) {
          setLoadingSlots(true)
          setSelectedTime('')
          setAvailableTimes([])

          const params = new URLSearchParams({
            date: selectedDate,
            serviceId: selectedService,
            ...(selectedBarber && { barberId: selectedBarber }),
          })

          fetch(`/api/availability?${params}`)
            .then(res => res.json())
            .then(data => {
              if (data.error) {
                setAvailableTimes([])
              } else {
                setAvailableTimes(extractSlots(data))
              }
              setLoadingSlots(false)
            })
            .catch(() => {
              setAvailableTimes([])
              setLoadingSlots(false)
            })
        }
      }, [selectedDate, selectedService, selectedBarber])

      // Track booking start when user enters details step
      useEffect(() => {
        if (step === 3) {
          window.plausible?.('track', { props: { booking_step: 'details' } });
        }
      }, [step])

      // Track booking completion
      useEffect(() => {
        if (isSuccess && createdBooking) {
          window.plausible?.('track', 'Booking Complete', {
            props: {
              service: createdBooking.service?.name,
              bookingId: createdBooking.id,
            }
          });
        }
      }, [isSuccess, createdBooking]);

      // Keyboard navigation between steps (Alt+ArrowLeft / Alt+ArrowRight)
      useEffect(() => {
        const handler = (e: KeyboardEvent) => {
          if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            e.preventDefault()
            if (e.key === 'ArrowRight' && step < 3) {
              setStep(s => Math.min(s + 1, 3))
            }
            if (e.key === 'ArrowLeft' && step > 1) {
              setStep(s => Math.max(s - 1, 1))
            }
          }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
      }, [step])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setBookingError('')

    const service = services.find(s => s.id === selectedService)
    if (!service) {
      setIsSubmitting(false)
      return
    }

    // Parse time properly - handle "9:00 AM" format
    const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
    let startTimeISO = ''
    if (timeMatch) {
      const [, hours, minutes, period] = timeMatch
      let h = parseInt(hours, 10)
      if (period.toUpperCase() === 'PM' && h !== 12) h += 12
      if (period.toUpperCase() === 'AM' && h === 12) h = 0
      startTimeISO = `${selectedDate}T${String(h).padStart(2, '0')}:${minutes}:00.000Z`
    } else {
      startTimeISO = `${selectedDate}T${selectedTime.replace(' ', '')}`
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone: phone || undefined,
          email: email || undefined,
          note: note || undefined,
          serviceId: selectedService,
          barberId: selectedBarber || undefined,
          startTime: startTimeISO,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Booking failed')
      }

      const booking = await res.json()
      setCreatedBooking(booking)
      setIsSuccess(true)
    } catch (err: any) {
      setBookingError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetBooking = () => {
    setIsSuccess(false)
    setBookingError('')
    setSelectedService('')
    setSelectedBarber('')
    setSelectedDate('')
    setSelectedTime('')
    setCustomerName('')
    setPhone('')
    setEmail('')
    setNote('')
    setAvailableTimes([])
  }

  if (isSuccess && createdBooking) {
    const service = services.find(s => s.id === createdBooking.service?.id)
    const barber = barbers.find(b => b.id === createdBooking.barber?.id)
    const start = new Date(createdBooking.startTime)
    
    return (
      <motion.div
        role="region"
        aria-label="Booking confirmed"
        aria-live="polite"
        aria-atomic="true"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center py-12 glass rounded-2xl"
      >
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 text-accent"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
            }}
            transition={{ delay: i * 0.02, duration: 1 }}
          >
            ✂️
          </motion.div>
        ))}

        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Appointment Booked!</h2>
        
        <div className="glass rounded-xl p-5 inline-block mb-6 text-left max-w-xs mx-auto">
          <p className="text-xs text-accent font-medium mb-1">Booking #{createdBooking.id.slice(-6).toUpperCase()}</p>
          <p className="font-bold text-lg">{createdBooking.service?.name || service?.name}</p>
          <p className="text-accent font-semibold">${createdBooking.service?.price || service?.price}</p>
          <p className="text-gray-400 text-sm mt-2">
            {start.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-gray-400 text-sm">
            {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
          {barber && <p className="text-gray-500 text-xs mt-1">with {barber.name}</p>}
        </div>
        
        <p className="text-gray-400 mb-6">We&apos;ll see you soon at True Stylez.</p>
        <button
          onClick={resetBooking}
          className="px-6 py-2 bg-accent text-white rounded-full"
        >
          Book Another
        </button>
      </motion.div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="service"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-bold mb-4">Select Service</h3>
            {loadingServices ? (
              <div aria-live="polite" aria-atomic="true">
                <div className="flex justify-center py-8">
                  <div className="barber-pole w-1 h-12 rounded-full" aria-hidden="true" />
                </div>
                <span className="sr-only">Loading services…</span>
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Select a service">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  role="radio"
                  aria-checked={selectedService === service.id}
                  aria-label={`${service.name}, ${service.price} dollars, ${service.duration} minutes`}
                  className={cn(
                    'p-4 rounded-lg border transition-all text-left',
                    selectedService === service.id
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-700 hover:border-gray-600'
                  )}
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-400">${service.price} • {service.duration} min</div>
                </button>
              ))}
            </div>
            )}
            <button
              type="button"
              onClick={() => {
                window.plausible?.('track', { props: { step: 'service_to_datetime' } });
                setStep(2);
              }}
              disabled={!selectedService || loadingServices}
              className="w-full mt-6 py-3 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="datetime"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-bold mb-4">Select Date &amp; Time</h3>

            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {loadingSlots ? 'Loading available time slots' : ''}
            </div>

            <label htmlFor="booking-date" className="sr-only">Select a date</label>
            <input
              id="booking-date"
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select appointment date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700 mb-4"
            />
            {barbers.length > 1 && (
              <>
              <label htmlFor="booking-barber" className="sr-only">Select barber</label>
              <select
                id="booking-barber"
                value={selectedBarber}
                aria-label="Select a barber"
                onChange={(e) => {
                  setSelectedBarber(e.target.value)
                  setSelectedTime('')
                }}
                className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700 mb-4"
              >
                <option value="">Any Barber</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              </>
            )}
            {selectedDate && (
              <div>
                {loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <div className="barber-pole w-1 h-12 rounded-full" />
                  </div>
                ) : availableTimes.length === 0 ? (
                  <p className="text-center text-gray-400 py-8" role="status">
                    No available slots for this day – try another date or barber.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto" role="radiogroup" aria-label="Select a time slot">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        role="radio"
                        aria-checked={selectedTime === time}
                        aria-label={`${time} time slot`}
                        className={cn(
                          'p-2 rounded border text-sm',
                          selectedTime === time
                            ? 'border-accent bg-accent/10'
                            : 'border-gray-700 hover:border-gray-600'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setStep(1); setSelectedTime(''); setAvailableTimes([]) }}
                className="flex-1 py-3 border border-gray-700 rounded-lg"
              >
                Back
              </button>
            <button
              type="button"
              onClick={() => {
                window.plausible?.('track', { props: { step: 'datetime_to_details' } });
                setStep(3);
              }}
              disabled={!selectedDate || !selectedTime || loadingSlots}
              className="flex-1 py-3 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
            >
              Continue
            </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-bold mb-4">Your Details</h3>

            <div id="booking-error" aria-live="assertive" role="alert" aria-atomic="true">
              {bookingError && (
                <p className="text-red-400 text-sm mb-4">{bookingError}</p>
              )}
            </div>

            <div className="space-y-4">
              <label htmlFor="booking-name" className="sr-only">Full name</label>
              <input
                id="booking-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                aria-required="true"
                className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700"
              />
              <label htmlFor="booking-phone" className="sr-only">Phone number</label>
              <input
                id="booking-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700"
              />
              <label htmlFor="booking-email" className="sr-only">Email address</label>
              <input
                id="booking-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700"
              />
              <label htmlFor="booking-note" className="sr-only">Special requests</label>
              <textarea
                id="booking-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Special requests (optional)"
                rows={3}
                className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-700 rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !customerName}
                className="flex-1 py-3 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

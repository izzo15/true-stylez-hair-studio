'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'ALL'

interface BookingRow {
  id: string
  customerName: string
  phone: string | null
  email: string | null
  service: { name: string }
  barber: { name: string } | null
  startTime: string
  status: BookingStatus
}

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('PENDING')
  const [loading, setLoading] = useState(false)

  const fetchBookings = async (status: BookingStatus) => {
    setLoading(true)
    try {
      const url = status === 'ALL'
        ? '/api/bookings'
        : `/api/bookings?status=${status}`
      const res = await fetch(url)
      const data = await res.json()
      setBookings(data)
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchBookings(statusFilter)
    }
  }, [sessionStatus, statusFilter])

  const handleConfirm = async (id: string) => {
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CONFIRMED' as const } : b))
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CONFIRMED' }),
    })
    fetchBookings(statusFilter)
  }

  const handleCancel = async (id: string) => {
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' as const } : b))
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    fetchBookings(statusFilter)
  }

  if (sessionStatus === 'authenticated') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="glass rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome, Admin</h2>
            <p className="text-gray-400">Manage appointments below</p>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 border border-gray-600 rounded-lg text-sm"
          >
            Sign Out
          </button>
        </div>

        <div className="glass rounded-xl p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-xl font-bold">Bookings</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus)}
              className="p-2 rounded-lg bg-primary-800 border border-gray-700 text-sm"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="ALL">All</option>
            </select>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="barber-pole w-1 h-16 rounded-full mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No bookings found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2 hidden md:table-cell">Service</th>
                  <th className="pb-3 px-2 hidden lg:table-cell">Barber</th>
                  <th className="pb-3 px-2">Date &amp; Time</th>
                  <th className="pb-3 px-2 hidden sm:table-cell">Email</th>
                  <th className="pb-3 px-2 hidden sm:table-cell">Phone</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-800 hover:bg-primary-800/30">
                    <td className="py-3 px-2 font-medium">{booking.customerName}</td>
                    <td className="py-3 px-2 hidden md:table-cell">{booking.service?.name}</td>
                    <td className="py-3 px-2 hidden lg:table-cell">{booking.barber?.name ?? 'Any'}</td>
                    <td className="py-3 px-2">{new Date(booking.startTime).toLocaleString()}</td>
                    <td className="py-3 px-2 hidden sm:table-cell text-gray-400">{booking.email ?? '—'}</td>
                    <td className="py-3 px-2 hidden sm:table-cell text-gray-400">{booking.phone ?? '—'}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleConfirm(booking.id)}
                              className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs hover:bg-green-600/30"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs hover:bg-red-600/30"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="barber-pole w-2 h-16 rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-primary-800 border border-gray-700"
          />
          <button
            onClick={() => signIn('credentials', { email, password, callbackUrl: '/admin' })}
            className="w-full py-3 bg-accent text-white rounded-lg font-medium"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  )
}

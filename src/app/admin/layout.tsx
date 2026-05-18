import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login | Barber',
  description: 'Admin login page for managing appointments and bookings',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
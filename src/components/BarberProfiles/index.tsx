'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarberCard } from './BarberCard'

export function BarberProfiles() {
  const [barbers, setBarbers] = useState<{ id: string; name: string; bio: string | null; photoUrl: string | null; specialties: string[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/barbers')
      .then(res => res.json())
      .then(data => {
        setBarbers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex justify-center py-12">
        <div className="relative w-16 h-16">
          <div className="barber-pole w-1 h-full absolute left-1/2 -translate-x-1/2 rounded-full" />
        </div>
      </motion.div>
    )
  }

  const wrapperClass = barbers.length === 1
    ? 'flex justify-center'
    : 'flex justify-center gap-8 flex-wrap'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className={wrapperClass}>
        {barbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} single={barbers.length === 1} />
        ))}
      </div>
    </motion.div>
  )
}

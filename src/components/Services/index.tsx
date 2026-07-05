'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Service {
  id: string
  name: string
  price: number
  duration: number
  category: string
}

const CATEGORIES = ['All', 'Men', 'Fades', 'Beard', 'Kids']

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter(s => s.category === activeCategory)

  const handleServiceClick = (service: Service) => {
    window.dispatchEvent(new CustomEvent('prefill-service', { detail: { id: service.id } }))
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="relative w-16 h-16">
          <div className="barber-pole w-1 h-full absolute left-1/2 -translate-x-1/2 rounded-full" />
          <div className="absolute inset-0 poledot-spin">
            <div className="w-2 h-2 rounded-full bg-accent absolute" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full transition-all ${
              activeCategory === cat
                ? 'bg-accent text-white'
                : 'bg-primary-800 text-gray-300 hover:bg-primary-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleServiceClick(service)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleServiceClick(service) } }}
            aria-label={`Book ${service.name}, $${service.price}, ${service.duration} minutes`}
            className="glass rounded-lg p-4 text-center group relative overflow-hidden cursor-pointer hover:ring-1 hover:ring-accent/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all" />
            <div className="comb-wave pointer-events-none" />
            <h4 className="font-bold mb-1 relative z-10">{service.name}</h4>
            <p className="text-accent font-semibold relative z-10">${service.price}</p>
            <p className="text-gray-500 text-sm relative z-10">{service.duration} min</p>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

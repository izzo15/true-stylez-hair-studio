'use client'

import Link from 'next/link'
import { useState } from 'react'

const PixelBarber = () => {
  const [isNodding, setIsNodding] = useState(false)
  
  return (
    <div 
      className="relative w-10 h-10 cursor-pointer"
      onMouseEnter={() => setIsNodding(true)}
      onMouseLeave={() => setIsNodding(false)}
    >
      <div className={`pixel-barber transition-transform duration-300 ${isNodding ? 'animate-nod' : ''}`}>
        <div className="w-full h-full relative">
          {/* Head */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full border-2 border-amber-800"></div>
          {/* Eyes */}
          <div className="absolute top-3 left-1.5 -translate-x-1/2 w-1 h-1 bg-white rounded"></div>
          <div className="absolute top-3 left-3.5 -translate-x-1/2 w-1 h-1 bg-white rounded"></div>
          {/* Eyebrows (for expression) */}
          <div className={`absolute top-2 left-1.5 -translate-x-1/2 w-2 h-0.5 bg-amber-800 ${isNodding ? 'transform -rotate-5' : ''}`}></div>
          <div className={`absolute top-2 left-2.5 -translate-x-1/2 w-2 h-0.5 bg-amber-800 ${isNodding ? 'transform rotate-5' : ''}`}></div>
          {/* Nose */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-800"></div>
          {/* Mouth */}
          <div className={`absolute top-5 left-1/2 -translate-x-1/2 w-2 h-1 bg-amber-800 ${isNodding ? 'transform scale-y-120' : ''}`}></div>
          {/* Body */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rounded-tl-lg rounded-tr-lg"></div>
          {/* Arms */}
          <div className="absolute top-6 left-0 w-1 h-2 bg-amber-600"></div>
          <div className="absolute top-6 right-0 w-1 h-2 bg-amber-600"></div>
          {/* Legs */}
          <div className="absolute bottom-0 left-0.5 w-0.5 h-2 bg-amber-600"></div>
          <div className="absolute bottom-0 right-0.5 w-0.5 h-2 bg-amber-600"></div>
          {/* Barber pole */}
          <div className="absolute top-0 left-5 w-0.5 h-6 bg-transparent">
            <div className="w-full h-1 bg-red-600"></div>
            <div className="w-full h-1 bg-white"></div>
            <div className="w-full h-1 bg-red-600"></div>
            <div className="w-full h-1 bg-white"></div>
            <div className="w-full h-1 bg-red-600"></div>
            <div className="w-full h-1 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-primary-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">True Stylez Hair Studio</h3>
            <p className="text-gray-400">feat. J The Barber</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Contact</h4>
            <p className="text-gray-400">332 Congress St, 1</p>
            <p className="text-gray-400">Troy, NY 12180</p>
            <p className="text-gray-400">(518) 961-6997</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Hours</h4>
            <p className="text-gray-400">Tue–Fri: 10AM–6PM</p>
            <p className="text-gray-400">Sat: 10AM–4:30PM</p>
            <p className="text-gray-400">Sun/Mon: Closed</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <PixelBarber />
            <p className="text-gray-500">© 2024 True Stylez Hair Studio</p>
          </div>
          <a 
            href="https://instagram.com/j_thebarberny" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:underline logo-vibrate"
          >
            @j_thebarberny
          </a>
        </div>
      </div>
    </footer>
  )
}
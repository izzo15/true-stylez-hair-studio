'use client'

import { useEffect, useState } from 'react'

export function KonamiCode() {
  const [retroMode, setRetroMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('retroMode')
    if (saved === 'true') setRetroMode(true)

    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
    let konamiIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === konamiSequence[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiSequence.length) {
          localStorage.setItem('retroMode', 'true')
          setRetroMode(true)
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const exitRetroMode = () => {
    localStorage.removeItem('retroMode')
    setRetroMode(false)
    document.documentElement.classList.remove('konami-mode')
  }

  return retroMode ? (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={exitRetroMode}
        className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
      >
        🎮 Exit Retro Mode
      </button>
    </div>
  ) : null
}

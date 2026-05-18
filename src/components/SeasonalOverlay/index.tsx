'use client'

import { useEffect } from 'react'

export function SeasonalOverlay() {
  useEffect(() => {
    const now = new Date()
    const month = now.getMonth()
    const day = now.getDate()
    
    const root = document.documentElement
    
    // Set seasonal theme colors
    if (month === 11 && day >= 15) {
      // Christmas (Dec 15+)
      root.style.setProperty('--seasonal-color', '#0a3d0a')
      root.style.setProperty('--color-accent', '#c94600')
    } else if ((month === 9 && day >= 25) || (month === 10 && day <= 5)) {
      // Halloween (Oct 25 - Nov 5)
      root.style.setProperty('--seasonal-color', '#2d0044')
      root.style.setProperty('--color-accent', '#ff6b00')
    } else if (month === 1 && day >= 10 && day <= 16) {
      // Valentine's (Feb 10-16)
      root.style.setProperty('--seasonal-color', '#e63946')
      root.style.setProperty('--color-accent', '#e63946')
    } else if (month === 5 && day >= 15 && day <= 30) {
      // Summer (June 15-30)
      root.style.setProperty('--seasonal-color', '#00b4d8')
      root.style.setProperty('--color-accent', '#00b4d8')
    } else {
      // Default
      root.style.setProperty('--color-accent', '#d94600')
    }
  }, [])

  return null
}
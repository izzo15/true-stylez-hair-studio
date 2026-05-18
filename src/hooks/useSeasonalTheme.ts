import { useEffect } from 'react'
import { SEASONAL_THEMES } from '@/lib/seasonalTheme'

export function useSeasonalTheme() {
  useEffect(() => {
    const now = new Date()
    const month = now.getMonth()
    const day = now.getDate()

    let theme: typeof SEASONAL_THEMES[keyof typeof SEASONAL_THEMES] = SEASONAL_THEMES.default

    if (month === 11 && day >= 15) theme = SEASONAL_THEMES.christmas
    else if ((month === 9 && day >= 25) || (month === 10 && day <= 5)) theme = SEASONAL_THEMES.halloween
    else if (month === 1 && day >= 10 && day <= 16) theme = SEASONAL_THEMES.valentines
    else if (month === 5 && day >= 15 && day <= 30) theme = SEASONAL_THEMES.summer

    const root = document.documentElement
    root.style.setProperty('--primary-color', theme.primary)
    root.style.setProperty('--secondary-color', theme.secondary)
    root.style.setProperty('--color-accent', theme.primary)

    if (theme.overlay) {
      root.style.setProperty('--seasonal-overlay', theme.overlay)
    }
  }, [])
}

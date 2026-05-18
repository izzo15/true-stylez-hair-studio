type SeasonalTheme = {
  name: string
  primary: string
  secondary: string
  overlay?: string
}

export const SEASONAL_THEMES: Record<string, SeasonalTheme> = {
  default: { name: 'default', primary: '#d94600', secondary: '#1a1f2e' },
  christmas: { name: 'christmas', primary: '#c94600', secondary: '#0a3d0a', overlay: 'url(/textures/snowflakes.svg)' },
  halloween: { name: 'halloween', primary: '#ff6b00', secondary: '#2d0044', overlay: 'url(/textures/spider-web.svg)' },
  valentines: { name: 'valentines', primary: '#e63946', secondary: '#1a1f2e', overlay: 'url(/textures/hearts.svg)' },
  summer: { name: 'summer', primary: '#00b4d8', secondary: '#1a1f2e', overlay: 'url(/textures/sunglasses.svg)' },
}

export function getSeasonalThemeVars(): string {
  const now = new Date()
  const month = now.getMonth()
  const day = now.getDate()

  let theme: SeasonalTheme = SEASONAL_THEMES.default

  if (month === 11 && day >= 15) theme = SEASONAL_THEMES.christmas
  else if ((month === 9 && day >= 25) || (month === 10 && day <= 5)) theme = SEASONAL_THEMES.halloween
  else if (month === 1 && day >= 10 && day <= 16) theme = SEASONAL_THEMES.valentines
  else if (month === 5 && day >= 15 && day <= 30) theme = SEASONAL_THEMES.summer

  return (
    `--primary-color: ${theme.primary};` +
    `--secondary-color: ${theme.secondary};` +
    `--color-accent: ${theme.primary};` +
    (theme.overlay ? `--seasonal-overlay: ${theme.overlay};` : '')
  )
}

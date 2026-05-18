import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d2dbe6',
          300: '#adbdcb',
          400: '#8297ae',
          500: '#637a92',
          600: '#4d6478',
          700: '#3d5062',
          800: '#323d4d',
          900: '#1a1f2e',
        },
        accent: 'var(--color-accent, #d94600)',
        gold: '#c9a66b',
      },
      animation: {
        'pole-spin': 'pole-spin 3s linear infinite',
        'poledot-spin': 'poledot-spin 1s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scissor-cut': 'scissor-cut 0.5s ease-in-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'pole-spin': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        'poledot-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217, 70, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(217, 70, 0, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

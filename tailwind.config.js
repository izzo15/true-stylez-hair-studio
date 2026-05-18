/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-900': '#1a1f2e',
        'primary-800': '#1e293b',
        barber: {
          black: '#0a0a0a',
          dark: '#141414',
          charcoal: '#1e1e1e',
          slate: '#2a2a2a',
          gray: '#3a3a3a',
          lightGray: '#888888',
          silver: '#c0c0c0',
          cream: '#e8e2d9',
          gold: '#c9a84c',
          goldLight: '#e8e9c5',
          red: '#c0392b',
          redDark: '#a02020',
          white: '#f5f5f0',
        },
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        heading: ['var(--font-montserrat)'],
        body: ['var(--font-inter)'],
      },
      animation: {
        'pole-spin': 'pole-spin 3s linear infinite',
        'poledot-spin': 'poledot-spin 1s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(201,168,76,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(201,168,76,0.7)' },
        },
        'shimmer': {
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
}

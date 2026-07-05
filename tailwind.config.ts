import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display : ['Playfair Display', 'Georgia', 'serif'],
        heading : ['Montserrat', 'system-ui', 'sans-serif'],
        body    : ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ── Legacy section-background scale (still used across many
               sections/components — preserved as flat keys, not a shade
               scale, matching how they were originally authored) ──────── */
        primary       : 'var(--primary-color, #d94600)',
        'primary-900' : '#1a1f2e',
        'primary-800' : '#1e293b',

        /* ── Brand ───────────────────────────────────────────────────── */
        clove   : {
          DEFAULT: 'var(--clove, #c4710f)',
          light: 'var(--clove-light, #e07010)',
          dark : 'var(--clove-dark, #8b4800)',
          50  : '#fef3e8',
          100 : '#fce0ca',
          200 : '#f8be8f',
          300 : '#f3a060',
          400 : '#e08035',
          500 : '#d96a1f',
          600 : '#c44e12',
          700 : '#a33d10',
          800 : '#873318',
          900 : '#6f2b16',
          950 : '#3d1408',
        },
        gold    : {
          50  : '#fdf8ef',
          100 : '#f9eccf',
          200 : '#f3d8a0',
          300 : '#e9be6d',
          400 : '#dfa045',
          500 : '#c9a66b',
          600 : '#a88453',
          700 : '#8b6840',
          800 : '#735636',
          900 : '#5f472e',
        },

        /* ── Dark surface palette ────────────────────────────────────── */
        obsidian: {
          50  : '#484b52',
          100 : '#35383f',
          200 : '#252830',
          300 : '#1a1c21',
          400 : '#161819',
          500 : '#121314',
          600 : '#0f0f11',
          700 : '#0c0c0d',
          800 : '#0a0a0b',
          900 : '#070707',
        },

        /* ── Neon accent colours (chatbot, style-recommender, scan FX) ── */
        'neon-blue' : {
          50  : '#e6fffc',
          100 : '#b3fff3',
          200 : '#80ffe9',
          300 : '#4dffdf',
          400 : '#1affd6',
          500 : '#00f0ff',
          600 : '#00b8cc',
          700 : '#008099',
          800 : '#004866',
          900 : '#001f2d',
          950 : '#000f17',
        },
        'neon-purple': {
          50  : '#f3e8ff',
          100 : '#d8b6fe',
          200 : '#bd83fa',
          300 : '#a855f7',
          400 : '#9333ea',
          500 : '#7c3aed',
          600 : '#6b21a8',
          700 : '#581c87',
          800 : '#4a1559',
          900 : '#3a0f42',
          950 : '#220827',
        },

        /* ── Semantic aliases ────────────────────────────────────────── */
        accent  : 'var(--color-accent, #d94600)',
        cloud   : 'var(--cloud, #d0d0d5)',
        mist    : 'var(--mist, #888890)',
        smoke   : {
          DEFAULT: 'var(--smoke, #2a2b2e)',
          light  : 'var(--smoke-light, #3a3b3f)',
        },

        /* ── Neutral ────────────────────────────────────────────────── */
        neutral : {
          900 : '#050505',
          800 : '#0a0a0b',
          700 : '#121314',
          600 : '#161819',
          500 : '#1e2024',
          400 : '#2a2b2f',
          300 : '#3d3e44',
          200 : '#888890',
          100 : '#c8c8ce',
          50  : '#f0f0f2',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },
      boxShadow: {
        'glow-clove'   : '0 0  0 1px rgba(196,113,15,0.35), 0 0 12px rgba(196,113,15,0.20), 0 4px 22px rgba(0,0,0,0.40)',
        'glow-clove-lg': '0 0  0 1px rgba(196,113,15,0.45), 0 0 22px rgba(196,113,15,0.32), 0 8px 40px rgba(0,0,0,0.50)',
        'inner-glow'   : 'inset 0 0 22px rgba(196,113,15,0.10)',
        'glass'        : '0 8px 32px rgba(0,0,0,0.32)',
        'glass-lg'     : '0 16px 56px rgba(0,0,0,0.48)',
        'elevated'     : '0 20px 60px rgba(0,0,0,0.50)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.9rem', letterSpacing: '0.02em' }],
      },
      letterSpacing: {
        wider  : '.12em',
        widest : '.2em',
      },
      animation: {
        /* ── Primitive ─────────────────────────────────────────────── */
        'pole-spin'      : 'pole-spin 2s linear infinite',
        'spin-slow'      : 'spin 10s linear infinite',
        'pulse-gold'     : 'pulse-gold 2s ease-in-out infinite',
        'shimmer'        : 'shimmer 2s linear infinite',
        'fade-in-up'     : 'fade-in-up 0.6s ease-out forwards',
        'slide-up'       : 'slide-up 0.4s ease-out forwards',

        /* ── Composite (semantic) ─────────────────────────────────── */
        'card-shimmer'   : 'card-shimmer 1.6s linear infinite',
        'badge-pulse'    : 'badge-pulse 3s ease-in-out infinite',
        'scan-vertical'  : 'scan-vertical 2.5s linear infinite',
      },
      keyframes: {
        'pole-spin': {
          '0%'  : { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 -200%' },
        },
        'pulse-gold': {
          '0%, 100%' : { boxShadow: '0 0 0 0 rgba(217,70,0,0.40)' },
          '50%'      : { boxShadow: '0 0 0 8px rgba(217,70,0,0)' },
        },
        shimmer: {
          '0%'  : { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          '0%'  : { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%'  : { opacity: '0', transform: 'translateY(48px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        /* ── Additional ────────────────────────────────────────────── */
        'card-shimmer': {
          '0%'  : { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'badge-pulse': {
          '0%, 100%' : { opacity: '1' },
          '50%'      : { opacity: '0.6' },
        },
        'scan-vertical': {
          '0%'  : { top: '0%',  opacity: '0' },
          '10%' : { opacity: '1' },
          '90%' : { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config


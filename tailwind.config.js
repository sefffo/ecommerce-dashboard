/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#121212',
        'surface-2': '#181818',
        'surface-3': '#1f1f1f',
        'surface-4': '#262626',
        border: 'rgba(255,255,255,0.08)',
        'border-strong': 'rgba(255,255,255,0.12)',
        text: '#ededed',
        'text-2': '#a1a1aa',
        muted: '#71717a',
        faint: '#3f3f46',
        accent: '#0ea5e9',
        'accent-hover': '#38bdf8',
        'accent-soft': 'rgba(14,165,233,0.12)',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      screens: {
        xs: '420px',
      },
      boxShadow: {
        'elev-1': '0 1px 2px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset',
        'elev-2': '0 4px 12px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset',
        'elev-3': '0 20px 60px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset',
        'glow-accent': '0 0 0 1px rgba(14,165,233,0.35), 0 8px 28px -8px rgba(14,165,233,0.45)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.22s ease-out',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        slideInLeft: 'slideInLeft 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        slideUp: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        scaleIn: 'scaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

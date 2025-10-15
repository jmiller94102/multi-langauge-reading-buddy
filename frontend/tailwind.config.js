/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Child-friendly color palette (WCAG AA compliant)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b', // Main yellow/gold
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        success: {
          500: '#10b981', // Green for correct answers
          600: '#059669',
        },
        error: {
          500: '#ef4444', // Red for incorrect (used sparingly)
          600: '#dc2626',
        },
        // Pet emotion colors
        petHappy: '#10b981',
        petSad: '#6b7280',
        petAngry: '#ef4444',
        petHungry: '#f59e0b',
        petExcited: '#8b5cf6',
        petBored: '#9ca3af',
        petLove: '#ec4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'], // Headings
        mono: ['JetBrains Mono', 'monospace'], // Code/quiz
      },
      fontSize: {
        // Child-friendly sizes (minimum 18px for body)
        'child-xs': ['16px', { lineHeight: '1.5' }],
        'child-sm': ['18px', { lineHeight: '1.6' }], // Default body
        'child-base': ['20px', { lineHeight: '1.6' }],
        'child-lg': ['24px', { lineHeight: '1.5' }],
        'child-xl': ['28px', { lineHeight: '1.4' }],
        'child-2xl': ['32px', { lineHeight: '1.3' }],
      },
      spacing: {
        // Large touch targets for children
        touch: '44px', // Minimum touch target (WCAG 2.5.5)
        'touch-lg': '56px', // Larger for important actions
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        confetti: 'confetti 1s ease-out forwards',
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: 0 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

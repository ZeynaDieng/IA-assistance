/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C3EF1',
          dark: '#5829D6',
          darker: '#4F26CD',
          light: '#6C3EF1',
        },
        secondary: {
          DEFAULT: '#0D0F33',
          light: '#1A1D4D',
          dark: '#0A0C26',
        },
        success: {
          DEFAULT: '#4ADE80',
          dark: '#3BC670',
        },
        priority: {
          high: '#EF4444',
          medium: '#F59E0B',
          low: '#6C3EF1',
          completed: '#4ADE80',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'colored': '0 10px 15px -3px rgba(108, 62, 241, 0.3)',
        'colored-lg': '0 20px 25px -5px rgba(108, 62, 241, 0.4)',
        'purple': '0 10px 15px -3px rgba(108, 62, 241, 0.3), 0 4px 6px -2px rgba(108, 62, 241, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}

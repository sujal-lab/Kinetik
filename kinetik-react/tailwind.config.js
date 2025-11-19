/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'kinetik-light-bg-from': '#F7FBFB',
        'kinetik-light-bg-to': '#F2FBFB',
        'kinetik-light-text': '#05202A',
        'kinetik-light-text-muted': '#6B7280',
        'kinetik-dark-bg-from': '#07131A',
        'kinetik-dark-bg-to': '#05111A',
        'kinetik-dark-text': '#E6F7F2',
        'kinetik-dark-text-muted': 'rgba(230, 247, 242, 0.65)',
        'kinetik-mint': '#2DD4BF',
        'kinetik-cyan': '#30C0F0',
        'kinetik-coral': '#FF9A59',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
        'shimmer-pulse': 'shimmer-pulse 1.5s ease-in-out infinite',
        'pulse-bright': 'pulse-bright 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '100%': { transform: 'translateX(250%) skewX(-20deg)' },
        },
        'shimmer-pulse': {
          '0%, 100%': { opacity: '0.95', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(-2px)' },
        },
        'pulse-bright': {
            '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
            '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      },
    },
  },
  plugins: [],
}
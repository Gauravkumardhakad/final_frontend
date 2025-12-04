// tailwind.config.js
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  // THIS CONTENT LINE IS THE KEY CHANGE FOR VITE
  content: [
    "./index.html", // Add this line
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          start: '#0f172a',
          end: '#1e293b',
        },
        cyan: colors.cyan,
        blue: colors.blue,
      },
      boxShadow: {
        'glow-blue': '0 0 15px 5px rgba(59, 130, 246, 0.3)',
        'glow-cyan': '0 0 15px 5px rgba(6, 182, 212, 0.3)',
        'glow-green': '0 0 15px 5px rgba(34, 197, 94, 0.3)',
        'glow-yellow': '0 0 15px 5px rgba(234, 179, 8, 0.3)',
      }
    },
  },
  plugins: [],
}
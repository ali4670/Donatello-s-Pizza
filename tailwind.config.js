/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        podium: ['"FSP DEMO - PODIUM Sharp 4.11"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        amethyst: {
          dark: '#10002b',
          'dark-2': '#240046',
          ink: '#3c096c',
          velvet: '#5a189a',
          royal: '#7b2cbf',
          lavender: '#9d4edd',
          magic: '#c77dff',
          mauve: '#e0aaff',
        },
      },
      borderRadius: {
        bubble: '2rem',
        'bubble-lg': '3rem',
        'bubble-xl': '4rem',
      },
    },
  },
  plugins: [],
}

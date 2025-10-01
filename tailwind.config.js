/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'poke-yellow': '#FFCB05',
        'poke-blue': '#3B4CCA',
        'poke-red': '#FF0000',
      },
      gridTemplateColumns: {
        3: 'repeat(3, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        4: 'repeat(4, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}

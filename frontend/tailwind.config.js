/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontSize: {
        mid: ['0.875rem', '1.15rem'] 
      },
      colors: {
        'neutral-80': 'rgb(238, 239, 243)',
        'neutral-350': 'rgb(205, 205, 205)',
        'neutral-380': 'rgb(167, 176, 181)',

        'gray-450': 'rgb(117, 128, 138)',

        'sky-550': 'rgb(6, 102, 235)'
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontSize: {
        mid: ['0.875rem', '1.15rem'] 
      },
      colors: {
        'neutral-350': 'rgb(205, 205, 205)',
        'neutral-380': 'rgb(167, 176, 181)'
      }
    },
  },
  plugins: [],
}


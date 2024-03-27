/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {

    extend: {
      fontFamily: {
        'coke': 'coke'
      },
      colors: {
        green: colors.green,
        'gayblue': {
           600: '#0E76FD',
        },
        'gaygreen': {
          400: '#42f581',
        },
      },
    },
  },
  plugins: [
    // require('@tailwindcss/aspect-ratio'),
    require('flowbite/plugin')
  ],
}

